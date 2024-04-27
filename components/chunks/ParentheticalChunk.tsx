import clsx from 'clsx';
import { motion } from 'framer-motion';

export function ParentheticalChunk({ text }: any) {
  const blinkVariants = {
    initial: {
      opacity: 1,
    },
    hover: {
      // blink slowly on repeat
      opacity: [1, 0.1, 1],
      transition: {
        repeat: Infinity,
        duration: 1,
      },
    },
  };

  return (
    <motion.span
      className="whitespace-nowrap"
      initial={'initial'}
      whileHover={'hover'}
    >
      <motion.span variants={blinkVariants}>( </motion.span>
      <span className="inline-flex h-fit items-center justify-center -translate-y-[50%] lg:-translate-y-[100%]">
        <span
          className={clsx(
            'text-body',
            'inline-flex text-center whitespace-pre-wrap max-w-[25em]',
          )}
        >
          {text}
        </span>
      </span>
      <motion.span variants={blinkVariants}> )</motion.span>
    </motion.span>
  );
}
