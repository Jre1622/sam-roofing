/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // scan all .ejs files in views folder
    "./public/**/*.{js,css,html}", // scan other relevant files
  ],
  theme: {
    extend: {
      colors: {
        maverick: {
          blue: "#004aad",
          black: "#000000",
          white: "#ffffff",
        },
        // Override Tailwind's default blue colors with cobalt blue palette
        blue: {
          50: "#e6eef8",
          100: "#ccddf1",
          200: "#99bbe3",
          300: "#6699d5",
          400: "#3377c7",
          500: "#004aad", // Primary cobalt blue
          600: "#003d91", // Darker for hover states
          700: "#003075",
          800: "#002359",
          900: "#00163c",
        },
        // Keep red as an accent color
        red: {
          500: "#dc2626",
          600: "#dc2626",
          700: "#b91c1c",
        },
        // Override gray scale for a cohesive look
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937", // For footer background
          900: "#111827",
        },
        // Add a complementary dark blue for additional accents
        indigo: {
          500: "#002f6c",
          600: "#001f4d",
        },
      },
    },
  },
  plugins: [],
};
