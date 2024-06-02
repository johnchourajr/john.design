import { type Variants } from 'framer-motion';

type Delay = 0.1 | 0.2 | 0.3 | number;

export const basicAnimateVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export const basicAnimateDelayVariants = ({
  delay = 0.3,
}: {
  delay?: Delay;
}): Variants => {
  return {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delay,
      },
    },
  };
};

export const basicAnimateParentVariants = ({
  staggerChildren = 0.1,
  delayChildren = 0.3,
}: {
  staggerChildren?: Delay;
  delayChildren?: Delay;
}): Variants => {
  return {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};
