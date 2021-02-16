import React from 'react';

/**
 * Base Layout Component
 */
import Layout from './src/components/layout';

/**
 * Base Styles
 */
import { ThemeProvider } from 'styled-components';
import { device, colors, animation, size, fonts } from './src/data/baseTheme';
import { BaseStyles } from './src/components/style/base-styles';
import { AnimationStyles } from './src/components/style/animation-styles';

/**
 * Root Component
 *
 * @param {Object} props
 * @param {Object} props.element
 * @param {Object} props.props
 */
export const wrapPageElement = ({ element, props }) => {
  return (
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
      <Layout {...props}>{element}</Layout>
    </ThemeProvider>
  );
};
