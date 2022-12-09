import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import InlineLink from "../../components/InlineLink";
import {
  getSettingValue,
  SettingsGroup,
} from "../../components/SettingsComponents";
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

// add <strong> tag to words wrapped in asterisks
const addStrongTags = (text: string) => {
  const words = text.split(" ");
  const wordsWithStrong = words.map((word, key) => {
    if (word.startsWith("*") && word.endsWith("*")) {
      return (
        <strong key={key} className="font-black-ritalic">
          {word.slice(1, -1)}
        </strong>
      );
    }
    return word;
  });
  return wordsWithStrong;
};

const TextContainer = ({ text, motionObject, motionKey, className }: any) => {
  if (!text) return null;

  const motionController = motionObject[motionKey];

  const childrenArray = typeof text === "string" ? text.split(" ") : [];
  const childrenArrayWithMotion = childrenArray.map(
    (child: any, index: number) => {
      return (
        <motion.span
          key={index}
          id={`${slugify(child)}`}
          className={className}
          layout
        >
          {addStrongTags(child)} {index !== childrenArray.length - 1 && " "}
        </motion.span>
      );
    }
  );

  return (
    <span
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

export function JustifiedHeadlineInner({ headline, settings }: any) {
  const [ani, setAni] = React.useState(0);
  const speed = getSettingValue(settings, "Speed", 1000);
  const slant = getSettingValue(settings, "Add Slant", false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAni((prev) => (prev + 1) % LINE_ONE.length);
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <p
      className={clsx(
        "my-[10vw] leading-[1] w-full font-black pointer-events-none",
        slant && "font-black-ritalic"
      )}
      data-id={ani}
    >
      {/* map first index only */}
      {headline.map(({ text }: any, index: number) => {
        if (index === 0) {
          return (
            <span key={index} className="z-[100] relative">
              <TextContainer
                text={text}
                motionObject={TOP_LINE}
                motionKey={ani}
              />
            </span>
          );
        } else return null;
      })}
      {/* map for after first index */}
      {headline.map(({ text }: any, index: number) => {
        const even = index % 2;
        if (index !== 0) {
          return (
            <TextContainer
              key={index}
              text={text}
              motionObject={even ? LINE_TWO : LINE_ONE}
              motionKey={ani}
            />
          );
        } else return null;
      })}
    </p>
  );
}

const SETTINGS = [
  {
    name: "Add Slant",
    type: "Boolean",
    value: false,
  },
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

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8 font-sans">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <JustifiedHeadlineInner
        settings={settings}
        headline={[
          { text: "John Is" },
          { text: "Working On" },
          { text: "The Internet" },
        ]}
      />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
