import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
        <Link href="/exp" className="">
          <h2 className="">
            <span className="underline">Experiments</span> &rarr;
          </h2>
          <p>Proof of concept work in the progress of building the site.</p>
        </Link>
        <Link href="#" className="">
          <h2 className="">
            <span className="underline">Journal</span> &rarr;
            <span className="text-xs opacity-60"> Coming Soon</span>
          </h2>
          <p>Site journal content</p>
        </Link>
        <Link href="#" className="">
          <h2 className="">
            <span className="underline">Work</span> &rarr;
            <span className="text-xs opacity-60"> Coming Soon</span>
          </h2>
          <p>Site work content</p>
        </Link>
      </div>
    </main>
  );
}
