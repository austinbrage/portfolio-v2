/**
 * Contact Form Alpine.js Component
 */

document.addEventListener("alpine:init", function() {
  Alpine.data("contactForm", function() {
    return {
      formData: {
        name: "",
        email: "",
        message: ""
      },

      isSubmitting: false,
      showSuccess: false,
      showError: false,

      handleSubmit: function() {
        // Prevent multiple submissions
        if (this.isSubmitting) return;

        // Capture the Alpine context before setTimeout
        var self = this;

        self.isSubmitting = true;
        self.showSuccess = false;
        self.showError = false;

        // Simulate API call (replace with real backend call)
        setTimeout(function() {
          // Success
          self.isSubmitting = false;
          self.showSuccess = true;

          // Reset form
          self.formData = {
            name: "",
            email: "",
            message: ""
          };

          // Hide success message after 5 seconds
          setTimeout(function() {
            self.showSuccess = false;
          }, 5000);

        }, 1000);

        // For error handling:
        // self.isSubmitting = false;
        // self.showError = true;
      }
    };
  });
});
