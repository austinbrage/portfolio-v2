# S3-Backed Content Storage

> **Superseded** by [static-site-generation.md](./static-site-generation.md)
> — after comparing the two on simplicity and speed, decided to go SSG
> instead: the rebuild/redeploy cost of a content change is workflow time
> (only the author waits), while SSG's simplicity/speed wins are every
> visitor's experience, every request. Kept below for reference in case this
> direction is revisited (e.g. if the site grows real per-request dynamic
> needs that SSG can't serve).

## What this is

Today, `ContentService` and `MarkdownService` read all content
(`content/projects/*.json`, `content/posts/*.json`,
`content/experiences/*.json`, `content/blog/{lang}/*.md`) from the local
filesystem — files committed to the repo and shipped with every deploy. Any
content change (new project, blog post, a typo fix) means editing a file,
committing, and redeploying the whole app.

This moves those same files into a private S3 bucket. The server fetches
them at runtime instead of reading local disk, caches them in memory (same
pattern the app already uses for templates/renderers), and exposes a way to
invalidate that cache on demand. The result: updating content becomes an S3
upload + one command, with no code change, no git commit, no redeploy.

## Final goal

- A private S3 bucket mirroring the current `content/` folder structure:
  `projects/{lang}.json`, `posts/{lang}.json`, `experiences/{lang}.json`,
  `blog/{lang}/{slug}.md`.
- The EC2 instance reads it via an attached IAM role (no access keys in env
  vars) scoped to read-only access on just that bucket.
- `ContentService`/`MarkdownService` fetch from S3 but cache in memory, so
  per-request latency is unchanged from today's local-disk reads.
- An internal, secret-protected endpoint that clears the cache on demand, so
  the workflow for a content update is: `aws s3 cp` the new file, then one
  `curl` to that endpoint — content is live immediately, no redeploy.
- Local dev (`npm run dev`) keeps reading from local `content/` files, same
  as today — no AWS credentials or network access needed to develop.

## Pros

- **Update content without touching code.** No git commit, no CI/CD run, no
  redeploy for a project/blog/experience change — just an upload.
- **Edit from anywhere.** AWS console or CLI from any machine (even a
  phone), no dev environment required.
- **Decouples code deploys from content deploys.** A code change and a
  content change become two independent, differently-risky operations
  instead of one bundled redeploy.
- **Minimal blast radius.** Only `ContentService`/`MarkdownService` change —
  controllers, `html6.service.ts`, routing, everything else stays exactly as
  it is today.

## Cons / tradeoffs

- **New AWS dependency.** `@aws-sdk/client-s3`, a private bucket to
  provision, an IAM role/policy to configure — real infrastructure that
  doesn't exist today for a project that currently has zero external
  dependencies at runtime.
- **Must cache, not fetch-per-request.** S3 GetObject latency (tens of ms)
  added to every page view would be a regression versus today's sub-ms local
  reads. Fetch once (boot/warmup or on cache-miss), serve from memory after.
- **Content stops being versioned with the code.** Today, `git blame` on
  `content/projects/en.json` tells you exactly when/why a project entry
  changed, in the same history as the code. Once content lives in S3,
  that history moves to S3 versioning (if enabled) or nowhere — worth
  turning on bucket versioning as a minimum safety net.
- **`MarkdownService` currently has no caching at all** — it re-reads and
  re-parses the markdown file from disk on every single blog-post-detail
  request. That's fine on local disk; it would mean an S3 GetObject per
  blog-post view if ported as-is. Needs caching added as part of this work,
  not just carried over from `ContentService`.
- **The invalidation endpoint needs real auth.** A public "clear my content
  cache" endpoint is a (mild) DoS/cache-thrashing vector — needs a shared
  secret header, not just an open route.

---

## Steps to follow

> This section will be removed once this is implemented — it's a working
> checklist, not permanent documentation.

1. Create a private S3 bucket (block all public access), and enable
   versioning as a cheap rollback safety net for content mistakes.

2. Mirror the current `content/` structure into the bucket:
   `projects/en.json`, `projects/es.json`, `posts/en.json`, `posts/es.json`,
   `experiences/en.json`, `experiences/es.json`, `blog/en/{slug}.md`,
   `blog/es/{slug}.md`.

3. Create an IAM policy granting `s3:GetObject` (and `s3:ListBucket` if
   dynamically discovering blog slugs becomes useful later) scoped to just
   that bucket/prefix, and attach it to the EC2 instance via an instance
   profile — no access keys, ever.

4. Add `@aws-sdk/client-s3` and a small `src/services/s3.service.ts` wrapping
   `GetObjectCommand`, returning file contents as a string.

5. Update `ContentService` to read through `s3.service.ts` instead of local
   `readFile`, but **only outside local dev** — keep the existing
   `content/` + `readFile` path for `NODE_ENV=development`, matching the
   `isDev`/`isProd` pattern already used everywhere else in this codebase, so
   `npm run dev` never needs AWS credentials or network access.

6. Update `MarkdownService` the same way, **and add in-memory caching to
   it** — it has none today, which is fine for local disk but not for S3.

7. Add a `reloadContent()` (or extend the existing
   `ContentService.clearCache()`) that clears both services' caches, so the
   next request after a reload re-fetches from S3.

8. Add an internal-only route (e.g. `POST /internal/reload-content`,
   protected by a shared-secret header from an env var like
   `INTERNAL_SECRET`) that calls it — this is the "cmd" hit after an
   `aws s3 cp`.

9. (Optional safety net) Add a TTL to the in-memory cache — e.g. re-fetch if
   older than N minutes — so content refreshes eventually even if the reload
   endpoint is never called.

10. Document the new content workflow: `aws s3 cp <file>
    s3://<bucket>/<path>` then `curl -X POST
    https://<domain>/internal/reload-content -H "x-internal-secret:
    <secret>"`.

11. Verify end-to-end: upload a content change, confirm it's *not* visible
    yet (proves caching works), hit the reload endpoint, confirm it now is.

12. Once verified in production, remove this "Steps to follow" section from
    this doc.
