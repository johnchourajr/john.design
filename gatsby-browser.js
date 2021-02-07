const React = require('react');
const Layout = require('./src/components/layout').default;
const { ThemeProvider } = require('styled-components');

const { device, colors, animation } = require('./src/data/baseTheme');
const {
  BodyStyles,
  ResetStyles
} = require('./src/components/style/base-styles');
const { AnimationStyles } = require('./src/components/style/animation-styles');

exports.wrapPageElement = ({ element, props }) => (
  <ThemeProvider
    theme={{ device: device, colors: colors, animation: animation }}
  >
    <ResetStyles />
    <BodyStyles />
    <AnimationStyles />
    <Layout {...props}>{element}</Layout>
  </ThemeProvider>
);
