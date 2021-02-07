import React from 'react';
import { PageWrapper } from './style/global-styles';

import Head from './globals/head';
import Nav from './globals/nav';

export default function Layout({ children, pageTitle }) {
  return (
    <>
      <Head title={pageTitle} />
      <PageWrapper>
        <Nav />
        <main id="main">{children}</main>
      </PageWrapper>
    </>
  );
}
