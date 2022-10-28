import React from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { ThemeProvider } from "styled-components";

/**
 * Base Layout Component
 */
import Layout from "../components/layout";

/**
 * Base Styles
 */
import "../components/style/fonts.css";
import { device, colors, animation, size, fonts } from "../data/baseTheme";
import { BaseStyles } from "../components/style/base-styles";
import { AnimationStyles } from "../components/style/animation-styles";
import SEO from "../components/globals/seo";
import Nav from "../components/globals/nav";
import Footer from "../components/globals/footer";
import { LazyMotion, domAnimation } from "framer-motion";
import * as gtag from "../../lib/gtag";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  React.useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <LazyMotion features={domAnimation}>
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
        <SEO />
        <Nav />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Footer />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`,
          }}
        />
      </ThemeProvider>
    </LazyMotion>
  );
}
