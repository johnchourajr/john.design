import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html style={{ '--root-color': '#ff0000' } as any}>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/wqj3mof.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
