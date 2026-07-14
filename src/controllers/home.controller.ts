import { compile } from "../services/html6.service";
import { I18nService } from "../services/i18n.service";
import { renderServiceDown } from "../services/system.service";
import { ContentService } from "../services/content.service";
import { readFile } from "fs/promises";
import { join } from "path";
import { startupTimestamp } from "../utils/environments";
import { cssBundle, jsBundle } from "../utils/bundle";
import { buildSeoData } from "../utils/seo";

export class HomeController {
  private templatePath = join(__dirname, "../views/home.html");
  private isProd = process.env.NODE_ENV === "production";
  private isDev = !this.isProd;

  // Simple cache objects
  private cache = {
    template: null as string | null,
    renderer: null as any,
  };

  async render(context: any, content: string = "") {
    try {
      // Get template, renderer and data (with cache logic)
      const template = await this.getTemplate();
      const renderer = await this.getRenderer(template);

      // Get language and create translator
      var lang = context.lang || "en";
      var t = I18nService.createTranslator(lang);

      // Get content data
      var projects = await ContentService.getProjects(lang, 4);
      var blogPosts = await ContentService.getBlogPosts(lang, 2);
      var experiences = await ContentService.getExperiences(lang);
      var seo = buildSeoData(lang, "");

      const renderData = {
        title: "Austin Brage",
        description: "Austin Brage - Personal portfolio",
        isDevelopment: this.isDev,
        cssBundle: cssBundle,
        jsBundle: jsBundle,
        timestamp: this.isDev ? Date.now() : startupTimestamp,
        lang,
        t,
        currentPage: "home",
        navItems: [
          { name: t("navbar-home"), id: "home", href: `/${lang}` },
          {
            name: t("navbar-projects"),
            id: "projects",
            href: `/${lang}/projects`,
          },
          { name: t("navbar-blog"), id: "blog", href: `/${lang}/blog` },
          {
            name: t("navbar-contact"),
            id: "contact",
            href: `/${lang}/contact`,
          },
        ],
        languages: [
          { code: "en", name: "English", flag: "🇺🇸" },
          { code: "es", name: "Español", flag: "🇪🇸" },
        ],
        heroGithubUrl: "https://github.com/austinbrage",
        heroLinkedinUrl: "https://linkedin.com/in/austinbrage",
        heroEmail: "austin@example.com",
        canonicalUrl: seo.canonicalUrl,
        hreflangAlternates: seo.hreflangAlternates,
        experiences,
        projects,
        blogPosts,
      };

      // Browser + Cloudflare edge cache, 1h
      context.set.headers["Cache-Control"] = "public, max-age=3600, s-maxage=3600";
      context.set.headers["Content-Type"] = "text/html";
      return renderer.render(renderData);
    } catch (error) {
      console.error("Error rendering home:", error);
      return renderServiceDown(context);
    }
  }

  // Warmup cache method for production startup
  public async warmupCache() {
    if (this.isProd) {
      console.log("Warming up home cache...");
      await this.getTemplate();
      await this.getRenderer(this.cache.template!);
      console.log("home cache warmed up ✓");
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
