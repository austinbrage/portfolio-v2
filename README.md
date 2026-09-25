# Personal Portfolio

A modern, server-side rendered portfolio website built with Express.js and a custom HTML6 template engine.

## Tech Stack

- **Backend**: Express.js + TypeScript
- **Template Engine**: HTML6 (component-based, server-side rendering)
- **Frontend**: Alpine.js for interactivity
- **Styling**: Custom CSS with dark mode support
- **Markdown**: `marked`, for blog posts and extended project write-ups
- **i18n**: Multi-language support (English/Spanish)

## Features

- 🌐 Internationalization (English & Spanish)
- 🌓 Dark mode support
- 📱 Fully responsive design
- ⚡ Server-side rendering for fast initial load
- 🎨 Component-based architecture
- 🔄 Hot reload in development
- 📝 Markdown-backed blog posts and project write-ups (images, links, code blocks), with slug-based URLs
- 🔍 SEO: canonical URLs, hreflang alternates, Open Graph & Twitter Card metadata, `robots.txt`
- 🧯 Custom Service Down and 404 pages, shared across every controller
- 📦 Production asset bundling (single hashed CSS/JS bundle + `manifest.json`), with a local per-file fallback in dev
- 🗂️ Environment-aware content: fixture data for dev/test runs, a separate "live" dataset for real content

## Project Structure

```
portfolio-v2/
├── src/
│   ├── components/       # Reusable HTML6 components (navbar, layout, hero, footer, sections...)
│   ├── views/            # Page templates (home, projects, blog, contact, service-down, not-found...)
│   ├── controllers/      # Route handlers (one per page, plus not-found.controller.ts)
│   ├── services/         # Core services:
│   │   ├── html6.service.ts       # Compiles/renders HTML6 templates, loads components
│   │   ├── i18n.service.ts        # Translation lookup
│   │   ├── content.service.ts     # Loads projects/posts/experiences JSON (fixtures or live)
│   │   ├── markdown.service.ts    # Loads & parses blog/project markdown (fixtures or live)
│   │   └── system.service.ts      # Shared Service Down error page
│   ├── utils/
│   │   ├── environments.ts        # startupTimestamp, contentBucket (fixtures vs live)
│   │   ├── bundle.ts              # Reads manifest.json for cssBundle/jsBundle
│   │   ├── seo.ts                 # buildSeoData(lang, path) - canonical + hreflang
│   │   └── pipes.ts               # HTML6 template pipes
│   ├── locales/          # Translation files (en.ts, es.ts)
│   └── index.ts          # Express server entry point & routes
├── content/
│   ├── fixtures/         # Sample content used by dev-test/test (and any unset/unrecognized NODE_ENV)
│   │   ├── projects/, posts/, experiences/   # {lang}.json
│   │   └── blog/, project/                   # {lang}/{slug}.md
│   └── live/             # Real content used by development/production
│       ├── projects/, posts/, experiences/   # {lang}.json
│       └── blog/, project/                   # {lang}/{slug}.md
├── scripts/
│   └── bundle.ts          # Builds public/css/app.*.css + public/js/app.*.js + manifest.json
├── public/
│   ├── css/               # Component-specific styles
│   ├── js/                # Client-side scripts
│   ├── images/            # favicon.png, og-image.jpg
│   └── robots.txt
├── Makefile               # make bundle / make bundle-clean
└── docs/
    ├── HTML6.md                     # Template engine documentation
    ├── prompt.md                    # Project context guide
    ├── static-site-generation.md    # SSG migration plan
    └── s3-content-storage.md        # S3-backed content plan (superseded by SSG)
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
# Run dev server with hot reload - real ("live") content
pnpm dev

# Run dev server against fixture content instead (NODE_ENV=dev-test)
pnpm dev:test
```

Server runs at `http://localhost:5173`

### Production

```bash
# Build TypeScript
pnpm build

# Bundle CSS/JS into a single hashed file each + manifest.json, then start
pnpm start
```

`pnpm start` runs the bundle step automatically. To manage bundles manually:

```bash
pnpm bundle          # or: make bundle
pnpm bundle-clean    # or: make bundle-clean
```

Bundled output (`public/css/app.*.css`, `public/js/app.*.js`, `manifest.json`) is gitignored - it's build output, regenerated on demand.

### Static Export (Cloudflare Pages)

The whole site is content-driven (no per-request server logic left once the contact form posts directly to Web3Forms), so it ships as pre-rendered static HTML instead of a running server.

```bash
pnpm run pages:build
```

Pre-renders every page (both languages, every project/blog/experience, both 404 pages) into `out/`, plus copies `public/` assets. Uses `content/live/` (`NODE_ENV=production`), so requires a real `WEB3FORMS_ACCESS_KEY` to be set (it's baked into the HTML at generation time).

**Cloudflare Pages project settings:**

| Setting                  | Value                       |
| ------------------------- | ---------------------------- |
| Framework preset          | None                         |
| Build command             | `pnpm run pages:build`       |
| Build output directory    | `out`                        |
| Root directory             | `/`                           |
| Environment variable      | `WEB3FORMS_ACCESS_KEY`       |

Connect the GitHub repo with `main` as the production branch to get build-and-deploy on every push. `out/` is gitignored - it's build output, regenerated on every deploy.

## Contact Form (Web3Forms)

Create a `.env` from `.env.example` and set `WEB3FORMS_ACCESS_KEY`.

| Environment | Website URL to register on Web3Forms |
| ----------- | ------------------------------------- |
| Local       | `http://localhost:5173`               |
| Production  | your production domain                |

Create a separate form/key per environment at [web3forms.com](https://web3forms.com).

## Content: Fixtures vs Live

`ContentService` (projects/posts/experiences JSON) and `MarkdownService` (blog/project markdown) both read from a `content/{bucket}/` folder, where the bucket is picked once at boot by `contentBucket` in `src/utils/environments.ts`:

| `NODE_ENV`                          | Bucket      |
| ------------------------------------ | ----------- |
| `development`, `production`          | `live`      |
| `dev-test`, `test`, anything else     | `fixtures`  |

`fixtures` is the safe default - a misconfigured or unset `NODE_ENV` can never accidentally serve unfinished real content. `content/live/` holds the real data; editing it requires no code changes.

## Routing & Slugs

Blog posts and projects are addressed by `slug` (e.g. `/en/blog/building-scalable-react`, `/en/projects/ecommerce-platform`), not numeric id. Each JSON entry in `content/*/posts` and `content/*/projects` carries its own `slug`, used both for the URL and for locating the matching markdown file (`content/*/blog/{lang}/{slug}.md`, `content/*/project/{lang}/{slug}.md`). A missing/invalid `:lang` or unmatched slug falls through to the shared 404 page instead of guessing.

## Error Pages

- **Service Down** (`system.service.ts` + `service-down.html`): returned by every controller's catch block on an unexpected render error (HTTP 500), instead of a bare error string.
- **Not Found** (`not-found.controller.ts` + `not-found.html`): a catch-all Express middleware registered after every route (HTTP 404), also used whenever `:lang` doesn't match a supported language.

Neither page sets `Cache-Control` (errors shouldn't be cached), and both include `<meta name="robots" content="noindex, nofollow">` via the shared layout.

## SEO

Every real page gets, via `buildSeoData(lang, path)` in `src/utils/seo.ts`:

- `<link rel="canonical">`
- `<link rel="alternate" hreflang="...">` per supported language + `x-default`
- Open Graph (`og:type`, `og:url`, `og:title`, `og:description`, `og:image` + dimensions)
- Twitter Card (`summary_large_image`, title/description/image)
- `Cache-Control: public, max-age=3600, s-maxage=3600` (browser + CDN edge cache)

`public/robots.txt` is fully permissive (`Allow: /`) - this app has no auth-gated routes to disallow.

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

- English: `http://localhost:5173/en`
- Spanish: `http://localhost:5173/es`

Translations are managed in `src/locales/` and accessed via the `t()` function in templates.

## License

MIT

## Author

Agustin Brage (Austin Brage)
