## Test-first, not "add tests later"

Before HTML6, my testing habit was the common one: build the feature, then backfill a handful of tests. Confirm the obvious cases work, move on.

My manager at Eldøy pushed something stricter, a practice called Test-Driven Development (TDD): write a focused unit test for a function *before* writing the function. Make sure it actually covers the range of inputs that function could see, not just the happy path.

<figure>
<svg viewBox="0 0 690 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of the TDD cycle: write a failing test, make it pass, refactor, then repeat">
  <defs>
    <marker id="html6tdd-cycle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <text x="340" y="20" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">repeat, one test case at a time</text>
  <path d="M 570 130 C 570 35, 110 35, 110 130" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#html6tdd-cycle-arrow)" />
  <line x1="205" y1="175" x2="240" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6tdd-cycle-arrow)" />
  <line x1="435" y1="175" x2="470" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6tdd-cycle-arrow)" />
  <rect x="15" y="130" width="190" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="110" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Write a failing test</text>
  <text x="110" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">red</text>
  <rect x="245" y="130" width="190" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="340" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Make it pass</text>
  <text x="340" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">green</text>
  <rect x="475" y="130" width="190" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="570" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Refactor</text>
  <text x="570" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">still green</text>
</svg>
<figcaption>The cycle behind every function in HTML6: a failing test first, the smallest change that passes it, then cleanup, before moving to the next case.</figcaption>
</figure>

It felt slower at first: writing the test before the function means deciding what it should do before getting pulled into how it'll do it. It stopped feeling like overhead once that habit meant every new function started from a clear, narrow spec instead of a blank page.

## Building one function at a time

[HTML6](https://github.com/eldoy/html6) compiles a template through a pipeline of small, separate pieces:

- **Parser** — turns raw HTML into a tree
- **Transpiler** — turns that tree into a render function
- **Masking** — hides special tags (`if`, `elsif`, `else`, `map`) behind placeholders during compilation
- **Chain-walker** — resolves `if`/`elsif`/`else` sequences across sibling elements
- **Topological sort** — orders component compilation by dependency

Each one lives in its own file. Each one got its own test suite before it was wired into the next piece.

Code with a real test suite around it is code you can change with confidence. Code you're only testing indirectly, through the whole pipeline, is code you're afraid to touch.

## A bug caught before it ever shipped

This is where test-first actually earns its name. The test isn't written after you find a bug. Writing it is how you find the bug.

Take a simple template: loop over a list and render each item.

```html
<li map="p of ps">{{p}}</li>
```

Covering the range of inputs, the way the habit demands, means testing what happens when the list itself is `null`, not just when it's empty. Writing that test is what surfaced the problem: the compiled code called `.map()` directly on whatever came in, and `.map()` on `null` throws.

Red first:

```js
return mapArg.map(function(project) { ... })
```

Then the fix, one line:

```js
return (mapArg || []).map(function(project) { ... })
```

Green. And the test that found the bug is the same one that now guards against it coming back:

```js
test('map - empty', async ({ t }) => {
  var page = '<ul><li map="p of ps">{{p}}</li></ul>'
  var renderer = html.compile(page)
  var data = { ps: null }
  var result = renderer.render(data)
  t.equal(result, '<ul></ul>')
})
```

That's the actual habit test-first builds: not "never break anything," but "find the break yourself, before anyone else does, by testing the case you'd otherwise have skipped."

## What it changed

This discipline is a big part of why I could later rewrite HTML6's entire compiler for speed with real confidence, instead of it being a leap of faith. Rewriting code that's genuinely covered, function by function, is a different kind of risk than rewriting code held together by manual spot-checks and hope.
