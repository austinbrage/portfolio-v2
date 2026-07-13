// Set once at boot - used as a cache-busting version param for static assets in production,
// so a redeploy invalidates cached CSS/JS without needing a per-request timestamp.
export var startupTimestamp = Date.now();
