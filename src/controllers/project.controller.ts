import { compile } from "../services/html6.service";
import { I18nService } from "../services/i18n.service";
import { renderServiceDown } from "../services/system.service";
import { ContentService } from "../services/content.service";
import { readFile } from "fs/promises";
import { join } from "path";
import { startupTimestamp } from "../utils/environments";
import { cssBundle, jsBundle } from "../utils/bundle";
import { buildSeoData } from "../utils/seo";

export class ProjectController {
  private templatePath = join(__dirname, "../views/project.html");
  private isProd = process.env.NODE_ENV === "production";
  private isDev = !this.isProd;

  // Simple cache objects
  private cache = {
    template: null as string | null,
    renderer: null as any,
  };

  async render(context: any, projectId: number) {
    try {
      // Get template, renderer and data (with cache logic)
      const template = await this.getTemplate();
      const renderer = await this.getRenderer(template);

      // Get language and create translator
      var lang = context.lang || "en";
      var t = I18nService.createTranslator(lang);

      // Get project by ID
      var project = await ContentService.getProjectById(lang, projectId);
      var seo = buildSeoData(lang, `/projects/${projectId}`);

      const renderData = {
        title: project ? `${project.title} - Austin Brage` : "Project Not Found",
        description: project ? project.description : "Project not found",
        isDevelopment: this.isDev,
        cssBundle: cssBundle,
        jsBundle: jsBundle,
        timestamp: this.isDev ? Date.now() : startupTimestamp,
        lang,
        t,
        currentPage: "projects",
        navItems: [
          { name: t("navbar-home"), id: "home", href: `/${lang}` },
          { name: t("navbar-projects"), id: "projects", href: `/${lang}/projects` },
          { name: t("navbar-blog"), id: "blog", href: `/${lang}/blog` },
          { name: t("navbar-contact"), id: "contact", href: `/${lang}/contact` },
        ],
        languages: [
          { code: "en", name: "English", flag: "🇺🇸" },
          { code: "es", name: "Español", flag: "🇪🇸" },
        ],
        canonicalUrl: seo.canonicalUrl,
        hreflangAlternates: seo.hreflangAlternates,
        project,
        email: "austin@example.com",
      };

      // Browser + Cloudflare edge cache, 1h
      context.set.headers["Cache-Control"] = "public, max-age=3600, s-maxage=3600";
      context.set.headers["Content-Type"] = "text/html";
      return renderer.render(renderData);
    } catch (error) {
      console.error("Error rendering project:", error);
      return renderServiceDown(context);
    }
  }

  // Warmup cache method for production startup
  public async warmupCache() {
    if (this.isProd) {
      console.log("Warming up project detail cache...");
      await this.getTemplate();
      await this.getRenderer(this.cache.template!);
      console.log("project detail cache warmed up ✓");
    }
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
