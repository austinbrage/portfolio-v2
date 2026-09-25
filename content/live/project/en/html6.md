## It's just .html

Every HTML6 template is a real `.html` file. Not `.pug`, not `.hbs`, not a `.jsx` file pretending to be markup. It's HTML with a few extra attributes and `{{ }}` sprinkled in, so your editor, Prettier, and every linter you already have already understand it.

That's the actual differentiator, more than any single feature below. No plugin to install, no new extension for your tooling to learn, no build step standing between the file you write and the file the browser would recognize as HTML. A UI/UX designer with zero JavaScript experience can open the file and follow exactly what it's doing.

## Real JavaScript, not a mini-language

Interpolations and conditionals run **real JavaScript expressions** against the render scope, not a simplified template language that only looks similar:

```html
<h1>{{title}}</h1>
<div if="user.loggedIn">Welcome back</div>
<div elsif="user.pending">Pending approval</div>
<div else>Please log in</div>
```

If it's valid JavaScript, it's valid inside `{{ }}` or an `if`. There's no mini-language to look up.

## Loops with map

`map` loops over arrays directly on the tag, with an optional index and its own `if`:

```html
<ul>
  <li map="p, i of projects" if="p.title.length > 0">{{i}}: {{p.title}}</li>
</ul>
```

Nested loops work the same way, one `map` attribute per level:

```html
<div map="group of groups">
  <h2>{{group.name}}</h2>
  <ul>
    <li map="item of group.items">{{item}}</li>
  </ul>
</div>
```

## Pipes for safe transforms

Function calls inside `{{ }}` are disabled for security. `|>` chains transforms onto a value instead:

```html
{{title |> upper |> truncate 20}}
{{price |> formatCurrency}}
{{date |> formatDate 'YYYY-MM-DD'}}
```

Pipes are just functions registered by name, so adding a new one is a few lines of JavaScript, not a change to the template language itself:

```js
var pipes = {
  upper: (x) => String(x).toUpperCase(),
  truncate: (x, len) => String(x).slice(0, len)
}

html6.compile(template, { pipes })
```

## Components, slots, and isolated props

`<template is="...">` defines a component. `<slot>` marks where its children get inserted. Props stay isolated to that component, while everything else in the outer scope flows down automatically, without being re-declared at every level:

```html
<template is="card" title="string">
  <div class="card">
    <h2>{{props.title}}</h2>
    <slot></slot>
  </div>
</template>
```

```html
<card title="Hi {{user.name}}">
  <p>Rendered from the slot.</p>
</card>
```

## Compiles once, runs on every request

`compile()` takes the template and returns a render function. That's the expensive part, so it only runs once, at startup, and the result gets cached. Every request after that just calls that cached render function with fresh data.

<figure>
<svg viewBox="0 0 690 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing a template compiling once into a render function, then fanning out to serve multiple requests without recompiling">
  <text x="345" y="20" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">one compile, many renders</text>
  <defs>
    <marker id="html6flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <rect x="15" y="90" width="210" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="120" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Template compiles</text>
  <text x="120" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">once, at startup</text>
  <line x1="225" y1="135" x2="285" y2="135" stroke="currentColor" stroke-width="1.5" />
  <path d="M305 100 L280 140 L298 140 L285 175 L325 130 L303 130 Z" fill="currentColor" />
  <line x1="330" y1="135" x2="555" y2="45" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6flow-arrow)" />
  <line x1="330" y1="135" x2="555" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6flow-arrow)" />
  <line x1="330" y1="135" x2="555" y2="225" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6flow-arrow)" />
  <rect x="560" y="20" width="46" height="50" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" />
  <line x1="568" y1="35" x2="598" y2="35" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <line x1="568" y1="48" x2="590" y2="48" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <rect x="560" y="110" width="46" height="50" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" />
  <line x1="568" y1="125" x2="598" y2="125" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <line x1="568" y1="138" x2="590" y2="138" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <rect x="560" y="200" width="46" height="50" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" />
  <line x1="568" y1="215" x2="598" y2="215" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <line x1="568" y1="228" x2="590" y2="228" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
</svg>
<figcaption>Compiling depends only on the template, so it happens once and gets cached. Rendering depends only on the data, so every request just calls that cached function again. An already fast engine, made even faster: compiling never runs twice.</figcaption>
</figure>

## Where it actually runs

HTML6 first shipped in production at [Nobo](https://en.nobo.no/), the workplace this all started at. It also powers [Ultimate Learning](https://ultimatelearning.app/), a language-learning app I actively maintain. Two real production sites, not a demo that got built once and abandoned.
