module.exports = {
  plugins: {
    // Tailwind v4 inlines @import, handles nesting and adds vendor prefixes,
    // so postcss-import, tailwindcss/nesting and autoprefixer are no longer needed.
    '@tailwindcss/postcss': {},
  },
};
