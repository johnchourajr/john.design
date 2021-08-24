import React from 'react';
import Helmet from 'react-helmet';
import useSiteMetadata from '../hooks/use-site-metadata';

/**
 * Head component
 *
 * @param {Object} props
 */
function Head({ pageContext }) {
  const { meta, og } = useSiteMetadata();

  const title = `John Choura Design™ / ${
    pageContext?.title ? pageContext?.title : 'Studio'
  }`;

  return (
    <Helmet
      title={title}
      meta={[
        // Basics
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=yes'
        },
        { name: 'title', content: title },
        { name: 'description', content: meta.description },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: meta.siteUrl },
        { property: 'og:title', content: title },
        { property: 'og:description', content: meta.description },
        { property: 'og:image', content: `${meta.siteUrl}${og}` },

        // Twitter
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:url', content: meta.siteUrl },
        { property: 'twitter:title', content: title },
        { property: 'twitter:description', content: meta.description },
        { property: 'twitter:image', content: `${meta.siteUrl}${og}` }
      ]}
    >
      <body>
        {`<script src="https://unpkg.com/blotterjs-fork@0.1.0/build/blotter.min.js"></script>`}
      </body>
    </Helmet>
  );
}

export default Head;
