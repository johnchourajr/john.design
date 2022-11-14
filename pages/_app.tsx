import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="p-4 text-[#ff0000]">
      <h1 className="z-50 relative">
        <Link href="/" className="underline">
          John.Design
        </Link>
      </h1>

      <p className="">
        John Choura is working on the inernet to rebuild his home on the ...
        internet.
        <br />
        Check out an{" "}
        <Link href="https://john.design" className="underline">
          main version of the site
        </Link>
        . Stay safe in here.
      </p>
      <Component {...pageProps} />
    </div>
  );
}
