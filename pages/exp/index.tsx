import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="grid grid-cols-2 my-8 gap-8">
        <Link href="/exp/freehand" className="">
          <h2 className="">
            <span className="underline">Freehand</span> &rarr;
          </h2>
          <p>The ability to draw directly over the top of the site.</p>
        </Link>
        <Link href="/exp/scroll-grow" className="">
          <h2 className="">
            <span className="underline">Scroll Grow</span> &rarr;
          </h2>
          <p>The ability to view content on scroll in a... unique way.</p>
        </Link>
      </div>
    </main>
  );
}
