import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const EXAMPLE_LIST = [{}, {}, {}, {}, {}];

function Section() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end"],
  });

  return (
    <section ref={ref} className="relative flex h-[300vh] ">
      <div className="sticky top-0 w-full h-[100vh]">
        {EXAMPLE_LIST.map((_, i) => (
          <Item key={i} index={i} scrollYProgress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function Item({ index, scrollYProgress }: any) {
  const key = () => {
    const offset = 1 / (EXAMPLE_LIST.length + 1);
    const segment = 1.5 / EXAMPLE_LIST.length;
    const start = index === 0 ? 0 : index * offset;
    const end = index + 1 === EXAMPLE_LIST.length ? 1 : start + segment;
    const middle = (start + end) / 2;
    const firstQuarter = (start + middle) / 2;
    const thirdQuarter = (middle + end) / 2;

    return {
      offset,
      segment,
      start,
      middle,
      firstQuarter,
      thirdQuarter,
      end,
    };
  };

  const keyframes = [
    key().start,
    key().firstQuarter,
    key().middle,
    key().thirdQuarter,
    key().end,
  ];

  const height = useTransform(scrollYProgress, keyframes, [
    "10%",
    "10%",
    "40%",
    "40%",
    "100%",
  ]);
  const width = useTransform(scrollYProgress, keyframes, [
    "calc(10% - 4px)",
    "calc(10% - 4px)",
    "calc(24% - 4px)",
    "calc(24% - 4px)",
    "66%",
  ]);
  const bottom = useTransform(scrollYProgress, keyframes, [
    "40%",
    "40%",
    "0%",
    "0%",
    "0%",
  ]);
  const right = useTransform(scrollYProgress, keyframes, [
    "0%",
    "0%",
    "10%",
    "10%",
    "34%",
  ]);

  const zIndex = useTransform(scrollYProgress, keyframes, [
    -index + 10,
    -index + 10,
    -index + 10,
    index + 10,
    index + 10,
  ]);

  return (
    <motion.div
      className="absolute w-full h-[100vh] flex justify-center items-center border-t-2 border-b-2 border-[#ff0000] "
      style={{ zIndex }}
    >
      <motion.figure
        className="bg-[#ff0000] absolute border-shadow"
        style={{ width, height, right, bottom }}
      >
        {index}
        <svg className="absolute w-full h-full inset-0">
          <rect
            width="100%"
            height="100%"
            fill="transparent"
            // stroke="black"
            // strokeWidth={8}
          />
        </svg>
      </motion.figure>
    </motion.div>
  );
}

export default function ScrollGrow() {
  return (
    <>
      <Link href="/exp/" className="">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </Link>
      <div className="relative w-full">
        <section className="relative flex items-center justify-start just min-h-[50vh]">
          Start scrolling down ↓
        </section>
        <Section />
        <section className="relative flex items-center justify-start just min-h-[50vh]">
          Scroll back up ↑
        </section>
      </div>
    </>
  );
}
