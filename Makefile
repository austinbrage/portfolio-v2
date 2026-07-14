.PHONY: bundle bundle-clean

bundle: ## Generate asset bundles (public/css/app.*.css, public/js/app.*.js, manifest.json)
	@npm run bundle

bundle-clean: ## Remove generated bundle files (public/css/app.*.css, public/js/app.*.js, manifest.json)
	@rm -f public/css/app.*.css public/js/app.*.js manifest.json
	@echo "Bundle files removed"
