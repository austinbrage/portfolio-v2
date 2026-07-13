import { existsSync, readFileSync } from "fs";
import { join } from "path";

var manifestPath = join(process.cwd(), "manifest.json");

function readManifest(): { css: string; js: string } {
  if (!existsSync(manifestPath)) return { css: "", js: "" };
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

var manifest = readManifest();
export var cssBundle = manifest.css;
export var jsBundle = manifest.js;
