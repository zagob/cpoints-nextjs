/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto Mono", "sans"],
      },
      animation: {
        "bounce-slow": "bounce 1.2s linear infinite",
        "bounce-slow-2": "bounce 1.3s linear infinite",
      },
    },
  },
  plugins: [],
};
