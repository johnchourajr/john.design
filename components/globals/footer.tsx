import clsx from "clsx";
import { useRouter } from "next/router";
import navData from "../../data/nav";
import InlineLink from "../InlineLink";
import LinkGridItem, { LinkGridItemProps } from "../LinkGridItem";

export default function Footer() {
  const { pathname } = useRouter();

  return (
    <footer className="w-full relative p-4">
      <p
        className={clsx(
          "z-50 text-xs relative font-bold uppercase tracking-wider pointer-events-none",
          "md:inline-flex hidden",
          "no-underline"
        )}
      >
        <InlineLink href="/" className="no-underline">
          John.Design
        </InlineLink>
      </p>

      <p className="z-50 relative pointer-events-none">
        John Choura is working on the inernet to rebuild his home on the ...
        internet.
        <br />
        Check out an{" "}
        <InlineLink href="https://john.design">
          main version of the site
        </InlineLink>
        . Stay safe in here.
      </p>

      <div className="z-50 fixed bottom-4 right-4 font-bold pointer-events-none">
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
    </footer>
  );
}