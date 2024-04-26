import Head from "next/head";
import Favicon from "./Favicon";

// create intefaace for GlobalHead
interface GlobalHeadProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function GlobalHead({
  title = "John.Design",
  description = "John is working on the internet",
  children,
}: GlobalHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Favicon />
      {children}
      <link rel="stylesheet" href="https://use.typekit.net/wqj3mof.css" />
    </Head>
  );
}
