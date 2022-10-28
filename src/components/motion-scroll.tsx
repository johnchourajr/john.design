import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useViewportScroll,
  useTransform,
  useSpring,
} from "framer-motion";

/**
 * Local Theme
 */
import { animation } from "../data/baseTheme";

const physics = { damping: 15, mass: 0.27, stiffness: 55 }; // easing of smooth scroll

export default function MotionScroll(props) {
  return <MotionScrollInner {...props} />;
}

// create interface for MotionScrollInner
interface MotionScrollInnerProps {
  children: React.ReactNode;
  useSpan: boolean;
  yOffset: number;
  easing: any;
  triggerPoint: number;
  fadeOut: boolean;
  fadeIn: boolean;
}
/**
 * Renders a <MotionScroll /> component
 * @returns an element wrapped in scroll motion paramaters
 */
function MotionScrollInner({
  children,
  useSpan = false,
  yOffset = 0.5,
  easing = animation.timingFunction.js,
  triggerPoint = 0.1,
  fadeOut = true,
  fadeIn = false,
  ...rest
}: MotionScrollInnerProps) {
  /**
   * Element Setup
   */
  const ref = useRef() as any;
  const { scrollY } = useViewportScroll();
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const Component = useSpan ? motion.span : motion.div;

  useEffect(() => {
    if (!ref.current) return;

    const setValues = () => {
      setElementTop(ref.current.offsetTop);
      setClientHeight(window.innerHeight);
    };

    setValues();
    document.addEventListener("load", setValues);
    window.addEventListener("resize", setValues);

    return () => {
      document.removeEventListener("load", setValues);
      window.removeEventListener("resize", setValues);
    };
  }, [ref, yOffset]);

  /**
   * Brackets Setup
   * @var transformInitialValue sets up trigger point 1 for the bottom 0 for the top
   * @var transformFinalValue for fadeOut animation, this sets the end bracket point
   * @var transformFinalValueInverted for fadeIn animation, this sets the end bracket point
   */
  const transformInitialValue = elementTop - clientHeight * triggerPoint;
  const transformFinalValue = elementTop + yOffset * 2;
  const transformFinalValueInverted = transformInitialValue + yOffset * 2;

  /**
   * Translate Y Setup
   * @var yTransformRange the transform brakets set in place, booled by fadeIn or !fadeIn
   * @var yOffsetArray the bool that determines which direction the y offset moves in
   * @var y the y axis transform function
   */
  const yTransformRange = fadeIn
    ? [transformInitialValue, transformFinalValueInverted]
    : [transformInitialValue, transformFinalValue];
  const yOffsetArray = fadeIn ? [yOffset, 0] : [0, -yOffset];
  const y = useTransform(scrollY, yTransformRange, yOffsetArray, easing);

  /**
   * Opacity Setup
   * @var opacityInitialValue a bool to set initial value of opacity
   * @var opacityRange a memoized output of opacity range
   * @var yOpacityRange the opacity brakets set in place, booled by fadeIn or !fadeIn
   * @var opacity the opacity transform function
   */
  const opacityInitialValue = fadeOut ? 0 : 1;
  const opacityRange = useMemo(
    () => [opacityInitialValue, 1],
    [opacityInitialValue]
  );
  const yOpacityRange = fadeIn
    ? [transformInitialValue, transformFinalValueInverted]
    : [transformFinalValue, transformInitialValue];
  const opacity = useTransform(scrollY, yOpacityRange, opacityRange, easing);

  /**
   * Spring-y-ness Setup
   * @var springY the useSpring value for transforming the objects against the y axis
   * @var springOpacity the useSpring value for transforming the objects opacity
   */
  const springY = useSpring(y, physics); // apply easing to the negative scroll value
  const springOpacity = useSpring(opacity, physics); // apply easing to the negative scroll value

  return (
    <Component
      ref={ref}
      initial={{ y: 0 }}
      style={{ y: springY, opacity: springOpacity, position: "relative" }}
      {...rest}
    >
      {children}
    </Component>
  );
}
