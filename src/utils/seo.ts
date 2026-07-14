import { availableLanguages } from "../locales";

/**
 * Base production URL - all canonical and hreflang hrefs are built from this.
 */
var BASE_URL = "https://austinbrage.me";

/**
 * Builds the canonical URL and hreflang alternates for a public page.
 *
 * - `canonicalUrl`: the self-referencing URL for the current language version.
 *   Rendered as `<link rel="canonical">` in the layout's `<head>`.
 *
 * - `hreflangAlternates`: one entry per supported language plus `x-default`
 *   (falls back to English). Rendered as `<link rel="alternate" hreflang="...">`.
 *
 * @param lang - The active language code, e.g. "en", "es"
 * @param path - The path segment after the language prefix, e.g. "/projects/1" (empty string for home)
 */
export function buildSeoData(lang: string, path: string) {
  var canonicalUrl = BASE_URL + "/" + lang + path;

  var hreflangAlternates = availableLanguages
    .map(function (l) {
      return { lang: l, url: BASE_URL + "/" + l + path };
    })
    .concat([{ lang: "x-default", url: BASE_URL + "/en" + path }]);

  return { canonicalUrl, hreflangAlternates };
}
