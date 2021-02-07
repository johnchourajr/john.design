import React from 'react';
import { PageWrapper } from './style/global-styles';

import Head from './globals/head';
import Nav from './globals/nav';
import { BodyStyles, ResetStyles } from './style/base-styles';
import { AnimationStyles } from './style/animation-styles';

export default function Layout({ children, pageTitle }) {
  return (
    <>
      <Head title={pageTitle} />
      <AnimationStyles />
      <PageWrapper>
        <Nav />
        <main id="main">{children}</main>
      </PageWrapper>
    </>
  );
}
