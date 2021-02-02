import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

export default function HoverBuddy() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorRotateX = useMotionValue(0);
  const cursorRotateY = useMotionValue(0);

  useEffect(() => {
    if (typeof document !== `undefined`) {
      const moveCursor = (e) => {
        const windowWidth = e.view.innerWidth;
        const windowHeight = e.view.innerWidth;
        const elWidth = windowWidth * 0.6;
        const elHeight = windowWidth * 0.4;

        cursorX.set(e.clientX - elWidth / 2);
        cursorY.set(e.clientY - elHeight / 2);

        const windowCenterX = windowWidth / 2;
        const windowCenterY = windowHeight / 2;
        const mouseX = e.clientX - windowCenterX;
        const mouseY = e.clientY - windowCenterY;

        cursorRotateX.set(mouseX * 0.01);
        cursorRotateY.set(mouseY * 0.01);
      };
      window.addEventListener('mousemove', moveCursor);
      return () => {
        window.removeEventListener('mousemove', moveCursor);
      };
    }
  }, [cursorX, cursorY, cursorRotateX, cursorRotateY]);

  const springConfig = { damping: 20, stiffness: 100 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  return (
    <HoverBuddyWrapper>
      <Buddy
        className="hover-buddy"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          rotateX: cursorRotateX,
          rotateY: cursorRotateY
        }}
      />
    </HoverBuddyWrapper>
  );
}

export const BodyStyles = createGlobalStyle`


`;

const Buddy = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  width: 60vw;
  height: 40vw;
  visibility: hidden;
  opacity: 0;
  transform-origin: center center;
  transition: opacity ${(props) => props.theme.animation.duration[300].css}
    ${(props) => props.theme.animation.timingFunction.css};
  will-change: transform, opacity;
  background-size: cover;
`;

const HoverBuddyWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: solid 5px red; */
  pointer-events: none;
  perspective: 100vw;
  z-index: -10;
`;
