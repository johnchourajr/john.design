export const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://john.design/#person',
      name: 'John Choura',
      url: 'https://john.design',
      jobTitle: ['Art Director', 'Interactive Designer', 'Creative Developer'],
      image: 'https://john.design/me-alpha-moody.png',
      description: 'Art Director, Interactive Designer, and Creative Developer specializing in visual identity, motion design, and production-ready interactive interfaces.',
      knowsAbout: [
        'Visual Identity Design',
        'Motion Graphics',
        'Interactive Design',
        'Web Development',
        'User Experience Design',
        'Creative Development',
        'Brand Strategy'
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'Retool',
        url: 'https://retool.com'
      },
      alumniOf: [
        {
          '@type': 'Organization',
          name: 'PayPal',
          url: 'https://paypal.com'
        },
        {
          '@type': 'Organization',
          name: 'GoDaddy',
          url: 'https://godaddy.com'
        },
        {
          '@type': 'Organization',
          name: 'Happy Money',
          url: 'https://happymoney.com'
        }
      ],
      sameAs: [
        'https://threads.net/johnchoura',
        'https://github.com/johnchourajr',
        'https://www.linkedin.com/in/john-choura-jr/',
        'https://instagram.com/johnchoura',
        'https://twitter.com/johnchourajr',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://john.design/#website',
      url: 'https://john.design',
      name: 'John.Design',
      description: 'Portfolio of John Choura - Art Director, Interactive Designer, and Creative Developer',
      inLanguage: 'en-US',
      publisher: {
        '@id': 'https://john.design/#person',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://john.design/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'WebPage',
      '@id': 'https://john.design/#homepage',
      url: 'https://john.design',
      name: 'John Choura - Art Director & Creative Developer',
      description: 'John Choura is an Art Director, Interactive Designer, and Creative Developer working on the internet.',
      isPartOf: {
        '@id': 'https://john.design/#website'
      },
      about: {
        '@id': 'https://john.design/#person'
      },
      mainEntity: {
        '@id': 'https://john.design/#person'
      }
    }
  ],
};
