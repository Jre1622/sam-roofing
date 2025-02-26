/**
 * Main JavaScript file for Sam's Roofing website
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize mobile menu
  initializeMobileMenu();

  // Add scroll animations
  addScrollAnimations();

  // Handle form validation
  setupFormValidation();

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Run scroll animation on page load
  animateOnScroll();

  // Add scroll event listener
  window.addEventListener("scroll", animateOnScroll);
});

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      // Toggle the 'hidden' class on the mobile menu
      mobileMenu.classList.toggle("hidden");

      // Toggle the icons
      const iconClosed = mobileMenuButton.querySelector("svg.block");
      const iconOpen = mobileMenuButton.querySelector("svg.hidden");

      if (iconClosed && iconOpen) {
        iconClosed.classList.toggle("block");
        iconClosed.classList.toggle("hidden");
        iconOpen.classList.toggle("block");
        iconOpen.classList.toggle("hidden");
      }
    });
  }
}

/**
 * Add scroll animations to elements
 */
function addScrollAnimations() {
  // Add fade-in class to elements when they come into view
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (animatedElements.length > 0) {
    // Create an intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
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

/**
 * Add animation to elements when they come into view while scrolling
 */
function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementPosition < windowHeight - 100) {
      element.classList.add("animated");
    }
  });
}
