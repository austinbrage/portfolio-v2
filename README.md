# Personal Portfolio

A modern, server-side rendered portfolio website built with Express.js and a custom HTML6 template engine.

## Tech Stack

- **Backend**: Express.js + TypeScript
- **Template Engine**: HTML6 (component-based, server-side rendering)
- **Frontend**: Alpine.js for interactivity
- **Styling**: Custom CSS with dark mode support
- **i18n**: Multi-language support (English/Spanish)

## Features

- 🌐 Internationalization (English & Spanish)
- 🌓 Dark mode support
- 📱 Fully responsive design
- ⚡ Server-side rendering for fast initial load
- 🎨 Component-based architecture
- 🔄 Hot reload in development

## Project Structure

```
portfolio-v2/
├── src/
│   ├── components/       # Reusable HTML6 components
│   ├── views/            # Page templates
│   ├── controllers/      # Route handlers
│   ├── services/         # Core services (HTML6, i18n)
│   ├── locales/          # Translation files (en.ts, es.ts)
│   └── index.ts          # Express server entry point
├── public/
│   ├── css/              # Component-specific styles
│   └── js/               # Client-side scripts
└── docs/
    ├── HTML6.md          # Template engine documentation
    └── prompt.md         # Project context guide
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run dev server with hot reload
pnpm dev
```

Server runs at `http://localhost:3000`

### Production

```bash
# Build TypeScript
pnpm build

# Run production server
pnpm start
```

## HTML6 Template Engine

This project uses HTML6, a custom component-based template engine. Key features:

- **Components**: Define reusable components with props
- **Interpolation**: Use `{{variable}}` for data binding
- **Control Flow**: `if`, `elsif`, `else` attributes
- **Loops**: `map` attribute for iterating arrays
- **Pipes**: Transform data with `{{value |> pipeName}}`

See `docs/HTML6.md` for complete documentation.

## Internationalization

The site supports multiple languages via the URL path:
- English: `http://localhost:3000/en`
- Spanish: `http://localhost:3000/es`

Translations are managed in `src/locales/` and accessed via the `t()` function in templates.

## License

MIT

## Author

Agustin Brage (Austin Brage)
