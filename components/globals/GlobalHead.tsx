import Head from 'next/head';
import Favicon from './Favicon';

// create intefaace for GlobalHead
interface GlobalHeadProps {
  title?: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
}

export default function GlobalHead({
  title = 'John.Design',
  description = 'John is working on the internet',
  image = '/og.png',
  children,
}: GlobalHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={title} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content="johnchourajr" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {image && <meta property="twitter:iamge" content={image} />}
      <Favicon />
      {children}
    </Head>
  );
}
