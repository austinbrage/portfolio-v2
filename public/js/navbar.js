document.addEventListener("alpine:init", () => {
  Alpine.data("navbar", () => ({
    mobileMenuOpen: false,
    languageDropdownOpen: false,
    theme: localStorage.getItem("theme") || "light",

    init() {
      document.documentElement.classList.toggle("dark", this.theme === "dark");
    },

    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", this.theme);
      document.documentElement.classList.toggle("dark", this.theme === "dark");
    },

    localizedPath(code) {
      var parts = window.location.pathname.split("/");
      parts[1] = code;
      return parts.join("/") + window.location.search + window.location.hash;
    },
  }));
});
