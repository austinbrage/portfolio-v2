import { compile } from "../services/html6.service";
import { I18nService } from "../services/i18n.service";
import { availableLanguages } from "../locales";
import { readFile } from "fs/promises";
import { join } from "path";
import { startupTimestamp } from "../utils/environments";

export class NotFoundController {
  private templatePath = join(__dirname, "../views/not-found.html");
  private isProd = process.env.NODE_ENV === "production";
  private isDev = !this.isProd;

  private cache = {
    template: null as string | null,
    renderer: null as any,
  };

  async render(context: any): Promise<string> {
    var lang = this.extractLang(context.path || "");
    var t = I18nService.createTranslator(lang);

    var template = await this.getTemplate();
    var renderer = await this.getRenderer(template);

    var renderData = {
      isDevelopment: this.isDev,
      timestamp: this.isDev ? Date.now() : startupTimestamp,
      lang,
      t,
    };

    context.set.headers["Content-Type"] = "text/html";
    context.set.status = 404;
    return renderer.render(renderData);
  }

  // Warmup cache method for production startup
  public async warmupCache() {
    if (this.isProd) {
      console.log("Warming up not-found cache...");
      await this.getTemplate();
      await this.getRenderer(this.cache.template!);
      console.log("not-found cache warmed up ✓");
    }
  }

  private extractLang(path: string): string {
    var segment = path.split("/")[1] || "";
    return availableLanguages.includes(segment) ? segment : "en";
  }

  private async getTemplate(): Promise<string> {
    if (!this.cache.template || this.isDev) {
      this.cache.template = await readFile(this.templatePath, "utf8");
    }
    return this.cache.template;
  }

  private async getRenderer(template: string): Promise<any> {
    if (!this.cache.renderer || this.isDev) {
      this.cache.renderer = await compile(template);
    }
    return this.cache.renderer;
  }
}
