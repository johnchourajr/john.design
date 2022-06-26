import React, { useEffect } from "react";

/**
 * Local Components
 */
import Head from "./globals/head";
import Nav from "./globals/nav";
import Footer from "./globals/footer";

/**
 * Local styles
 */
import { PageWrapper } from "./style/global-styles";

/**
 * Code Highlighting styles
 */
import { changeBodyClass } from "../functions/util";

/**
 * Layout Component
 * @returns page layouts
 */
export default function Layout({ children }) {
  useEffect(() => {
    return () => {
      changeBodyClass("exit", "", "", "", "");
    };
  });

  return (
    <PageWrapper>
      <main id="main">{children}</main>
    </PageWrapper>
  );
}
