import React from "react";
import clsx from "clsx";
import navData from "../../data/nav";
import InlineLink from "../InlineLink";
import { LinkGridItemProps } from "../LinkGridItem";
import Logo from "../svg/logo";
import { useTime } from "../../utils/hooks";
import { RenderColorWheel } from "../../pages/exp/color-wheel";
import { setRootColor } from "../../utils";

function Slash() {
  return (
    <p
      className={clsx(
        "z-50 text-xs relative font-bold uppercase tracking-wider opacity-50",
        "md:inline-flex hidden"
      )}
    >
      /
    </p>
  );
}

const handleColorChange = (e: any) => {
  const colorFromSVG = e.target.getAttribute("fill");
  if (colorFromSVG === null || colorFromSVG === "none") {
    setRootColor("#ff0000");
  } else {
    setRootColor(colorFromSVG);
  }
};

export default function Header() {
  const [colorActive, setColorActive] = React.useState(false);
  const { time, dateStr } = useTime();

  const handleActive = (state: boolean) => {
    if (state) {
      document.documentElement.setAttribute("data-dim", "true");
    } else {
      document.documentElement.setAttribute("data-dim", "false");
    }

    setColorActive(state);
  };

  return (
    <>
      <nav
        className={clsx(
          "w-full inline-flex row justify-between items-center sticky top-0 p-4",
          // add black to transparent gradient to an after element with tailwind syntax
          "after:content after:absolute after:inset-0 after:z-0 after:h-[15rem] after:pointer-events-none",
          "after:bg-gradient-to-b after:from-black after:via-transparent after:to-transparent",
          "z-50"
        )}
      >
        <div className="inline-flex row gap-6 items-center">
          <InlineLink href="/" className={clsx("z-50 relative")}>
            <Logo />
          </InlineLink>

          <InlineLink
            href="/"
            className={clsx(
              "z-50 text-xs relative font-bold uppercase tracking-wider pointer-events-none",
              "md:inline-flex hidden",
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
                "md:inline-flex hidden",
                "no-underline"
              )}
            >
              {title}
            </InlineLink>
          ))}
        </div>
        <div className="inline-flex row gap-6 items-center">
          {!colorActive && (
            <RenderColorWheel
              handleClick={() => handleActive(true)}
              className="z-[9999]"
            />
          )}
          <p
            className={clsx(
              "inline-flex row gap-4 z-50 text-xs relative font-bold uppercase tracking-wider pointer-events-none",
              "md:inline-flex hidden"
            )}
          >
            <span>{dateStr}</span>
            <span>{time}</span>
          </p>
        </div>
      </nav>
      {colorActive && (
        <>
          <RenderColorWheel
            handleClick={() => handleActive(false)}
            handleColorChange={handleColorChange}
            className="w-[20vw] h-[20vw] fixed top-[20vw] left-[40vw] z-[9999]"
          />
          <button
            className="dim-shim fixed inset-0 z-[9000] transition-all ease-out-expo"
            onClick={() => handleActive(false)}
          />
        </>
      )}
    </>
  );
}
