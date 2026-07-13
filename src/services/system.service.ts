import { compile } from "./html6.service";
import { I18nService } from "./i18n.service";
import { readFile } from "fs/promises";
import { join } from "path";
import { startupTimestamp } from "../utils/environments";

var isProd = process.env.NODE_ENV === "production";
var isDev = !isProd;

var templatePath = join(__dirname, "../views/service-down.html");

var cache = {
  template: null as string | null,
  renderer: null as any,
};

// Render the shared Service Down page (used as the error fallback by every controller)
export async function renderServiceDown(context: any): Promise<string> {
  var lang = context.lang || "en";
  var t = I18nService.createTranslator(lang);

  var template = await getTemplate();
  var renderer = await getRenderer(template);

  var renderData = {
    isDevelopment: isDev,
    timestamp: isDev ? Date.now() : startupTimestamp,
    lang,
    t,
  };

  context.set.status = 500;
  context.set.headers["Content-Type"] = "text/html";
  return renderer.render(renderData);
}

// Warmup cache method for production startup
export async function warmupServiceDownPage(): Promise<void> {
  if (isProd) {
    console.log("Warming up service-down cache...");
    await getTemplate();
    await getRenderer(cache.template!);
    console.log("service-down cache warmed up ✓");
  }
}

async function getTemplate(): Promise<string> {
  if (!cache.template || isDev) {
    cache.template = await readFile(templatePath, "utf8");
  }
  return cache.template;
}

async function getRenderer(template: string): Promise<any> {
  if (!cache.renderer || isDev) {
    cache.renderer = await compile(template);
  }
  return cache.renderer;
}
