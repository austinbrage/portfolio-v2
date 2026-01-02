/**
 * I18n Service
 * Handles translation lookup and fallback logic
 */

import { locales, availableLanguages } from "../locales/index";

export class I18nService {
  /**
   * Create a translator function with language baked in
   * Use this to pass to templates: t(key, vars?) automatically uses the correct language
   */
  static createTranslator(
    lang: string
  ): (key: string, vars?: Record<string, any>) => string {
    return (key: string, vars?: Record<string, any>) =>
      this.translate(key, lang, vars);
  }

  /**
   * Get experiences array for a specific language
   * Returns the experiences from the locale file
   */
  static getExperiences(lang: string): any[] {
    // Validate language
    if (!availableLanguages.includes(lang)) {
      lang = "en";
    }

    // Get locale
    var locale = locales[lang as keyof typeof locales];
    if (!locale) {
      return [];
    }

    // Return experiences array
    return (locale as any).experiences || [];
  }

  /**
   * Get projects array for a specific language
   * Returns the projects from the locale file
   * @param limit - Optional number of projects to return (for featured sections)
   */
  static getProjects(lang: string, limit?: number): any[] {
    // Validate language
    if (!availableLanguages.includes(lang)) {
      lang = "en";
    }

    // Get locale
    var locale = locales[lang as keyof typeof locales];
    if (!locale) {
      return [];
    }

    // Get projects array
    var projects = (locale as any).projects || [];

    // Return limited or full array
    return limit ? projects.slice(0, limit) : projects;
  }

  /**
   * Get a single project by ID for a specific language
   * Returns the project from the locale file or null if not found
   */
  static getProjectById(lang: string, id: number): any | null {
    // Validate language
    if (!availableLanguages.includes(lang)) {
      lang = "en";
    }

    // Get locale
    var locale = locales[lang as keyof typeof locales];
    if (!locale) {
      return null;
    }

    // Get projects array
    var projects = (locale as any).projects || [];

    // Find project by ID
    var project = projects.find((p: any) => p.id === id);

    return project || null;
  }

  /**
   * Get blog posts array for a specific language
   * Returns the blog posts from the locale file
   * @param limit - Optional number of blog posts to return (for featured sections)
   */
  static getBlogPosts(lang: string, limit?: number): any[] {
    // Validate language
    if (!availableLanguages.includes(lang)) {
      lang = "en";
    }

    // Get locale
    var locale = locales[lang as keyof typeof locales];
    if (!locale) {
      return [];
    }

    // Get blog posts array
    var blogPosts = (locale as any).blogPosts || [];

    // Return limited or full array
    return limit ? blogPosts.slice(0, limit) : blogPosts;
  }

  /**
   * Get a single blog post by ID for a specific language
   * Returns the blog post metadata from the locale file or null if not found
   * Note: Content is loaded separately via MarkdownService
   */
  static getBlogPostById(lang: string, id: number): any | null {
    // Validate language
    if (!availableLanguages.includes(lang)) {
      lang = "en";
    }

    // Get locale
    var locale = locales[lang as keyof typeof locales];
    if (!locale) {
      return null;
    }

    // Get blog posts array
    var blogPosts = (locale as any).blogPosts || [];

    // Find blog post by ID
    var blogPost = blogPosts.find((p: any) => p.id === id);

    return blogPost || null;
  }

  /**
   * Translate a single key with optional variable replacements
   * Returns the original key if translation not found (graceful fallback)
   */
  static translate(
    key: string,
    lang: string,
    vars?: Record<string, any>
  ): string {
    // Validate language
    if (!availableLanguages.includes(lang)) {
      lang = "en";
    }

    // Get locale
    var locale = locales[lang as keyof typeof locales];
    if (!locale) {
      return key;
    }

    // Lookup translation
    var translation = locale[key as keyof typeof locale];
    if (translation) {
      return this.replaceVariables(translation as string, vars);
    }

    // Fallback to English if not in current language
    if (lang !== "en") {
      var enLocale = locales.en;
      var enTranslation = enLocale[key as keyof typeof enLocale];
      if (enTranslation) {
        return this.replaceVariables(enTranslation as string, vars);
      }
    }

    // Final fallback: return key itself
    return key;
  }

  /**
   * Replace variables in translation string
   * Example: "Hello {name}" with {name: "John"} => "Hello John"
   * If vars not provided or variable not found, leaves placeholder as-is
   */
  private static replaceVariables(
    text: string,
    vars?: Record<string, any>
  ): string {
    if (!vars) {
      return text;
    }

    return text.replace(/\{(\w+)\}/g, function (match, varName) {
      return vars[varName] !== undefined ? String(vars[varName]) : match;
    });
  }
}