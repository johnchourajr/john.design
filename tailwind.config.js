const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        bold: ["KUniforma Bold", ...fontFamily.sans],
        "bold-ritalic": ["KUniforma Bold Ritalic", ...fontFamily.sans],
        black: ["KUniforma Black", ...fontFamily.sans],
        "black-ritalic": ["KUniforma Black Ritalic", ...fontFamily.sans],
        pixel: ["PPMondwest", ...fontFamily.sans],
        serif: ["var(--font-gilda)", ...fontFamily.serif],
      },
      letterSpacing: {
        tight: "-0.05em",
        tighter: "-.04em",
        normal: "0",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.15em",
      },
      colors: {
        root: "var(--root-color)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
