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
function SEO({ description, image, title = "Studio" }: SEOProps) {
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
    </Head>
  );
}

export default SEO;
