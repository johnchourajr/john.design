import React from 'react';
import Layout from './src/components/layout';
import { ThemeProvider } from 'styled-components';
import { device, colors, animation, size } from './src/data/baseTheme';
import { BaseStyles } from './src/components/style/base-styles';
import { AnimationStyles } from './src/components/style/animation-styles';

export const wrapPageElement = ({ element, props }) => {
  return (
    <ThemeProvider
      theme={{
        device: device,
        colors: colors,
        animation: animation,
        size: size
      }}
    >
      <BaseStyles />
      <AnimationStyles />
      <Layout {...props}>{element}</Layout>
    </ThemeProvider>
  );
};
