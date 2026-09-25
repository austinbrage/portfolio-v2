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

      handleSubmit: function(event) {
        // Prevent multiple submissions
        if (this.isSubmitting) return;

        var self = this;
        var form = event.target;

        self.isSubmitting = true;
        self.showSuccess = false;
        self.showError = false;

        var payload = Object.fromEntries(new FormData(form));

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function(response) { return response.json(); })
          .then(function(result) {
            self.isSubmitting = false;

            if (result.success) {
              self.showSuccess = true;
              self.formData = { name: "", email: "", message: "" };

              setTimeout(function() {
                self.showSuccess = false;
              }, 5000);
            } else {
              self.showError = true;
            }
          })
          .catch(function() {
            self.isSubmitting = false;
            self.showError = true;
          });
      }
    };
  });
});
