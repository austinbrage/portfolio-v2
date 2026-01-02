/**
 * Markdown Service
 * Handles loading and parsing markdown blog post content
 */

import { marked } from "marked";
import { readFile } from "fs/promises";
import { join } from "path";

export class MarkdownService {
  private static contentPath = join(__dirname, "../../content/blog");

  /**
   * Default placeholder content when markdown file doesn't exist
   */
  private static getPlaceholderContent(lang: string): string {
    var title = lang === "es"
      ? "Contenido Próximamente"
      : "Content Coming Soon";

    var message = lang === "es"
      ? "Este artículo está en desarrollo. Volvé pronto para leer el contenido completo."
      : "This article is currently being written. Check back soon for the full content.";

    return `
      <div class="ui-blog-placeholder">
        <h2 class="ui-blog-placeholder-title">${title}</h2>
        <p class="ui-blog-placeholder-message">${message}</p>
      </div>
    `;
  }

  /**
   * Get blog post content by language and slug
   * Loads the markdown file and converts it to HTML
   * Returns placeholder content if file doesn't exist
   */
  static async getBlogContent(lang: string, slug: string): Promise<string> {
    try {
      // Build file path: content/blog/{lang}/{slug}.md
      var filePath = join(this.contentPath, lang, `${slug}.md`);

      // Read markdown file
      var markdown = await readFile(filePath, "utf8");

      // Parse markdown to HTML
      var html = await marked.parse(markdown);

      return html;
    } catch (error) {
      console.error(`Blog content not found for ${lang}/${slug}, using placeholder`);

      // Return placeholder content instead of null
      return this.getPlaceholderContent(lang);
    }
  }
}
