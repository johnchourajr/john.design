import clsx from "clsx";
import React, { SVGProps } from "react";
import InlineLink from "@/components/InlineLink";
import { motion } from "framer-motion";

import { setRootColor } from "lib/utils/slugify";
import ColorWheelSvg from "@/components/color-wheel/ColorWheelSvg";

export const RenderColorWheel = ({
  className,
  handleColorChange,
  handleClick,
}: any) => {
  const active = typeof handleColorChange === "function" ? true : false;
  return (
    <motion.span
      role={"button"}
      layoutId="color-wheel"
      onClick={handleClick}
      onMouseUp={handleColorChange}
      className={clsx("h-[1em] translate-y-[-0em] inline-block", className)}
    >
      <ColorWheelSvg active={active} />
    </motion.span>
  );
};

export default function ColorWheel() {
  const [color, setColor] = React.useState("#ff0000");

  const handleColorChange = (e: any) => {
    const colorFromSVG = e.target.getAttribute("fill");
    if (colorFromSVG === null || colorFromSVG === "none") {
      setRootColor("#ff0000");
      setColor("#ff0000");
    } else {
      setRootColor(colorFromSVG);
      setColor(colorFromSVG);
    }
  };

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <div className="flex h-[80vh] flex-col items-start justify-center">
        <RenderColorWheel
          handleColorChange={handleColorChange}
          className="lg:hidden visible lg:invisible inline-flex text-[40vw] mb-10"
        />
        <h1 className="inline-flex w-full align-baseline flex-wrap font-pixel text-[12vw] leading-[1.1]  whitespace-normal">
          Click The &nbsp;
          <RenderColorWheel
            handleColorChange={handleColorChange}
            className="hidden lg:visible invisible lg:inline-flex"
          />
          Color Wheel {color}
        </h1>
      </div>
    </>
  );
}
