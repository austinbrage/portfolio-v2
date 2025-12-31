import { compile } from "../services/html6.service";
import { I18nService } from "../services/i18n.service";
import { readFile } from "fs/promises";
import { join } from "path";

export class ContactController {
  private templatePath = join(__dirname, "../views/contact.html");
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

      const renderData = {
        title: "Contact - Austin Brage",
        description: "Get in touch with Austin Brage",
        isDevelopment: this.isDev,
        timestamp: this.isDev ? Date.now() : undefined,
        lang,
        t,
        currentPage: "contact",
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
        email: "austin@example.com",
        phone: "+1234567890",
        githubUrl: "https://github.com/austinbrage",
        linkedinUrl: "https://linkedin.com/in/austinbrage",
        twitterUrl: "https://twitter.com/austinbrage",
      };

      context.set.headers["Content-Type"] = "text/html";
      return renderer.render(renderData);
    } catch (error) {
      console.error("Error rendering contact:", error);

      // Return error message as plain text for toast
      context.set.status = 500;
      context.set.headers["Content-Type"] = "text/plain";
      return "Error loading contact page";
    }
  }

  // Warmup cache method for production startup
  public async warmupCache() {
    if (!this.isDev) {
      console.log("Warming up contact cache...");
      await this.getTemplate();
      await this.getRenderer(this.cache.template!);
      console.log("contact cache warmed up ✓");
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
