import html6 from "html6";
import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";
import { utilPipes } from "../utils/pipes";

var mode = process.env.NODE_ENV || "development";
var components: string[] = [];
var hasLogged = false;

// Recursively walk a directory to get all file paths
async function tree(dir: string): Promise<string[]> {
  try {
    var entries = await readdir(dir, { withFileTypes: true });
    var files = await Promise.all(
      entries.map(async function (entry) {
        var res = resolve(dir, entry.name);
        return entry.isDirectory() ? tree(res) : res;
      })
    );
    return files.flat();
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error);
    return [];
  }
}

// Read a file as text
async function read(file: string): Promise<string> {
  return readFile(file, "utf8");
}

// Load all HTML6 components
async function loadComponents(): Promise<string[]> {
  var componentsPath = join(__dirname, "../components");
  var files = await tree(componentsPath);

  // Filter only .html files
  var htmlFiles = files.filter(function (file) {
    return file.endsWith(".html");
  });

  if (htmlFiles.length === 0) {
    console.warn("No HTML components found in:", componentsPath);
    return [];
  }

  var components = await Promise.all(htmlFiles.map(read));

  if (!hasLogged) {
    console.log(`Loaded ${components.length} HTML6 components`);
    hasLogged = true;
  }

  return components;
}

// Load components on service initialization
var componentsReady = (async function () {
  try {
    components = await loadComponents();
  } catch (error) {
    console.error("Error loading components:", error);
    components = [];
  }
})();

// Function to reload components in non-prod envs
async function reloadComponents() {
  if (process.env.NODE_ENV !== "production") {
    try {
      components = await loadComponents();
    } catch (error) {
      console.error("Error reloading components:", error);
    }
  }
}

interface CompileOptions {
  pipes?: Record<string, Function>;
  components?: string[];
  mode?: string;
  formatter?: Function;
}

interface Renderer {
  render: (data?: Record<string, any>) => string;
}

async function compile(
  page: string = "",
  opt: CompileOptions = {}
): Promise<Renderer> {
  await componentsReady;

  await reloadComponents();

  opt.pipes = Object.assign({}, utilPipes, opt.pipes);
  opt.components = components.concat(opt.components || []);
  opt.mode = mode;

  if (mode === "development" && typeof opt.formatter !== "function") {
    try {
      opt.formatter = require("pretty");
    } catch {
      // pretty not installed (e.g. production image), skip formatting
    }
  }

  var renderer = html6.compile(page, opt);

  function render(data: Record<string, any> = {}): string {
    var result = renderer.render(data);
    return result;
  }

  return { render };
}

export { compile };