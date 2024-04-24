const typePlugin = require("./lib/plugins/type-plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {},
    extend: {
      fontFamily: {
        sans: ["Montreal"],
        "sans-italic": ["MontrealItalic"],
        bold: ["KUniforma Bold"],
        "bold-ritalic": ["KUniforma Bold Ritalic"],
        black: ["KUniforma Black"],
        "black-ritalic": ["KUniforma Black Ritalic"],
        pixel: ["PPMondwest"],
        serif: ["BigCaslon"],
      },
      letterSpacing: {
        tight: "-0.05em",
        tighter: "-.04em",
        normal: "0",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.15em",
      },
      borderWidth: {
        1: "1px",
      },
      colors: {
        root: "var(--root-color)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [typePlugin],
};
