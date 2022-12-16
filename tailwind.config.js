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
        "spin-slow-medium": "spin 2s linear infinite",
      },
      screens: {
        xs: "400px",
        sm: "780px",
        md: "940px",
        lg: "1084px",
        xl: "1200px",
        "2xl": "1430px",
      },
    },
  },
  plugins: [],
};
