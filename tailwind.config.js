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
      },
    },
  },
  plugins: [],
};
