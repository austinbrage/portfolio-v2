/**
 * Per-page CSS/JS files that scripts/bundle.ts concatenates into the single
 * hashed app.*.css / app.*.js bundle. Shared with scripts/generate-static.js
 * so it can exclude these individual files from out/ - once bundled, no page
 * links to them directly (see layout.html's `if="cssBundle"` / `if="jsBundle"`).
 */

export var CSS_FILES = [
  // Base
  "layout.css",
  "navbar.css",
  "hero.css",
  "experience-section.css",
  "projects-section.css",
  "blogs-section.css",
  "footer.css",
  // Pages
  "contact.css",
  "projects.css",
  "blogs.css",
  "project.css",
  "blog.css",
  "syntax-highlight.css",
  "experience.css",
  // System
  "service-down.css",
  "not-found.css",
];

export var JS_FILES = ["navbar.js", "contact.js"];
