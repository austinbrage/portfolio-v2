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