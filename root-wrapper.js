import React from 'react';
import Layout from './src/components/layout';
import { ThemeProvider } from 'styled-components';
import { device, colors, animation } from './src/data/baseTheme';
import { BaseStyles } from './src/components/style/base-styles';
import { AnimationStyles } from './src/components/style/animation-styles';

export const wrapPageElement = ({ element, props }) => {
  return (
    <ThemeProvider
      theme={{ device: device, colors: colors, animation: animation }}
    >
      <BaseStyles />
      <AnimationStyles />
      <Layout {...props}>{element}</Layout>
    </ThemeProvider>
  );
};
