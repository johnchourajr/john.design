import { Metadata, Viewport } from 'next';

export const domain =
  process.env.NODE_ENV === 'production' ? 'john.design' : 'localhost:3003';

export const metadataContent: Metadata = {
  metadataBase: new URL('https://john.design'),
  title: 'John.Design',
  description: 'John is working on the internet',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://john.design',
    siteName: 'John.Design',
    images: '/og.png',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@johnchourajr',
  },
  alternates: {
    canonical: 'https://john.design',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewportContent: Viewport = {
  themeColor: '#ff0000',
};
