import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import InlineLink from "../../components/InlineLink";
import { SettingsGroup } from "./settings";
import { slugify } from "../../utils";

const TOP_LINE = [
  {
    parent: "w-full",
    child:
      "w-full justify-center !text-[1rem] lg:!text-[1vw] !tracking-wider uppercase",
  },
  {
    parent: "w-1/2 ml-auto",
    child:
      "w-full justify-between !text-[1rem] lg:!text-[1vw] !tracking-wider uppercase",
  },
  {
    parent: "w-1/2",
    child:
      "w-full justify-start !text-[1rem] lg:!text-[1vw] !tracking-wider uppercase",
  },
  {
    parent: "w-1/2",
    child:
      "w-full justify-between !text-[1rem] lg:!text-[1vw] !tracking-wider uppercase",
  },
];
const LINE_ONE = [
  {
    parent: "w-full",
    child: "w-full justify-between",
  },
  {
    parent: "w-fit ml-auto",
    child: "w-full justify-between",
  },
  {
    parent: "w-full",
    child: "w-full justify-between",
  },
  {
    parent: "w-fit mr-auto",
    child: "w-full justify-between",
  },
];
const LINE_TWO = [
  {
    parent: "w-3/4",
    child: "w-full justify-start",
  },
  {
    parent: "w-3/4",
    child: "w-full justify-between",
  },
  {
    parent: "w-full",
    child: "w-full justify-center",
  },
  {
    parent: "w-3/4 ml-auto",
    child: "w-full justify-between",
  },
];

const TextContainer = ({ text, motionObject, motionKey }: any) => {
  const id = React.useMemo(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);
  const motionController = motionObject[motionKey];

  const childrenArray = text.split(" ");
  const childrenArrayWithMotion = childrenArray.map(
    (child: any, index: number) => {
      return (
        <motion.span key={index} id={`${id}-${slugify(child)}`} layout>
          {child} {index !== childrenArray.length - 1 && " "}
        </motion.span>
      );
    }
  );

  return (
    <span
      id={id}
      className={clsx(
        "relative flex flex-col items-center justify-start w-full",
        motionController.parent
      )}
    >
      <motion.span
        className={clsx(
          "inline-flex  whitespace-pre tracking-normal uppercase text-[8vw]",
          motionController.child
        )}
        layout
      >
        {childrenArrayWithMotion}
      </motion.span>
    </span>
  );
};

export function JustifiedHeadlineInner({ settings }: any) {
  const [ani, setAni] = React.useState(0);
  const speed = settings.find((setting: any) => setting.name === "Speed");
  const slant = settings.find((setting: any) => setting.name === "Add Slant");

  console.log(slant.value);

  React.useEffect(() => {
    const interval = setInterval(
      () => {
        setAni((prev) => (prev + 1) % LINE_ONE.length);
      },
      speed.value ? speed.value : 1000
    );
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <p
      className={clsx(
        "my-[10vw] min-h-[70vh] font-black",
        slant.value && "font-black-ritalic"
      )}
      data-id={ani}
    >
      <TextContainer text="John Is" motionObject={TOP_LINE} motionKey={ani} />
      <TextContainer
        text="Working On"
        motionObject={LINE_ONE}
        motionKey={ani}
      />
      <TextContainer
        text="The Internet"
        motionObject={LINE_TWO}
        motionKey={ani}
      />
    </p>
  );
}

const SETTINGS = [
  {
    name: "Add Slant",
    type: "Boolean",
    value: false,
  },
  // {
  //   name: "Squash & Stretch",
  //   type: "Boolean",
  //   value: true,
  // },
  {
    name: "Speed",
    type: "Slider",
    value: 1000,
    min: 500,
    max: 3000,
  },
];

export default function JustifiedHeadline() {
  const [settings, setSettings] = React.useState(SETTINGS);

  // React.useEffect(() => {
  //   console.log({ settings });
  // }, [settings]);

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8 font-sans">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <JustifiedHeadlineInner settings={settings} />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
