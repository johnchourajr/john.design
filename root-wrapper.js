import React from 'react';
import Layout from './src/components/layout';
import { ThemeProvider } from 'styled-components';

import { device, colors, animation } from './src/data/baseTheme';
import { BodyStyles, ResetStyles } from './src/components/style/base-styles';

export const wrapRootElement = ({ element, props }) => (
  <ThemeProvider
    theme={{ device: device, colors: colors, animation: animation }}
  >
    <ResetStyles />
    <BodyStyles />
    <Layout {...props}>{element}</Layout>
  </ThemeProvider>
);
