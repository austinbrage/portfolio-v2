import { compile } from "../services/html6.service";
import { I18nService } from "../services/i18n.service";
import { ContentService } from "../services/content.service";
import { readFile } from "fs/promises";
import { join } from "path";

export class ProjectsController {
  private templatePath = join(__dirname, "../views/projects.html");
  private isDev = process.env.NODE_ENV === "development";

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

      // Get all projects
      var projects = await ContentService.getProjects(lang);

      const renderData = {
        title: "Projects - Austin Brage",
        description: "Browse all my projects",
        isDevelopment: this.isDev,
        timestamp: this.isDev ? Date.now() : undefined,
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
        projects,
        email: "austin@example.com",
      };

      context.set.headers["Content-Type"] = "text/html";
      return renderer.render(renderData);
    } catch (error) {
      console.error("Error rendering projects:", error);

      // Return error message as plain text for toast
      context.set.status = 500;
      context.set.headers["Content-Type"] = "text/plain";
      return "Error loading projects page";
    }
  }

  // Warmup cache method for production startup
  public async warmupCache() {
    if (!this.isDev) {
      console.log("Warming up projects cache...");
      await this.getTemplate();
      await this.getRenderer(this.cache.template!);
      console.log("projects cache warmed up ✓");
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
