import { Metadata, Viewport } from 'next';

export const domain =
  process.env.NODE_ENV === 'production' ? 'john.design' : 'localhost:3003';

export const metadataContent: Metadata = {
  metadataBase: new URL('https://john.design'),
  title: {
    default: 'John Choura - Art Director & Creative Developer',
    template: '%s | John.Design'
  },
  description: 'Art Director, Interactive Designer, and Creative Developer specializing in visual identity, motion design, and production-ready interactive interfaces. Currently at Retool.',
  keywords: [
    'Art Director',
    'Interactive Designer', 
    'Creative Developer',
    'Visual Identity',
    'Motion Design',
    'Web Development',
    'UI/UX Design',
    'John Choura',
    'Portfolio'
  ],
  authors: [{ name: 'John Choura', url: 'https://john.design' }],
  creator: 'John Choura',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://john.design',
    siteName: 'John.Design',
    title: 'John Choura - Art Director & Creative Developer',
    description: 'Art Director, Interactive Designer, and Creative Developer specializing in visual identity, motion design, and production-ready interactive interfaces.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'John Choura - Art Director & Creative Developer'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@johnchourajr',
    creator: '@johnchourajr',
    title: 'John Choura - Art Director & Creative Developer',
    description: 'Art Director, Interactive Designer, and Creative Developer working on the internet.',
    images: ['/og.png']
  },
  alternates: {
    canonical: 'https://john.design',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewportContent: Viewport = {
  themeColor: '#ff0000',
};
