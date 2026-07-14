# Static Site Generation (SSG)

## What this is

Right now, every page is rendered on-demand by Express: a request comes in,
a controller reads content from `content/*.json`, compiles/renders an HTML6
template, and sends the resulting HTML back — every single time, for every
visitor.

This portfolio has no auth, no per-user state, and no request-dependent data.
Content lives entirely in static JSON files (`content/projects`,
`content/posts`, `content/experiences`) and markdown (`content/blog`), read
via `ContentService`. Given the same `(lang, route, id)`, the output HTML is
always identical. That means rendering doesn't need to happen per-request at
all — it can happen once, at build time, producing plain `.html` files that
get served as-is.

That's Static Site Generation: run the existing render pipeline once for
every page/language/id combination, write the output to disk, and deploy the
resulting folder to a static host (e.g. Cloudflare Pages — the same product
already used for the React app) instead of running a persistent Express
server.

## Final goal

- A build script that produces a fully static `dist/` (or similar) folder:
  one `.html` file per page × language × dynamic id, plus copied assets.
- That folder deploys directly to Cloudflare Pages (or any static host/CDN),
  no EC2, no long-running Node process, no server to keep warm.
- The existing controllers, `html6.service.ts`, and `ContentService` are
  reused as-is — the generation script calls the same `.render(context, id)`
  methods that Express calls today, just ahead of time instead of per-request.

## Pros

- **No server at runtime.** Eliminates EC2/hosting cost and complexity for
  this app entirely — static files on a CDN edge.
- **Faster.** Every page is pre-compiled HTML served straight from cache;
  no per-request template compile/render/i18n lookup work.
- **Simpler production concerns.** The `isProd`/`isDev`,
  `reloadComponents`/`hasLogged`, and `warmupCache` machinery in
  `html6.service.ts` and the controllers becomes purely a build-time concern
  — nothing needs to "warm up" or "reload" in a process that never stays
  running.
- **Same Cloudflare deployment model as the React app** — one hosting
  pattern for both projects instead of two.
- **Low risk.** No framework change, no rewrite of controllers/services —
  the render logic is reused untouched.
- **SEO carries over cleanly, unchanged.** Canonical URLs, hreflang
  alternates, and Open Graph/Twitter tags are pure functions of
  `(lang, path)` — computed identically whether `buildSeoData()` runs at
  request time or build time. No adjustment needed here, unlike several
  other pieces below.

## Cons / tradeoffs

- **Rebuild required on content change.** Adding/editing a project, blog
  post, or experience means re-running the build and redeploying — no
  instant updates like a live server has. Acceptable for a portfolio, not
  for a CMS-driven site.
- **One-time build script to write and maintain.** Needs to enumerate every
  page combination (see steps below) — a bit of upfront work, though it's a
  thin wrapper around code that already exists.
- **Any future dynamic feature needs a separate answer.** If a real contact
  form (server-side submission), search, or anything with fresh
  per-request data is added later, that one endpoint would need a Cloudflare
  Pages Function or a third-party service (e.g. Formspree) — not the static
  build. Doesn't affect anything today since the contact page has no form
  backend, just static links/email.
- **Clean URLs depend on host support.** Output must follow the
  `path/index.html` convention (e.g. `en/projects/1/index.html` served at
  `/en/projects/1`) — need to confirm the static host resolves that
  (Cloudflare Pages does, most others do too).
- **Not-found page loses per-language detection.** Today,
  `NotFoundController` extracts the language from the request path and
  serves a translated 404 (`/es/whatever` → Spanish 404). Cloudflare Pages
  (and most static hosts) serve one global `404.html`, not a per-directory
  one — so this collapses to a single default-language 404 unless
  client-side JS is added to detect the attempted path and swap language
  after the fact. Decide which before generating it.
- **Cache-Control headers become dead code.** `context.set.headers
  ["Cache-Control"] = ...` in each controller has nothing to attach to at
  build time — there's no HTTP response object, just a string written to
  disk. Caching has to be reconfigured at the host level instead (e.g. a
  Cloudflare Pages `_headers` file), not in application code.
- **Service-down's automatic trigger stops making sense.** Its whole purpose
  is catching a *runtime* render failure and serving a graceful fallback
  instead of a crash. At build time, if a controller throws, the existing
  try/catch would silently write "Something Went Wrong" to disk as if it
  were the real page — wrong for a static build. A build-time failure should
  fail the build loudly (non-zero exit) instead; the service-down page's
  automatic catch/return should not be reused as-is inside the generation
  script (see step 2 below).

---

## Steps to follow

> This section will be removed once SSG is implemented — it's a working
> checklist, not permanent documentation.

1. **Add an "list all IDs" helper to `ContentService`** (or reuse
   `getProjects`/`getBlogPosts`/`getExperiences` directly) so the build
   script can enumerate every valid project/post/experience id per language,
   instead of guessing.

2. **Write a build script** (e.g. `scripts/generate-static.ts`), run with
   `NODE_ENV=production`, **after** `npm run bundle` has already produced
   `manifest.json` — the `cssBundle`/`jsBundle` filenames get baked
   permanently into every generated HTML file, so the bundle step must run
   first or every page will point at stale/missing asset filenames. The
   script:
   - Instantiates each controller (`HomeController`, `ProjectsController`,
     `ProjectController`, `BlogsController`, `BlogController`,
     `ContactController`, `ExperienceController`) — same as `index.ts` does.
   - For each language in `availableLanguages` (`en`, `es`):
     - Builds a fake `context` object identical to the one `index.ts`
       constructs per-request (`{ lang, set: { headers: {}, status: 200 } }`).
     - Renders the fixed pages: `home`, `projects`, `blog`, `contact`.
     - Fetches all project/post/experience ids for that language and renders
       each `project/:id`, `blog/:id`, `experience/:id` page.
   - Writes each rendered HTML string to disk, mirroring the URL structure:
     - `/` → `dist/index.html` (or a redirect/copy of `/en/`)
     - `/en` → `dist/en/index.html`
     - `/en/projects` → `dist/en/projects/index.html`
     - `/en/projects/1` → `dist/en/projects/1/index.html`
     - `/en/blog`, `/en/blog/:id`, `/en/contact`,
       `/en/experience/:id` follow the same pattern
     - repeat for `es`
   - **Does not** catch-and-continue on render errors the way the live
     server's `try/catch` → `renderServiceDown()` does. If a controller
     throws during generation, let the script fail loudly (non-zero exit)
     instead of silently writing the Service Down page to disk as if it
     were real content — there's no per-request retry to recover it later
     the way a live server has.

3. **Copy static assets**, including images. Copy `public/css`, `public/js`,
   `public/pdf`, **and `public/images`** (favicon, og-image — easy to miss,
   but `og:image`/favicon meta tags will 404 without it) into `dist/`
   unchanged (same paths, so template references don't need to change).

4. **Generate the 404 page and handle invalid/missing ids.** Render
   `NotFoundController` once to `dist/404.html` (Cloudflare Pages auto-serves
   this at the root for any unmatched path). Decide up front: this will be a
   single default-language 404 (simplest — pick `en`), not the current
   per-request language-detected one, since Cloudflare Pages serves one
   global 404 page, not a per-directory one. For ids in a URL that don't
   exist (currently a 500/404 from the controller), either skip generating
   that page and let the host's 404 handle it, or explicitly point it at the
   generated `404.html`.

5. **Root redirect.** Decide how `/` (no language prefix) should behave — a
   static `dist/index.html` with a meta-refresh/JS redirect to `/en/`, since
   there's no server left to inspect `Accept-Language` at request time.

6. **Move caching to the host.** The `Cache-Control` headers set in each
   controller (`context.set.headers["Cache-Control"] = ...`) do nothing at
   build time — add a Cloudflare Pages `_headers` file in `dist/` to set
   equivalent cache directives at the CDN level instead.

7. **Add an npm script** (e.g. `"build:static": "node scripts/generate-static.ts"`)
   and wire it into whatever deploys to Cloudflare Pages.

8. **Verify output locally** — serve `dist/` with a plain static file server
   (e.g. `npx serve dist`) and click through every route/language/id
   combination before deploying.

9. **Deploy `dist/` to Cloudflare Pages**, pointing the existing domain at
   it instead of (or in addition to, during transition) the EC2/Express
   deployment.

10. Once verified in production, retire the Express server / EC2 instance
    for this app, and remove this "Steps to follow" section from this doc.
