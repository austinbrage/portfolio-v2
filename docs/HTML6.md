# HTML6

HTML6 is a library used to create HTML. It's meant to enhance static HTML5 to make it more dynamic.

## Usage

Simple usage

```js
var html6 = require("html6");

var renderer = html6.compile("<h1>Hello</h1>");
var result = renderer.render({});
// Outputs: <h1>Hello</h1>
```

Usage with components

```js
var components = ['<template is="card" title="string"><span>{{props.title}}</span><slot></slot></template>']

var renderer = html6.compile("<card title="title"><span>there</span></p>", { components: components });

var result = renderer.render({ title: 'Hello' });
// Outputs: <span>Hello</span><span>there</span>
```

## Expressions

Anywhere in your templates you can write {{...}} to output data:

```html
{{title}} {{project.name}}
```

To show literal brackets use \{{...}}

## Pipes

Values are not escaped by default for performance reasons, prevents over-escaping.

1 built-in pipe: esc

{{value |> esc}}

Pipes can be passed as an argument to the `compile` function:

```js
var pipes = {
  truncate: function (x, len) {
    return String(x).slice(0, len);
  },
  upper: function (x) {
    return String(x).toUpperCase();
  },
};

var renderer = html6.compile("<p>{{title |> upper}}</p>", { pipes: pipes });
```

Note to LLM: Do not use "esc" as example above, it's built in already. Make sure parameters to pipes are valid Javascript expressions!

Pipes take any valid Javascript expression as argument. Generate at least 10 examples here, simple, nested.

{{value |> esc |> truncate 2}}

## Components

Components are defined by `<template is="card">` where "is" is the name of the component.

It's used like this:

```html
<card></card>
```

## Component Slots

Slots are defined on the component:

```html
<template is="card"><slot></slot></template>
```

It's used like this:

```html
<card><div>slot content</div></div>
```

## Component props

You can pass props to components. When defining a component like this:

- The props can be listed on as atributes as well for documentations, with simple types as values like `string`, `number`, `boolean`, `array`, `object`.

```html
<template is="card" title="string">{{props.title}}</template>
```

you can pass strings like this:

```html
<card title="hello"></card>
```

To pass values from scope or native values:

```html
<card title="{{value}}"></card>
```

Interpolated string, using scoped value:

```html
<card title="hi {{name}}"></card>
```

Generate more examples here for number, boolean etc.

## Conditionals

```
<div if="expression"></div>
<div elsif="expression"></div>
<div else></div>
```

"expression" here is any valid Javascript expression.

## Map

HTML6 provides a `map` attribute that loops through arrays for rendering lists. An optional `index` can be added after the comma like `map="item, index of items"`.

- Tags with `map` attributes can use the `if` attribute too.

Without index:

```html
<ul>
  <li map="item of items">{{item.name}}</li>
  <li map="p of projects" if="p.title.length > 0">{{p.title}}</li>
</ul>
```

With index (index name is optional):

```html
<ul>
  <li map="item, index of items">{{index}}: {{item.name}}</li>
  <li map="p of projects" if="p.title.length > 0">{{p.title}}</li>
</ul>
```

---

## Component Development Guidelines

### Props Naming Rules

**IMPORTANT:** Component props must be valid JavaScript variable names. This means:

✅ **Valid props:**

```html
<ui-card title="My Title" isActive="true" maxCount="5">
  <ui-button type="primary" disabled="false">
    <ui-input placeholder="Enter text" minLength="3"></ui-input></ui-button
></ui-card>
```

❌ **Invalid props (avoid these):**

```html
<ui-card data-title="My Title">
  <!-- Contains dash -->
  <ui-button max-count="5">
    <!-- Contains dash -->
    <ui-input min-length="3"> <!-- Contains dash --></ui-input></ui-button
  ></ui-card
>
```

**Reason:** HTML6 converts props to JavaScript object properties. Props like `data-name` would become `props["data-name"]` which is invalid JavaScript syntax for direct property access.

**Best practices:**

- Use camelCase: `maxCount`, `isActive`, `currentUser`
- Use simple names: `title`, `type`, `disabled`
- Avoid dashes, underscores, and special characters
- Keep prop names descriptive but concise

---

**Variable Definition Requirements:**

HTML6 requires ALL variables used in templates to be explicitly passed in the render data object. If a variable is referenced in the template but not provided, HTML6 will throw an error.

```html
<!-- Template using variables -->
<div>{{title}}</div>
<div>{{content}}</div>
```

```js
// ❌ This will error - 'content' is not defined
renderer.render({ title: "Hello" });

// ✅ This works - all variables provided
renderer.render({
  title: "Hello",
  content: "Some content",
});

// ✅ This also works - empty string is valid
renderer.render({
  title: "Hello",
  content: "",
});
```

This applies to:

- Template variables: `{{variable}}`
- Conditional expressions: `if="variable"`
- Component props: All referenced props must be defined

Always ensure your render data includes all template variables, even if they're empty strings or null values.

---

Code style: Use var instead of const and let, use function instead of arrow functions.