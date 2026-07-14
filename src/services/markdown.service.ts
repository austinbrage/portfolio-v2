/**
 * Markdown Service
 * Handles loading and parsing markdown blog post content
 */

import { marked, Renderer } from "marked";
import { readFile } from "fs/promises";
import { join } from "path";
import { contentBucket } from "../utils/environments";

// marked (since v1) doesn't sanitize link hrefs itself - that's left to the consumer -
// so dangerous schemes like javascript:/data: pass through untouched by default.
// Allow-list safe schemes; anything else degrades to plain text, no anchor.
var SAFE_HREF_PATTERN = /^(https?:|mailto:|tel:|\/|#)/i;

// External links open in a new tab; internal/relative links stay in the same tab.
// Reuses the default renderer's link output (via the prototype method) instead of
// building the <a> tag by hand, so title-attribute escaping still applies - only
// the scheme check and target/rel injection are custom.
marked.use({
  renderer: {
    link(token) {
      if (!SAFE_HREF_PATTERN.test(token.href)) {
        return this.parser.parseInline(token.tokens);
      }
      var html = Renderer.prototype.link.call(this, token);
      var isExternal = /^https?:\/\//.test(token.href);
      if (isExternal) {
        html = html.replace(
          /^<a /,
          '<a target="_blank" rel="noopener noreferrer" ',
        );
      }
      return html;
    },
  },
});

export class MarkdownService {
  private static blogContentPath = join(__dirname, "../../content", contentBucket, "blog");
  private static projectContentPath = join(__dirname, "../../content", contentBucket, "project");

  /**
   * Default placeholder content when markdown file doesn't exist
   */
  private static getPlaceholderContent(lang: string): string {
    var title =
      lang === "es" ? "Contenido Próximamente" : "Content Coming Soon";

    var message =
      lang === "es"
        ? "Este contenido está en desarrollo. Volvé pronto para leerlo completo."
        : "This content is currently being written. Check back soon for the full version.";

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
      var filePath = join(this.blogContentPath, lang, `${slug}.md`);

      // Read markdown file
      var markdown = await readFile(filePath, "utf8");

      // Parse markdown to HTML
      var html = await marked.parse(markdown);

      return html;
    } catch (error) {
      console.error(
        `Blog content not found for ${lang}/${slug}, using placeholder`,
      );

      // Return placeholder content instead of null
      return this.getPlaceholderContent(lang);
    }
  }

  /**
   * Get extended project write-up by language and slug
   * Loads the markdown file and converts it to HTML
   * Returns placeholder content if file doesn't exist
   */
  static async getProjectContent(lang: string, slug: string): Promise<string> {
    try {
      // Build file path: content/project/{lang}/{slug}.md
      var filePath = join(this.projectContentPath, lang, `${slug}.md`);

      // Read markdown file
      var markdown = await readFile(filePath, "utf8");

      // Parse markdown to HTML
      var html = await marked.parse(markdown);

      return html;
    } catch (error) {
      console.error(
        `Project content not found for ${lang}/${slug}, using placeholder`,
      );

      // Return placeholder content instead of null
      return this.getPlaceholderContent(lang);
    }
  }
}
