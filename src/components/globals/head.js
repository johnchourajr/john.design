import React from 'react';
import Helmet from 'react-helmet';

function Head(props) {
  return (
    <Helmet>
      <title>{`John Choura Design / ${
        props?.pageContext?.title ? props?.pageContext?.title : 'Studio'
      }`}</title>
      <meta name="description" content="Helmet application" />
      <meta name="robots" content="noindex" />
      <meta name="googlebot" content="noindex" />
      <meta name="googlebot-news" content="nosnippet" />
      <meta
        name="viewport"
        content="width=device-width initial-scale=1 shrink-to-fit=no"
      />
    </Helmet>
  );
}

export default Head;
