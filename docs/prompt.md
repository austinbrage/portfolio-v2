# Portfolio V2 Project Context

## Project Overview

This is a server-side rendered portfolio website built with:
- **Backend**: Express.js + TypeScript
- **Template Engine**: HTML6 (custom component-based templating)
- **Frontend**: Alpine.js for interactivity
- **Styling**: CSS (transitioning from Tailwind-based design)
- **i18n**: Multi-language support (English & Spanish)

## Project Structure

```
portfolio-v2/
├── src/
│   ├── components/       # Reusable HTML6 components
│   │   ├── layout.html   # Base HTML structure
│   │   └── navbar.html   # Navigation component
│   ├── views/            # Page templates
│   │   └── home.html     # Home page view
│   ├── controllers/      # Page controllers (data & rendering logic)
│   │   └── home.controller.ts
│   ├── services/         # Core services
│   │   ├── html6.service.ts  # Template compilation service
│   │   └── i18n.service.ts   # Translation service
│   ├── locales/          # Translation files
│   │   ├── en.ts
│   │   ├── es.ts
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── pipes.ts      # HTML6 custom pipes
│   └── index.ts          # Express server entry point
├── public/
│   ├── css/              # Component-specific stylesheets
│   │   ├── layout.css
│   │   └── navbar.css
│   └── js/               # Client-side JavaScript
│       └── navbar.js
├── design/               # React/Tailwind reference UI (separate project)
│   └── src/
│       └── components/   # UI components to replicate
│           ├── Hero.tsx
│           ├── Projects.tsx
│           └── ...
└── docs/
    ├── HTML6.md          # HTML6 template engine documentation
    └── prompt.md         # This file

```

## HTML6 Template Engine

HTML6 is a custom component-based template engine that enhances HTML5. Key features:

### Components
- Defined with `<template is="component-name" prop="type">...</template>`
- Used as custom tags: `<component-name prop="value"></component-name>`
- Supports slots: `<slot></slot>` for nested content
- Props accessed via `{{props.propName}}`

### Interpolation
- Variables: `{{variableName}}`
- Object properties: `{{object.property}}`
- Pipes: `{{value |> pipeName}}` or `{{value |> pipeName param}}`

### Control Flow
- Conditionals: `if="expression"`, `elsif="expression"`, `else`
- Loops: `map="item of items"` or `map="item, index of items"`

### Important Rules
1. **All variables must be defined**: Every variable used in templates must be provided in render data
2. **Props must be valid JS identifiers**: Use camelCase (e.g., `maxCount`), NOT kebab-case (e.g., `max-count`)
3. **Code style**: Use `var` instead of `const/let`, `function` instead of arrow functions

See `docs/HTML6.md` for complete documentation.

## How the App Works

### 1. Request Flow
```
User Request → Express Route → Controller → HTML6 Service → Compiled HTML → Response
```

### 2. Component System
Components in `src/components/` are automatically loaded by `html6.service.ts`:
- All `.html` files are discovered recursively
- Components are compiled once and cached (dev: reloaded on each request)
- Components can be nested and composed

### 3. Views
Views in `src/views/` are page templates that:
- Use components via custom tags (e.g., `<layout>`, `<ui-navbar>`)
- Receive data from controllers
- Are compiled and rendered on each request (dev) or cached (production)

### 4. Controllers
Controllers in `src/controllers/`:
- Load view templates
- Prepare render data (title, descriptions, translations, etc.)
- Call `compile()` to get a renderer
- Call `renderer.render(data)` to generate HTML

Example from `home.controller.ts`:
```typescript
const renderData = {
  title: "Austin Brage",
  description: "Austin Brage - Personal portfolio",
  lang,
  t,  // Translation function
  currentPage: "home",
  navItems: [...],
  languages: [...]
};
return renderer.render(renderData);
```

### 5. Routing
Routes defined in `src/index.ts`:
- Support language-specific paths: `/:lang` or `/`
- Controllers handle rendering logic
- Static files served from `public/`

### 6. Client-Side Assets
- **CSS**: Component-specific stylesheets in `public/css/`
- **JS**: Alpine.js components in `public/js/`
- **Loading**: All assets referenced in `layout.html` with cache-busting timestamps (dev mode)

## The Design Folder

The `design/` folder is a **separate React + Tailwind CSS project** used as a UI reference:
- **Purpose**: Visual design and component structure reference
- **Not part of the app**: Don't import or use its code directly
- **Task**: Replicate components from `design/src/components/` to `src/components/`

### Design Tech Stack
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Lucide icons
- Vite

## Workflow: Copying Components from Design to Src

When replicating a component from `design/` to `src/`:

### 1. Analyze the Design Component
- Read the `.tsx` file (e.g., `design/src/components/Hero.tsx`)
- Note the structure, classes, content, and functionality
- Identify interactive elements (buttons, dropdowns, etc.)

### 2. Convert to HTML6
- Create a new `.html` file in `src/components/` (e.g., `src/components/hero.html`)
- Define as a template: `<template is="ui-hero" ...props>`
- Convert JSX to HTML
- Convert Tailwind classes to custom CSS
- Replace React props with HTML6 props
- Use Alpine.js for interactivity (if needed)

### 3. Create Corresponding CSS
- Create a CSS file in `public/css/` (e.g., `public/css/hero.css`)
- Convert Tailwind utility classes to custom CSS
- Use CSS custom properties for theming (light/dark mode)
- Keep responsive design using media queries

### 4. Create Client-Side JS (if needed)
- Create a JS file in `public/js/` (e.g., `public/js/hero.js`)
- Use Alpine.js for reactive state and interactivity
- Keep JavaScript minimal and component-scoped

### 5. Update Layout
- Add CSS link to `src/components/layout.html`:
  ```html
  <link rel="stylesheet" href="/css/hero.css{{timestamp ? `?v=${timestamp}` : ''}}" />
  ```
- Add JS script (if needed):
  ```html
  <script defer src="/js/hero.js{{timestamp ? `?v=${timestamp}` : ''}}"></script>
  ```

### 6. Use in Views
- Add component to view (e.g., `src/views/home.html`):
  ```html
  <ui-hero
    title="{{title}}"
    description="{{description}}"
  ></ui-hero>
  ```

### 7. Update Controller
- Add required data to render object in controller
- Ensure all variables used in component are provided

## Example: Converting a Component

### React Component (design/src/components/Hero.tsx)
```tsx
<Button onClick={onViewWork} className="bg-gradient-to-r from-purple-600">
  View My Work
  <ArrowRight className="ml-2" />
</Button>
```

### HTML6 Component (src/components/hero.html)
```html
<template is="ui-hero" title="string" description="string">
  <section class="hero-section">
    <button class="hero-cta-primary">
      View My Work
      <svg class="hero-icon-arrow"><!-- SVG path --></svg>
    </button>
  </section>
</template>
```

### CSS (public/css/hero.css)
```css
.hero-cta-primary {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(to right, #9333ea, #db2777);
  /* ... */
}

.hero-icon-arrow {
  margin-left: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
}
```

## Current State

### Completed
- ✅ Project structure set up
- ✅ HTML6 service configured
- ✅ Layout component created
- ✅ Navbar component created and styled
- ✅ Home controller and view set up
- ✅ i18n service configured
- ✅ Express server running

### Next Steps
- Create Hero component based on `design/src/components/Hero.tsx`
- Create additional page components (Projects, Experience, Contact, etc.)
- Implement routing for all pages
- Add more interactive features

## Tips for AI Assistants

1. **Always read HTML6.md first** to understand the template syntax
2. **Check existing components** (layout.html, navbar.html) for patterns
3. **Verify all variables** are defined in controller before using in templates
4. **Use camelCase for props**, never kebab-case
5. **Keep CSS modular**: One file per component in `public/css/`
6. **Preserve Alpine.js patterns** from existing components (navbar.js)
7. **Don't copy Tailwind classes directly**: Convert to semantic CSS classes
8. **Maintain consistent naming**: Use `ui-` prefix for components (e.g., `ui-hero`, `ui-navbar`)
9. **Test in both themes**: Components should work in light and dark mode
10. **Keep it simple**: HTML6 is simpler than React - embrace the simplicity

## Common Patterns

### Component Definition
```html
<template is="ui-component-name" prop1="string" prop2="number">
  <!-- Component content -->
  {{props.prop1}}
  <slot></slot>
</template>
```

### Using Components
```html
<ui-component-name
  prop1="{{variable}}"
  prop2="123"
>
  <div>Slot content</div>
</ui-component-name>
```

### Alpine.js Integration
```html
<div x-data="componentName()">
  <button @click="methodName()">Click me</button>
  <div x-show="isVisible">Content</div>
</div>
```

### Conditional Rendering
```html
<div if="user">Welcome {{user.name}}</div>
<div elsif="isLoading">Loading...</div>
<div else>Please login</div>
```

### List Rendering
```html
<ul>
  <li map="item of items">{{item.name}}</li>
</ul>
```

## Translation System

Use the `t` function in templates:
```html
{{t('home.welcome')}}
```

Translation keys defined in `src/locales/en.ts` and `src/locales/es.ts`.

## Development Commands

- `pnpm dev` - Start dev server with hot reload
- `pnpm build` - Compile TypeScript
- `pnpm start` - Run production server

---

**Last Updated**: 2025-12-30
