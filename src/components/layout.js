import React from 'react';
import { ThemeProvider } from 'styled-components';
import { device, colors, animation } from '../data/baseTheme';
import { PageWrapper } from './style/global-styles';
import { BodyStyles, ResetStyles } from './style/base-styles';
import { AnimationStyles } from './style/animation-styles';

import Head from './globals/head';
import Nav from './globals/nav';

export default function Layout({ children, pageTitle }) {
  // React.useEffect(() => {
  //   console.log(location);
  // });
  return (
    <>
      <Head title={pageTitle} />
      <ThemeProvider
        theme={{ device: device, colors: colors, animation: animation }}
      >
        <ResetStyles />
        <BodyStyles />
        <AnimationStyles />
        <PageWrapper>
          <Nav componentId={'...'} />
          <main id="main">{children}</main>
        </PageWrapper>
      </ThemeProvider>
    </>
  );
}
