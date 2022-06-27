import React from "react";
import Head from "next/head";
import config from "../../config";

/**
 * Head component
 */
interface SEOProps {
  description?: string;
  image?: string;
  title?: string;
}
function SEO({
  description = config.description,
  image,
  title = "Studio",
}: SEOProps) {
  const siteTitle = config.title;

  return (
    <Head>
      <title>{`${siteTitle} / ${title}`}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content={config.social.twitter} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {image && <meta property="twitter:iamge" content={image} />}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="icon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="icon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="icon/favicon-16x16.png"
      />
      <link rel="manifest" href="icon/site.webmanifest" />
      <link rel="mask-icon" href="icon/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
}

export default SEO;
