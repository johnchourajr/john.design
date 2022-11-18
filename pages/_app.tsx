import { Inter } from "@next/font/google";

/**
 * Components
 */
import GlobalHead from "../components/GlobalHead";

/**
 * Types
 */
import type { AppProps } from "next/app";

/**
 * Styles
 */
import "../styles/globals.css";
import { useRouter } from "next/router";
import InlineLink from "../components/InlineLink";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: "variable",
});

export default function App({ Component, pageProps }: AppProps) {
  // get pathname from router
  const { pathname } = useRouter();

  return (
    <div className="p-4 text-[#ff0000] bg-black min-h-[100vh] font-sans">
      <GlobalHead />
      <h1 className="z-50 relative font-bold uppercase tracking-wider">
        <InlineLink href="/" className="no-underline">
          John.Design
        </InlineLink>
      </h1>

      <p className="">
        John Choura is working on the inernet to rebuild his home on the ...
        internet.
        <br />
        Check out an{" "}
        <InlineLink href="https://john.design">
          main version of the site
        </InlineLink>
        . Stay safe in here.
      </p>
      <main>
        <Component {...pageProps} />
      </main>
      <div className="fixed bottom-4 right-4 font-bold">
        <InlineLink
          href={`https://github.com/johnchourajr/john.design/tree/new-new/pages${
            pathname === "/" ? "/index" : pathname
          }.tsx`}
          target="_blank"
          aria-label="Link to source code"
          className="no-underline"
        >
          {"</>"}
        </InlineLink>
      </div>
    </div>
  );
}
