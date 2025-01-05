export const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://john.design/#person',
      name: 'John Choura',
      url: 'https://john.design',
      jobTitle: 'Designer',
      image: 'https://john.design/images/me-mini.png',
      description: 'John is working on the internet',
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
      description: 'John is working on the internet',
      inLanguage: 'en-US',
      publisher: {
        '@id': 'https://john.design/#person',
      },
    },
  ],
};
