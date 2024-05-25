const { headline, text } = require('../config/type-config-js');
const { createRemClamp } = require('@buen/type');

function typedKeys(obj) {
  return Object.keys(obj);
}

const typographyPlugin = function ({ addUtilities }) {
  const generateStyles = (definition) => {
    let styles = {
      fontFamily: definition.fontFamily,
      fontWeight: definition.fontWeight,
      lineHeight: definition.lineHeight,
      letterSpacing: definition.letterSpacing,
      textTransform: definition.textTransform,
      fontSize: definition.size,
    };
    if (definition.size) {
      styles.fontSize = definition.size;
    }
    if (definition.clamp) {
      styles.fontSize = createRemClamp(...definition.clamp);
    }

    return styles;
  };

  // Generate utilities for headlines
  let headlineUtilities = {};
  typedKeys(headline).forEach((key) => {
    const style = headline[key];
    if (style) {
      headlineUtilities[`.headline-${key}`] = generateStyles(style);
    }
  });

  // Generate utilities for text
  let textUtilities = {};
  typedKeys(text).forEach((key) => {
    const style = text[key];
    if (style) {
      textUtilities[`.text-${key}`] = generateStyles(style);
    }
  });

  // Add the generated utilities to Tailwind
  addUtilities(headlineUtilities);
  addUtilities(textUtilities);
};

module.exports = typographyPlugin;
