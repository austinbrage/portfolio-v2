document.addEventListener("alpine:init", function() {
  Alpine.data("hero", function() {
    return {
      scrollToProjects: function() {
        var projectsSection = document.getElementById("projects");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
      },

      scrollToContact: function() {
        var contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      },
    };
  });
});
