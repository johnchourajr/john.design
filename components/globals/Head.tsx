import Head from 'next/head';

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
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#fd0000"
      />
      <meta name="apple-mobile-web-app-title" content="Snippit" />
      <meta name="application-name" content="<APP NAME>" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#fd0000" />
      {children}
    </Head>
  );
}
