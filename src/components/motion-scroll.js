import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { animation } from '../data/baseTheme';

/**
 * Renders a <MotionScroll /> component
 * @component
 * @param {Object} props
 * @param {any} props.children react children
 * @param {Boolean} props.span when true wraps render in span
 * @param {Number} props.yOffset any number that will be rendered as a pixel value for transforming the y axis of the element
 * @param {Object} props.easing [number, number, number, number] | "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate" | EasingFunction
 * @param {Number} props.triggerPoint value between 0 and 1 (top and bottom of the window), point to start animation
 * @param {Boolean} props.fadeOut chooses whether the object fades out
 * @param {Boolean} props.fadeIn chooses whether the object fades in
 * @param {object} props.rest the rest of any props
 * @returns an element wrapped in scroll motion paramaters
 */
export default function MotionScroll({
  children,
  span = false,
  yOffset = 0.5,
  easing = animation.timingFunction.js,
  triggerPoint = 0.1,
  fadeOut = true,
  fadeIn = false,
  ...rest
}) {
  const ref = useRef();
  const { scrollY } = useViewportScroll();
  const [elementTop, setElementTop] = useState(0);
  //   const [elementBottom, setElementBottom] = useState(0);
  // const [elementHeight, setElementHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const setValues = () => {
      // @ts-ignore
      setElementTop(ref.current.offsetTop);
      // setElementBottom(ref.current.offsetTop + ref.current.offsetHeight);
      // setElementHeight(ref.current.offsetHeight);
      setClientHeight(window.innerHeight);
    };

    setValues();
    document.addEventListener('load', setValues);
    window.addEventListener('resize', setValues);

    return () => {
      document.removeEventListener('load', setValues);
      window.removeEventListener('resize', setValues);
    };
  }, [ref, yOffset]);

  const yOffsetValue = yOffset;
  const yOffsetArray = fadeIn ? [yOffsetValue, 0] : [0, -yOffsetValue];

  const transformInitialValue = elementTop - clientHeight * triggerPoint;
  const transformFinalValue = elementTop + yOffsetValue;

  const yTransformRange = fadeIn
    ? [transformInitialValue, elementTop * 0.65]
    : [transformInitialValue, transformFinalValue];

  const y = useTransform(scrollY, yTransformRange, yOffsetArray, easing);

  const opacityInitialValue = fadeOut ? 0 : 1;
  const opacityRange = useMemo(() => [opacityInitialValue, 1], [
    opacityInitialValue
  ]);

  const yOpacityRange = fadeIn
    ? [transformInitialValue, elementTop * 0.65]
    : [transformFinalValue, transformInitialValue];
  const opacity = useTransform(
    scrollY,
    yOpacityRange,
    opacityRange,
    // @ts-ignore
    'anticipate'
  );

  if (span) {
    return (
      <motion.span
        ref={ref}
        initial={{ y: 0 }}
        style={{ y, opacity }}
        {...rest}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.div ref={ref} initial={{ y: 0 }} style={{ y, opacity }} {...rest}>
      {children}
    </motion.div>
  );
}
