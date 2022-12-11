import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html style={{ "--root-color": "#ff0000" } as any}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
