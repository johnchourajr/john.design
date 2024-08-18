'use client';

import InlineLink from '@/components/fragments/InlineLink';
import clsx from 'clsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import React from 'react';

const EXAMPLE_LIST = [
  { text: 'moonlight' },
  { text: 'bargain' },
  { text: 'looney' },
  { text: 'problem' },
  { text: 'zombies' },
];

function Item({ index, scrollYProgress, text }: any) {
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
    '15%',
    '15%',
    '40%',
    '40%',
    '100%',
  ]);
  const width = useTransform(scrollYProgress, keyframes, [
    'calc(10% - 4px)',
    'calc(10% - 4px)',
    'calc(24% - 4px)',
    'calc(24% - 4px)',
    '66%',
  ]);
  const bottom = useTransform(scrollYProgress, keyframes, [
    '40%',
    '40%',
    '0%',
    '0%',
    '0%',
  ]);
  const right = useTransform(scrollYProgress, keyframes, [
    '0%',
    '0%',
    '10%',
    '10%',
    '34%',
  ]);

  const zIndex = useTransform(scrollYProgress, keyframes, [
    -index + 10,
    -index + 10,
    -index + 10,
    index + 10,
    index + 10,
  ]);

  const fontSize = useTransform(scrollYProgress, keyframes, [
    '1rem',
    '1rem',
    '6rem',
    '6rem',
    '10rem',
  ]);

  return (
    <motion.div
      className="absolute w-full h-[100vh] flex justify-center items-center"
      style={{ zIndex }}
    >
      <motion.figure
        className={clsx(
          'bg-black absolute border-shadow overflow-hidden',
          "after:content-[''] after:absolute after:inset-0 after:bg-[var(--root-color)] after:opacity-20 ",
        )}
        style={{ width, height, right, bottom }}
      >
        <motion.h3
          style={{ fontSize }}
          className=" font-black tracking-tighter m-0 absolute top-0 left-[4%]"
        >
          {text}
        </motion.h3>
        <svg className="absolute w-full h-full inset-0">
          <rect width="100%" height="100%" fill="transparent" />
        </svg>
      </motion.figure>
    </motion.div>
  );
}

function Section() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end'],
  });

  return (
    <section ref={ref} className="relative flex h-[300vh] ">
      <div className="sticky top-0 w-full h-[100vh]">
        {EXAMPLE_LIST.map((_, i) => (
          <Item key={i} index={i} scrollYProgress={scrollYProgress} {..._} />
        ))}
      </div>
    </section>
  );
}

export default function ScrollGrow() {
  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <div className="relative w-full">
        <section className="relative flex items-center justify-start just min-h-[50vh] mb-4 border-b-2 border-[var(--root-color)] ">
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
