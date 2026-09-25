/**
 * Static Site Generator
 * Pre-renders every page (every language, every content-driven route -
 * projects, blog posts, experiences - plus both 404 pages) into out/ as
 * plain HTML files, for deploying as static assets (Cloudflare Pages) instead
 * of running the Express server at runtime.
 *
 * Run: pnpm run pages:build (bundles CSS/JS first via scripts/bundle.ts, then
 * this script, via tsx so it can import src/*.ts directly). Requires
 * NODE_ENV=production so ContentService reads the "live" content bucket and
 * pages link to the hashed CSS/JS bundle.
 *
 * Plain .js (not .ts) on purpose: it lives outside src/'s rootDir, and tsx
 * transpiles the src/*.ts it imports on the fly regardless of its own
 * extension - keeping this file untyped avoids pulling it into the src/
 * tsconfig project (which would fail rootDir checks) for no real benefit,
 * since this is thin I/O glue and the actual logic it calls is still
 * type-checked as part of the controllers/services themselves.
 */

import { writeFile, mkdir, rm, cp } from "fs/promises";
import { dirname, join, basename } from "path";

try {
  // Cloudflare Pages injects WEB3FORMS_ACCESS_KEY directly - .env is only for local builds
  process.loadEnvFile();
} catch {
  // .env is optional
}

import { CSS_FILES, JS_FILES } from "./asset-files.js";
import { availableLanguages } from "../src/locales";
import { ContentService } from "../src/services/content.service";
import { HomeController } from "../src/controllers/home.controller";
import { ProjectsController } from "../src/controllers/projects.controller";
import { ProjectController } from "../src/controllers/project.controller";
import { BlogsController } from "../src/controllers/blogs.controller";
import { BlogController } from "../src/controllers/blog.controller";
import { ContactController } from "../src/controllers/contact.controller";
import { ExperienceController } from "../src/controllers/experience.controller";
import { NotFoundController } from "../src/controllers/not-found.controller";

var OUT_DIR = join(process.cwd(), "out");

function makeContext(lang) {
  return { lang, set: { headers: {}, status: 200 } };
}

// Clean URLs: /en/projects/foo -> out/en/projects/foo/index.html
async function writePage(urlPath, html) {
  var filePath = urlPath === "/" ? join(OUT_DIR, "index.html") : join(OUT_DIR, urlPath, "index.html");
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, html, "utf8");
  console.log("  " + urlPath);
}

// Exact file path, for 404.html which must not be wrapped in its own folder
async function writeFileAt(relativePath, content) {
  var filePath = join(OUT_DIR, relativePath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
  console.log("  /" + relativePath);
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });

  var homeController = new HomeController();
  var projectsController = new ProjectsController();
  var projectController = new ProjectController();
  var blogsController = new BlogsController();
  var blogController = new BlogController();
  var contactController = new ContactController();
  var experienceController = new ExperienceController();
  var notFoundController = new NotFoundController();

  for (var lang of availableLanguages) {
    console.log(`Generating ${lang} pages...`);

    var home = await homeController.render(makeContext(lang));
    await writePage(`/${lang}`, home);
    // Root "/" mirrors /en, same as the Express route ["/:lang", "/"] does
    if (lang === "en") await writePage("/", home);

    await writePage(`/${lang}/projects`, await projectsController.render(makeContext(lang)));
    var projects = await ContentService.getProjects(lang);
    for (var project of projects) {
      var projectPage = await projectController.render(makeContext(lang), project.slug);
      await writePage(`/${lang}/projects/${project.slug}`, projectPage);
    }

    await writePage(`/${lang}/blog`, await blogsController.render(makeContext(lang)));
    var posts = await ContentService.getBlogPosts(lang);
    for (var post of posts) {
      var postPage = await blogController.render(makeContext(lang), post.slug);
      await writePage(`/${lang}/blog/${post.slug}`, postPage);
    }

    await writePage(`/${lang}/contact`, await contactController.render(makeContext(lang)));

    var experiences = await ContentService.getExperiences(lang);
    for (var experience of experiences) {
      var experiencePage = await experienceController.render(makeContext(lang), experience.id);
      await writePage(`/${lang}/experience/${experience.id}`, experiencePage);
    }

    // Cloudflare Pages looks for /<dir>/404.html before falling back to /404.html
    var notFound = await notFoundController.render({ path: `/${lang}/`, set: { headers: {}, status: 200 } });
    await writeFileAt(`${lang}/404.html`, notFound);
  }

  var rootNotFound = await notFoundController.render({ path: "/", set: { headers: {}, status: 200 } });
  await writeFileAt("404.html", rootNotFound);

  console.log("Copying public/ assets...");
  var bundledFiles = new Set([...CSS_FILES, ...JS_FILES]);
  await cp(join(process.cwd(), "public"), OUT_DIR, {
    recursive: true,
    filter: (source) => !source.endsWith(".DS_Store") && !bundledFiles.has(basename(source)),
  });

  console.log(`\nStatic site generated in ${OUT_DIR}`);
}

main().catch((error) => {
  console.error("Static generation failed:", error);
  process.exit(1);
});
