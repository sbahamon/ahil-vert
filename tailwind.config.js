/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#ef5917",
          blue: "#004aad",
          "dark-blue": "#022452",
          navy: "#0b162a",
        },
      },
      fontFamily: {
        heading: ["Nunito", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
