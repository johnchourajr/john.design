/**
 * clampBuilder function
 *
 * @param {Number} minFontSize
 * @param {Number} maxFontSize
 */
export function clampBuilder(minFontSize, maxFontSize) {
  const pixelsPerRem = 16;
  const minWidth = 375 / pixelsPerRem;
  const maxWidth = 1440 / pixelsPerRem;

  const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minFontSize;

  return `clamp( ${minFontSize}rem, ${yAxisIntersection}rem + ${
    slope * 100
  }vw, ${maxFontSize}rem )`;
}

/**
 * changeBodyClass function
 *
 * @param {String} state
 * @param {String} slug !deprecated
 * @param {String} foreground
 * @param {String} background
 * @param {String} image
 * @todo need to remove slug
 */
export function changeBodyClass(state, slug, foreground, background, image) {
  if (typeof document !== `undefined`) {
    if (state === 'enter') {
      document.body.classList.add(`theme--hover`);
      document.body.setAttribute('data-hover', 'true');
      document.body.setAttribute(
        'style',
        `--hover-background: ${background}; --hover-foreground: ${foreground}; --hover-image: url('${image}') `
      );
    } else {
      document.body.classList.remove(`theme--hover`);
      document.body.setAttribute('data-hover', 'false');
      document.body.setAttribute('style', '');
    }
  }
}

/**
 * changeFigmaDataState function
 *
 * @param {String} state
 * @param {String} figmaId
 */
export function changeFigmaDataState(state, figmaId) {
  if (typeof document !== `undefined`) {
    if (state === 'enter') {
      document.body.setAttribute('data-iframe', 'true');
      document.body.setAttribute('data-figma-id', figmaId);
    } else {
      document.body.setAttribute('data-iframe', 'false');
      document.body.setAttribute('data-figma-id', figmaId);
    }
  }
}

/**
 * stringToSlug function
 *
 * Takes strings and outputs slugs,
 * eg. "This String" into "this-string"
 *
 * @param {String} str
 */
export function stringToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  var to = 'aaaaeeeeiiiioooouuuunc------';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

/**
 * repeatTitle function
 *
 * @param {String} text
 */
export function repeatTitle(text) {
  const str = `${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text} `;
  return str;
}

/**
 *
 * @param {Number} i
 * @param {Object} total
 */
export function commaSeparate(i, total) {
  if (i === total.length) {
    return '.';
  } else {
    return ', ';
  }
}

// function letterMoveStyles(
//   color = 'black',
//   opacity = 1,
//   mark = 0,
//   letters = 0,
//   tm = 0,
//   rotate = '0deg'
// ) {
//   return `
// path[data-color="${color}"] {
//   opacity: ${opacity};

//   &[data-object="mark"] {
//     transform: translate3d(0, ${mark}px, 0) rotate(${rotate});
//   }

//   &[data-object="g"],
//   &[data-object="o"],
//   &[data-object="d1"],
//   &[data-object="a"],
//   &[data-object="d2"],
//   &[data-object="d3"],
//   &[data-object="y"] {
//     transform: translate3d(0, ${letters}px, 0) rotate(${rotate});
//   }

//   &[data-object="tm"] {
//     transform: translate3d(0, ${tm}px, 0) rotate(${rotate});
//   }
// }
//   `;
// }

// function offsetTransitionDelay(stepMax = 10, offset = 0.03) {
//   let list = [];

//   for (let step = 0; step < stepMax; step++) {
//     list.push(`
// path[data-sequence="${step}"] {
//   transition-delay: ${step * offset}s;
// }
//     `);
//   }

//   return list;
// }
