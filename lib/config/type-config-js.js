const montreal = 'Montreal, sans-serif';
const uniforma = 'KUniforma Bold, sans-serif';
const caslon = 'big-caslon-fb, serif';

const headline = {
  'display-xl': {
    id: 'headline-display-xl',
    fontFamily: uniforma,
    fontWeight: 'bold',
    clamp: [4.5, 9],
    letterSpacing: '0em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  'display-lg': {
    id: 'headline-display-lg',
    fontFamily: uniforma,
    fontWeight: 'bold',
    clamp: [3.5, 5],
    letterSpacing: '0em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  'display-lg-serif': {
    id: 'headline-display-lg-serif',
    fontFamily: caslon,
    fontWeight: 400,
    clamp: [3.25, 6.75],
    letterSpacing: '-0.025em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  'display-md': {
    id: 'headline-display-md',
    fontFamily: uniforma,
    fontWeight: 'bold',
    clamp: [3, 4],
    letterSpacing: '0em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  'display-sm': {
    id: 'headline-display-sm',
    fontFamily: uniforma,
    fontWeight: 'bold',
    clamp: [1.5, 2],
    letterSpacing: '0.1em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  'display-xs': {
    id: 'headline-display-xs',
    fontFamily: uniforma,
    fontWeight: 'bold',
    clamp: [1, 1],
    letterSpacing: '0.1em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
};

const text = {
  title: {
    id: 'text-title',
    fontSize: '1.5rem',
    lineHeight: 1.25,
    fontFamily: montreal,
    fontWeight: 'normal',
    letterSpacing: '0.1em',
  },
  paragraph: {
    id: 'text-paragraph',
    fontSize: '1.25rem',
    lineHeight: 1.35,
    fontWeight: 'normal',
    fontFamily: montreal,
    letterSpacing: '0.05em',
  },
  string: {
    id: 'text-string',
    fontSize: '.9rem',
    lineHeight: 1.25,
    fontWeight: 'normal',
    fontFamily: montreal,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },

  body: {
    id: 'text-body',
    fontSize: '0.8rem',
    lineHeight: 1.25,
    fontWeight: 'normal',
    fontFamily: montreal,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
  caption: {
    id: 'text-caption',
    fontSize: '0.65rem',
    lineHeight: 1.25,
    fontWeight: 'normal',
    fontFamily: montreal,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
};

module.exports = { headline, text };
