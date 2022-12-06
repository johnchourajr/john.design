import React, { SVGProps } from "react";
import InlineLink from "../../components/InlineLink";
import { setRootColor } from "../../utils";

const CollorWheelSVG = (props: SVGProps<SVGSVGElement>) => {
  const sharedClasses =
    "group-hover:opacity-25 hover:!opacity-100 transition-all ease-out-expo duration-300";

  const sharedInlineStyles = {
    touchAction: "none",
    cursor: "url('/eyedrop.svg') 4 28, auto",
  };

  const sharedStyles = {
    style: sharedInlineStyles,
    className: sharedClasses,
  };

  return (
    <svg
      width={"100%"}
      height={"100%"}
      fill="none"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      className="group"
      shapeRendering="geometricPrecision"
      {...props}
    >
      <path
        d="M8 8V7h6v2h-1v2h-2v-1h-1V9H9V8H8Z"
        fill="#2054F5"
        {...sharedStyles}
      />
      <path
        d="M6 8h1v6H5v-1H3v-2h1v-1h1V9h1V8Z"
        fill="#EA33A2"
        {...sharedStyles}
      />
      <path
        d="M8 7H7v7h2v-1h2v-1h1v-1h-1v-1h-1V9H9V8H8V7Z"
        fill="#7918F5"
        {...sharedStyles}
      />
      <path
        d="M7 8V7H0v2h1v2h1v1h1v-1h1v-1h1V9h1V8h1Z"
        fill="#ff0000"
        {...sharedStyles}
      />
      <path
        d="M6 6v1H0V5h1V3h2v1h1v1h1v1h1Z"
        fill="#EC642B"
        {...sharedStyles}
      />
      <path
        d="M8 6H7V0h2v1h2v2h-1v1H9v1H8v1Z"
        fill="#14FF00"
        {...sharedStyles}
      />
      <path
        d="M6 7h1V0H5v1H3v1H2v1h1v1h1v1h1v1h1v1Z"
        fill="#D8FE51"
        {...sharedStyles}
      />
      <path
        d="M7 6v1h7V5h-1V3h-1V2h-1v1h-1v1H9v1H8v1H7Z"
        fill="#75FBD9"
        {...sharedStyles}
      />
    </svg>
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
        <h1 className="inline-flex max-w-[100vw] align-baseline flex-wrap font-pixel text-[12vw] leading-[1.1] whitespace-nowrap">
          Click The &nbsp;
          <span
            role={"button"}
            // onClick={(e) => handleColorChange(e)}
            onMouseUp={(e) => handleColorChange(e)}
            className=" h-[1em] translate-y-[-0em] inline-block"
          >
            <CollorWheelSVG />
            &nbsp;
          </span>
          Color Wheel
          <br />
        </h1>
        <h1 className="inline-flex max-w-[100vw] align-baseline flex-wrap font-pixel text-[12vw] leading-tight whitespace-nowrap">
          <span>{color}</span>
        </h1>
      </div>
    </>
  );
}
