import React from 'react';

/**
 * Base Layout Component
 */
import Layout from '../components/layout';

/**
 * Base Styles
 */
import { ThemeProvider } from 'styled-components';
import { device, colors, animation, size, fonts } from '../data/baseTheme';
import { BaseStyles } from '../components/style/base-styles';
import { AnimationStyles } from '../components/style/animation-styles';

const PageLayout = ({ children, pageContext }) => (
  <ThemeProvider
    theme={{
      device: device,
      colors: colors,
      animation: animation,
      size: size,
      fonts: fonts
    }}
  >
    <BaseStyles />
    <AnimationStyles />
    <Layout pageContext={pageContext}>{children}</Layout>
  </ThemeProvider>
);

export const BrowserPageLayout = PageLayout;
export const SsrPageLayout = PageLayout;
