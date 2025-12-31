import html6 from "html6";
import pretty from "pretty";
import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";
import { utilPipes } from "../utils/pipes";

var mode = process.env.NODE_ENV || "development";
var components: string[] = [];

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
  console.log(`Loaded ${components.length} HTML6 components`);
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

// Function to reload components in development
async function reloadComponents() {
  if (process.env.NODE_ENV === "development") {
    try {
      components = await loadComponents();
      console.log("🔄 Components reloaded for development");
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

  // Reload components in development
  if (process.env.NODE_ENV === "development") {
    await reloadComponents();
  }

  opt.pipes = Object.assign({}, utilPipes, opt.pipes);
  opt.components = components.concat(opt.components || []);
  opt.mode = mode;

  if (mode === "development" && typeof opt.formatter !== "function") {
    opt.formatter = pretty;
  }

  var renderer = html6.compile(page, opt);

  function render(data: Record<string, any> = {}): string {
    var result = renderer.render(data);
    return result;
  }

  return { render };
}

export { compile };