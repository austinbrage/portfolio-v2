## Why not just use an existing template engine

There's no shortage of server-side template engines already — [Pug](https://pugjs.org), EJS, [Handlebars](https://handlebarsjs.com), Nunjucks.

What kept pulling us back to building our own was a narrower requirement: I wanted interpolations, conditionals, and pipe arguments to accept **real JavaScript expressions** — not a restricted template-language subset that almost, but doesn't quite, do what a normal conditional does.

Handlebars-style engines deliberately keep logic out of templates. I wanted the opposite: trust the template author with real expressions, and put the safety elsewhere (see below).

```html
<li map="p of projects" if="p.title.length > 0">{{p.title}}</li>
```

That condition isn't a mini-DSL comparison — it's evaluated as actual JavaScript against the render scope. Anything valid in a JS expression is valid there.

![Code editor showing template syntax](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80)

## The escaping trade-off

Interpolated values are **not** HTML-escaped by default. Escaping every interpolation costs real time at scale, and most values flowing through a server-rendered template — translated strings, already-sanitized content, numbers, computed labels — don't need it.

One built-in pipe opts a specific value into escaping instead:

```html
{{userComment |> esc}}
```

The trade-off is real. It pushes a security-relevant decision onto whoever writes the template, for every single interpolation, rather than making the safe choice the silent default. I went back and forth on this more than once.

What settled it: nearly everything rendered through HTML6 in practice is either author-controlled content or already-escaped upstream. The interpolations that do need escaping are usually easy to spot at the call site.

It's the kind of trade-off I'd revisit if this were ever handling arbitrary untrusted user input directly in templates at a larger scale.

## Components: shared scope, isolated props

A component gets its own isolated *props* namespace. Everything else in the outer render scope — the active language, the translator function, a cache-busting timestamp — flows down automatically, without being re-declared at every nesting level:

```html
<template is="layout" title="string" description="string">
  <html lang="{{lang || 'en'}}">
    ...
  </html>
</template>
```

The active language here was never listed as a prop of this component. It's simply *visible*, inherited from whatever called the top-level render with that data.

Only **title** and **description** are actual props — those are things a caller should explicitly set per use, not inherit implicitly.

Prop names also have to be valid JavaScript identifiers: camelCase, not dash-separated. They become direct property access under the hood, and a dash in a name would make that access invalid syntax.

It's a small constraint, but a much cheaper one to enforce upfront than to explain after the fact — so it's simply how components are written from the start.

## Fail loud, not quiet

The rule I'm most opinionated about: every variable a template references has to be present in the data object passed to render, even if it's just an empty string.

A referenced-but-missing variable throws immediately, instead of silently printing nothing.

I added this after chasing one too many blank sections in rendered HTML that turned out to be a forgotten field in a controller three files away. With strict variables, that mistake now surfaces the moment you render — not whenever someone happens to notice the empty section on the page.

## Built test-first, function by function

My manager at Eldøy pushed me to build HTML6 test-first: a small, focused unit test suite for every function — the parser, the masking/unmasking compiler step, the expression evaluator, the component-scope resolver — each one covering its full range of inputs before the implementation that made those tests pass even existed.

It's part of why the masking/unmasking rewrite (the whole reason HTML6 ended up this fast) was something I could attempt with real confidence. Rewriting a compiler that already has a genuine test suite around every piece is a different kind of risk than rewriting one held together by manual spot-checks.

## Where it actually runs

HTML6 first shipped in production at [Nobo](https://en.nobo.no/) — the very first deployed site to run it, and the workplace this all started at.

It also powers [Ultimate Learning](https://ultimatelearning.app/), a language-learning app I actively maintain. Each template compiles once, then renders per request from that compiled function — no re-parsing, no client-side hydration step.

It's a genuinely stable, production template engine at this point — not a toy that got built once and abandoned.
