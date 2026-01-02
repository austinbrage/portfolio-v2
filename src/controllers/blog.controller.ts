import { compile } from "../services/html6.service";
import { I18nService } from "../services/i18n.service";
import { MarkdownService } from "../services/markdown.service";
import { readFile } from "fs/promises";
import { join } from "path";

export class BlogController {
  private templatePath = join(__dirname, "../views/blog.html");
  private isDev = process.env.NODE_ENV === "development";

  // Simple cache objects
  private cache = {
    template: null as string | null,
    renderer: null as any,
  };

  async render(context: any, postId: number) {
    try {
      // Get template, renderer and data (with cache logic)
      const template = await this.getTemplate();
      const renderer = await this.getRenderer(template);

      // Get language and create translator
      var lang = context.lang || "en";
      var t = I18nService.createTranslator(lang);

      // Get blog post metadata by ID
      var post = I18nService.getBlogPostById(lang, postId);

      // Load markdown content (will use placeholder if file doesn't exist)
      var content = "";
      if (post && post.slug) {
        content = await MarkdownService.getBlogContent(lang, post.slug);
      }

      // Build current URL for sharing
      var currentUrl = `https://yourwebsite.com/${lang}/blog/${postId}`;

      const renderData = {
        title: post ? `${post.title} - Austin Brage` : "Post Not Found",
        description: post ? post.excerpt : "Blog post not found",
        isDevelopment: this.isDev,
        timestamp: this.isDev ? Date.now() : undefined,
        lang,
        t,
        currentPage: "blog",
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
        post,
        content,
        currentUrl,
        encodeURIComponent: encodeURIComponent,
        email: "austin@example.com",
      };

      context.set.headers["Content-Type"] = "text/html";
      return renderer.render(renderData);
    } catch (error) {
      console.error("Error rendering blog post:", error);

      // Return error message as plain text for toast
      context.set.status = 500;
      context.set.headers["Content-Type"] = "text/plain";
      return "Error loading blog post page";
    }
  }

  // Warmup cache method for production startup
  public async warmupCache() {
    if (!this.isDev) {
      console.log("Warming up blog post cache...");
      await this.getTemplate();
      await this.getRenderer(this.cache.template!);
      console.log("blog post cache warmed up ✓");
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
