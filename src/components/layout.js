import React from 'react';
import { PageWrapper } from './style/global-styles';

import Head from './globals/head';
import Nav from './globals/nav';
import './style/fonts.css';

export default function Layout({ children, pageContext }) {
  return (
    <>
      <Head pageContext={pageContext} />
      <PageWrapper>
        <Nav pageContext={pageContext} />
        <main id="main">{children}</main>
      </PageWrapper>
    </>
  );
}
