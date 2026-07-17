/**
 * Asset Bundle Script
 * Concatenates all CSS and JS files into single content-hashed bundles.
 * Run before server start in production: tsx scripts/bundle.ts
 * Output: public/css/app.<hash>.css, public/js/app.<hash>.js, manifest.json
 *
 * Files are listed explicitly (not read from disk) because order matters -
 * layout.css must come first, and each page's own stylesheet loads after the
 * shared components it depends on (navbar, hero, footer, section wrappers).
 *
 * validateFiles() runs at startup and throws if any file on disk is missing
 * from the list, so forgotten files cause a loud build failure rather than a
 * silent omission. Add intentionally excluded files to SKIP_CSS / SKIP_JS.
 */

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

var SKIP_CSS = new Set<string>([]);
var SKIP_JS = new Set<string>([]);

var CSS_FILES = [
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

var JS_FILES = ["navbar.js", "contact.js"];

function validateFiles(
  dir: string,
  list: string[],
  skip: Set<string>,
  label: string
) {
  var actual = readdirSync(join(process.cwd(), "public", dir)).filter(
    function (f) {
      return !f.startsWith("app.");
    }
  );
  var listed = new Set(list);
  var unlisted = actual.filter(function (f) {
    return !listed.has(f) && !skip.has(f);
  });
  var missing = list.filter(function (f) {
    return !actual.includes(f);
  });
  if (unlisted.length > 0) {
    throw new Error(
      label +
        ": files on disk not in bundle list: " +
        unlisted.join(", ") +
        "\nAdd them to the list or to SKIP_" +
        label +
        " in scripts/bundle.ts"
    );
  }
  if (missing.length > 0) {
    throw new Error(
      label + ": files in bundle list not found on disk: " + missing.join(", ")
    );
  }
}

validateFiles("css", CSS_FILES, SKIP_CSS, "CSS");
validateFiles("js", JS_FILES, SKIP_JS, "JS");

function contentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 8);
}

function buildBundle(files: string[], dir: string) {
  var sourceDir = join(process.cwd(), "public", dir);
  var content = files
    .map(function (f) {
      return readFileSync(join(sourceDir, f), "utf8");
    })
    .join("\n");
  return { content, hash: contentHash(content) };
}

function cleanOldBundles(dir: string, prefix: string) {
  var d = join(process.cwd(), "public", dir);
  readdirSync(d)
    .filter(function (f) {
      return f.startsWith(prefix) && f !== prefix;
    })
    .forEach(function (f) {
      unlinkSync(join(d, f));
    });
}

var css = buildBundle(CSS_FILES, "css");
var js = buildBundle(JS_FILES, "js");

var cssFilename = "app." + css.hash + ".css";
var jsFilename = "app." + js.hash + ".js";

cleanOldBundles("css", "app.");
cleanOldBundles("js", "app.");

writeFileSync(join(process.cwd(), "public/css", cssFilename), css.content);
writeFileSync(join(process.cwd(), "public/js", jsFilename), js.content);

writeFileSync(
  join(process.cwd(), "manifest.json"),
  JSON.stringify({ css: cssFilename, js: jsFilename }, null, 2)
);

console.log(
  "CSS bundle: public/css/" +
    cssFilename +
    " (" +
    (css.content.length / 1024).toFixed(1) +
    "KB)"
);
console.log(
  "JS bundle:  public/js/" +
    jsFilename +
    " (" +
    (js.content.length / 1024).toFixed(1) +
    "KB)"
);
