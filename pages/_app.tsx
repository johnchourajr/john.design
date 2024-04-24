import React from "react";
import { Inter, Gilda_Display } from "@next/font/google";
import clsx from "clsx";

/**
 * Components
 */
import GlobalHead from "@/components/GlobalHead";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";

/**
 * Types
 */
import type { AppProps } from "next/app";

/**
 * Styles
 */
import "../styles/globals.css";
import { DrawingProvider } from "@/context/DrawingContext";

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
  return (
    <DrawingProvider>
      <div
        className={clsx(
          gilda.variable,
          inter.variable,
          "text-[color:var(--root-color)] bg-black min-h-[100vh] font-sans relative"
        )}
        style={{
          cursor: "url('/pencil.svg') 6 18, auto",
        }}
      >
        <GlobalHead />
        <Header />
        <main className="relative z-10 p-4 min-h-[100vh]">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </DrawingProvider>
  );
}
