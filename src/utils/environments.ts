// Set once at boot - used as a cache-busting version param for static assets in production,
// so a redeploy invalidates cached CSS/JS without needing a per-request timestamp.
export var startupTimestamp = Date.now();

// Which content/ subfolder to read from: "live" for development/production,
// "fixtures" everywhere else (dev-test, test, or unset/unrecognized NODE_ENV) -
// fixtures is the safer default so a misconfigured env can never accidentally
// serve unfinished real content.
export var contentBucket =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production"
    ? "live"
    : "fixtures";
