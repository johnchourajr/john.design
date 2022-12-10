import { Inter, Gilda_Display } from "@next/font/google";

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
import { useEffect } from "react";
import { setRootColor } from "../utils";
import clsx from "clsx";
import Header from "../components/globals/header";
import Footer from "../components/globals/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: "400",
});

const gilda = Gilda_Display({
  subsets: ["latin"],
  variable: "--font-gilda",
  weight: "400",
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    setRootColor("#ff0000");
  }, []);

  return (
    <div
      className={clsx(
        gilda.variable,
        inter.variable,
        "text-[color:var(--root-color)] bg-black min-h-[100vh] font-sans"
      )}
    >
      <GlobalHead />
      <Header />
      <main className="z-0 p-4 min-h-[100vh]">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
