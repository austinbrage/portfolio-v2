import express from "express";
import { join } from "path";
import { availableLanguages } from "./locales";
import { HomeController } from "./controllers/home.controller";
import { ContactController } from "./controllers/contact.controller";

var app = express();
var port = process.env.PORT || 3000;
var isDev = process.env.NODE_ENV === "development";

// Serve static files from public folder
app.use(express.static(join(__dirname, "../public")));

// Initialize controllers
var homeController = new HomeController();
var contactController = new ContactController();

// Routes - support both root and language-specific paths
app.get(["/:lang", "/"], async function (req, res) {
  try {
    // Get language from path param or default to 'en'
    var lang = req.params.lang || "en";

    // Validate language (optional - add supported languages)
    if (!availableLanguages.includes(lang)) {
      lang = "en";
    }

    // Create context object similar to what home.controller expects
    var context = {
      lang: lang,
      set: {
        headers: {} as Record<string, string>,
        status: 200,
      },
    };

    // Render the home page
    var html = await homeController.render(context);

    // Apply headers and status from context
    if (context.set.status) {
      res.status(context.set.status);
    }

    if (context.set.headers) {
      Object.entries(context.set.headers).forEach(function ([key, value]) {
        res.setHeader(key, value);
      });
    }

    res.send(html);
  } catch (error) {
    console.error("Error rendering home page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Contact page route
app.get("/:lang/contact", async function (req, res) {
  try {
    // Get language from path param or default to 'en'
    var lang = req.params.lang || "en";

    // Validate language
    if (!availableLanguages.includes(lang)) {
      lang = "en";
    }

    // Create context object
    var context = {
      lang: lang,
      set: {
        headers: {} as Record<string, string>,
        status: 200,
      },
    };

    // Render the contact page
    var html = await contactController.render(context);

    // Apply headers and status from context
    if (context.set.status) {
      res.status(context.set.status);
    }

    if (context.set.headers) {
      Object.entries(context.set.headers).forEach(function ([key, value]) {
        res.setHeader(key, value);
      });
    }

    res.send(html);
  } catch (error) {
    console.error("Error rendering contact page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
async function startServer() {
  try {
    // Warmup cache in production
    if (!isDev) {
      await homeController.warmupCache();
      await contactController.warmupCache();
    }

    app.listen(port, function () {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Environment: ${isDev ? "development" : "production"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
