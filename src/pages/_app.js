import React from "react";

/**
 * Base Layout Component
 */
import Layout from "../components/layout";

/**
 * Base Styles
 */
import "../components/style/fonts.css";
import { ThemeProvider } from "styled-components";
import { device, colors, animation, size, fonts } from "../data/baseTheme";
import { BaseStyles } from "../components/style/base-styles";
import { AnimationStyles } from "../components/style/animation-styles";
import Head from "../components/globals/head";
import Nav from "../components/globals/nav";
import Footer from "../components/globals/footer";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      theme={{
        device: device,
        colors: colors,
        animation: animation,
        size: size,
        fonts: fonts,
      }}
    >
      <BaseStyles />
      <AnimationStyles />
      <Head />
      <Nav />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer />
    </ThemeProvider>
  );
}
