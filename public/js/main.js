/**
 * Main JavaScript file for Maverick Contracting website
 */

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu is handled directly in header.ejs

  // Add scroll animations
  addScrollAnimations();

  // Handle form validation
  setupFormValidation();

  // Initialize smooth scrolling
  initializeSmoothScrolling();
});

/**
 * Add scroll animations to elements
 */
function addScrollAnimations() {
  // Add animation class to elements when they come into view
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (animatedElements.length > 0) {
    // Create an intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px", // Slightly before elements come into view
      }
    );

    // Observe each element
    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }
}

/**
 * Set up form validation
 */
function setupFormValidation() {
  const contactForm = document.querySelector('form[action="/submit-contact"]');

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll("[required]");

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("border-red-500");

          // Add error message if it doesn't exist
          let errorMessage = field.nextElementSibling;
          if (!errorMessage || !errorMessage.classList.contains("text-red-500")) {
            errorMessage = document.createElement("p");
            errorMessage.classList.add("text-red-500", "text-xs", "mt-1");
            errorMessage.textContent = "This field is required";
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
          }
        } else {
          field.classList.remove("border-red-500");

          // Remove error message if it exists
          const errorMessage = field.nextElementSibling;
          if (errorMessage && errorMessage.classList.contains("text-red-500")) {
            errorMessage.remove();
          }
        }
      });

      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    // Add input event listeners to clear errors on input
    const formFields = contactForm.querySelectorAll("input, textarea");
    formFields.forEach((field) => {
      field.addEventListener("input", function () {
        field.classList.remove("border-red-500");

        // Remove error message if it exists
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains("text-red-500")) {
          errorMessage.remove();
        }
      });
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for the sticky header
          behavior: "smooth",
        });
      }
    });
  });
}
