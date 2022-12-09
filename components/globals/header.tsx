import React from "react";
import clsx from "clsx";
import navData from "../../data/nav";
import InlineLink from "../InlineLink";
import { LinkGridItemProps } from "../LinkGridItem";
import Logo from "../svg/logo";
import { useTime } from "../../utils/hooks";

function Slash() {
  return (
    <p
      className={clsx(
        "z-50 text-xs relative font-bold uppercase tracking-wider opacity-50"
      )}
    >
      /
    </p>
  );
}

export default function Header() {
  const { time, dateStr } = useTime();

  return (
    <nav className="w-full inline-flex row justify-between items-center">
      <div className="inline-flex row gap-6 items-center">
        <InlineLink href="/" className={clsx("z-50 relative")}>
          <Logo />
        </InlineLink>

        <InlineLink
          href="/"
          className={clsx(
            "z-50 text-xs relative font-bold uppercase tracking-wider pointer-events-none",
            "no-underline"
          )}
        >
          John.Design
        </InlineLink>
        <Slash />
        {navData.map(({ href, title }: any, i: number) => (
          <InlineLink
            key={i}
            href={href}
            className={clsx(
              "z-50 text-xs relative font-bold uppercase tracking-wider pointer-events-none",
              "no-underline"
            )}
          >
            {title}
          </InlineLink>
        ))}
      </div>
      <div className="inline-flex row gap-6 items-center">
        <p
          className={clsx(
            "inline-flex row gap-4 z-50 text-xs relative font-bold uppercase tracking-wider pointer-events-none"
          )}
        >
          <span>{dateStr}</span>
          <span>{time}</span>
        </p>
      </div>
    </nav>
  );
}
