import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";

const TOP_LINE = [
  {
    parent: "w-full",
    child:
      "w-full justify-center !text-[1rem] lg:!text-[1vw] tracking-wider uppercase",
  },
  {
    parent: "w-1/2 ml-auto",
    child:
      "w-full justify-between !text-[1rem] lg:!text-[1vw] tracking-wider uppercase",
  },
  {
    parent: "w-1/2",
    child:
      "w-full justify-start !text-[1rem] lg:!text-[1vw] tracking-wider uppercase",
  },
  {
    parent: "w-1/2",
    child:
      "w-full justify-between !text-[1rem] lg:!text-[1vw] tracking-wider uppercase",
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
    parent: "w-1/2",
    child: "w-full justify-start",
  },
  {
    parent: "w-1/2",
    child: "w-full justify-between",
  },
  {
    parent: "w-full",
    child: "w-full justify-center",
  },
  {
    parent: "w-1/2 ml-auto",
    child: "w-full justify-between",
  },
];

const TextContainer = ({ text, motionObject, motionKey }: any) => {
  const motionController = motionObject[motionKey];

  const childrenArray = text.split(" ");
  const childrenArrayWithMotion = childrenArray.map(
    (child: any, index: number) => {
      return (
        <motion.span key={index} layout>
          {child} {index !== childrenArray.length - 1 && " "}
        </motion.span>
      );
    }
  );

  return (
    <div
      className={clsx(
        "relative flex flex-col items-center justify-start w-full",
        motionController.parent
      )}
    >
      <motion.p
        className={clsx(
          "inline-flex font-black whitespace-pre tracking-tight text-[8vw]",
          motionController.child
        )}
        initial={{ fontVariationSettings: `'slnt' 10` }}
        whileHover={{ fontVariationSettings: `'slnt' 10` }}
        layout
      >
        {childrenArrayWithMotion}
      </motion.p>
    </div>
  );
};

export function JustifiedHeadlineInner() {
  const [ani, setAni] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAni((prev) => (prev + 1) % LINE_ONE.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-[10vw]">
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
    </div>
  );
}

export default function JustifiedHeadline() {
  return (
    <>
      <Link href="/exp/" className="">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </Link>
      <JustifiedHeadlineInner />
    </>
  );
}
