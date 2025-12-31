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
  }));
});
