import express from "express";
import { join } from "path";
import { availableLanguages } from "./locales";
import { HomeController } from "./controllers/home.controller";
import { ContactController } from "./controllers/contact.controller";
import { ProjectsController } from "./controllers/projects.controller";
import { ProjectController } from "./controllers/project.controller";
import { BlogsController } from "./controllers/blogs.controller";
import { BlogController } from "./controllers/blog.controller";
import { ExperienceController } from "./controllers/experience.controller";
import { NotFoundController } from "./controllers/not-found.controller";
import { warmupServiceDownPage } from "./services/system.service";

var app = express();
var port = process.env.PORT || 5173;
var isDev = process.env.NODE_ENV === "development";

// Serve static files from public folder
app.use(express.static(join(__dirname, "../public")));

// Initialize controllers
var homeController = new HomeController();
var contactController = new ContactController();
var projectsController = new ProjectsController();
var projectController = new ProjectController();
var blogsController = new BlogsController();
var blogController = new BlogController();
var experienceController = new ExperienceController();
var notFoundController = new NotFoundController();

// Routes - support both root and language-specific paths
app.get(["/:lang", "/"], async function (req, res, next) {
  try {
    // Root path ("/") has no :lang param - default to 'en'
    // A present but unrecognized :lang (e.g. "/xyz") is not a language - fall through to 404
    var lang = req.params.lang;
    if (lang && !availableLanguages.includes(lang)) {
      return next();
    }
    lang = lang || "en";

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

// Projects page route
app.get("/:lang/projects", async function (req, res, next) {
  try {
    // Validate language - not recognized means this isn't a language segment at all
    var lang = req.params.lang;
    if (!availableLanguages.includes(lang)) {
      return next();
    }

    // Create context object
    var context = {
      lang: lang,
      set: {
        headers: {} as Record<string, string>,
        status: 200,
      },
    };

    // Render the projects page
    var html = await projectsController.render(context);

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
    console.error("Error rendering projects page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Project detail page route
app.get("/:lang/projects/:id", async function (req, res, next) {
  try {
    // Validate language - not recognized means this isn't a language segment at all
    var lang = req.params.lang;
    if (!availableLanguages.includes(lang)) {
      return next();
    }
    var projectId = parseInt(req.params.id, 10);

    // Validate project ID
    if (isNaN(projectId)) {
      res.status(404).send("Invalid project ID");
      return;
    }

    // Create context object
    var context = {
      lang: lang,
      set: {
        headers: {} as Record<string, string>,
        status: 200,
      },
    };

    // Render the project detail page
    var html = await projectController.render(context, projectId);

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
    console.error("Error rendering project detail page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Blog page route
app.get("/:lang/blog", async function (req, res, next) {
  try {
    // Validate language - not recognized means this isn't a language segment at all
    var lang = req.params.lang;
    if (!availableLanguages.includes(lang)) {
      return next();
    }

    // Create context object
    var context = {
      lang: lang,
      set: {
        headers: {} as Record<string, string>,
        status: 200,
      },
    };

    // Render the blog page
    var html = await blogsController.render(context);

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
    console.error("Error rendering blog page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Blog post detail page route
app.get("/:lang/blog/:id", async function (req, res, next) {
  try {
    // Validate language - not recognized means this isn't a language segment at all
    var lang = req.params.lang;
    if (!availableLanguages.includes(lang)) {
      return next();
    }
    var postId = parseInt(req.params.id, 10);

    // Validate post ID
    if (isNaN(postId)) {
      res.status(404).send("Invalid post ID");
      return;
    }

    // Create context object
    var context = {
      lang: lang,
      set: {
        headers: {} as Record<string, string>,
        status: 200,
      },
    };

    // Render the blog post detail page
    var html = await blogController.render(context, postId);

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
    console.error("Error rendering blog post detail page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Contact page route
app.get("/:lang/contact", async function (req, res, next) {
  try {
    // Validate language - not recognized means this isn't a language segment at all
    var lang = req.params.lang;
    if (!availableLanguages.includes(lang)) {
      return next();
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

// Experience detail page route
app.get("/:lang/experience/:id", async function (req, res, next) {
  try {
    // Validate language - not recognized means this isn't a language segment at all
    var lang = req.params.lang;
    if (!availableLanguages.includes(lang)) {
      return next();
    }
    var experienceId = parseInt(req.params.id, 10);

    // Validate experience ID
    if (isNaN(experienceId)) {
      res.status(404).send("Invalid experience ID");
      return;
    }

    // Create context object
    var context = {
      lang: lang,
      set: {
        headers: {} as Record<string, string>,
        status: 200,
      },
    };

    // Render the experience detail page
    var html = await experienceController.render(context, experienceId);

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
    console.error("Error rendering experience detail page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Catch-all 404 route - must be registered after every other route
app.use(async function (req, res) {
  try {
    var context = {
      path: req.path,
      set: {
        headers: {} as Record<string, string>,
        status: 200,
      },
    };

    var html = await notFoundController.render(context);

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
    console.error("Error rendering not-found page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
async function startServer() {
  try {
    // Warmup cache in production
    if (!isDev) {
      await homeController.warmupCache();
      await projectsController.warmupCache();
      await projectController.warmupCache();
      await blogsController.warmupCache();
      await blogController.warmupCache();
      await contactController.warmupCache();
      await experienceController.warmupCache();
      await notFoundController.warmupCache();
      await warmupServiceDownPage();
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
