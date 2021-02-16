import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styled from 'styled-components';

/**
 * HoverGradient Function
 *
 * @param {Object} props
 * @param {Object} props.refContainer
 */
export default function HoverGradient({ refContainer }) {
  const ref = React.useRef();
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const cursorRotateZ = useMotionValue(0);

  useEffect(() => {
    if (typeof window !== `undefined`) {
      const elWidth = ref?.current?.offsetHeight;
      const elHeight = ref?.current?.offsetHeight;
      const cursorXCenter = window.innerWidth - elWidth / 2;
      const cursorYCenter = window.innerWidth - elHeight / 2;

      cursorX.set(cursorXCenter);
      cursorY.set(cursorYCenter);
    }
  }, []);

  useEffect(() => {
    const moveCursor = (e) => {
      const elWidth = ref?.current?.offsetHeight;
      const elHeight = ref?.current?.offsetHeight;
      const cursorXCenter = e.layerX - elWidth / 2;
      const cursorYCenter = e.layerY - elHeight / 2;

      cursorX.set(cursorXCenter);
      cursorY.set(cursorYCenter);

      const windowWidth = e.view.innerWidth;
      const windowCenterX = windowWidth / 2;
      const mouseX = e.layerX - windowCenterX;

      cursorRotateZ.set(mouseX * 0.1);
    };
    if (refContainer && refContainer.current) {
      refContainer.current.addEventListener('mousemove', moveCursor);
      return () => {
        refContainer.current.removeEventListener('mousemove', moveCursor);
      };
    }
  }, [cursorX, cursorY, cursorRotateZ]);

  const springConfig = { damping: 50, stiffness: 100 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorZSpring = useSpring(cursorRotateZ, springConfig);

  return (
    <HoverWrapper>
      <Gradient
        id="gradient"
        ref={ref}
        className="hover-image"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          rotateZ: cursorZSpring
        }}
      />
    </HoverWrapper>
  );
}

const Gradient = styled(motion.div)`
  visibility: hidden;

  @media ${(props) => props.theme.device.tablet} {
    position: absolute;
    visibility: visible;
    top: 0;
    left: 0;
    width: 500vw;
    min-width: 300vh;
    height: 500vw;
    min-height: 300vh;
    background-position: center center;
    background: linear-gradient(
        314.6deg,
        #ff5959 2.21%,
        rgba(252, 255, 119, 0.817708) 17.81%,
        rgba(153, 255, 151, 0.625) 36.64%,
        rgba(97, 170, 255, 0.721875) 52.41%,
        rgba(167, 255, 98, 0.796875) 64.62%,
        rgba(35, 128, 180, 0.865625) 75.82%,
        rgba(82, 93, 255, 0.915625) 83.96%,
        #cf42ca 89.06%,
        #ff5959 94.49%
      ),
      #ffffff;
    background: conic-gradient(
        from 130.97deg at 50% 50%,
        #ff5959 -11.81deg,
        #ff5959 8.13deg,
        rgba(252, 255, 119, 0.817708) 65.63deg,
        rgba(153, 255, 151, 0.625) 135deg,
        rgba(97, 170, 255, 0.721875) 193.12deg,
        rgba(167, 255, 98, 0.796875) 238.12deg,
        rgba(35, 128, 180, 0.865625) 279.38deg,
        rgba(82, 93, 255, 0.915625) 309.38deg,
        #cf42ca 328.19deg,
        #ff5959 348.19deg,
        #ff5959 368.13deg
      ),
      #ffffff;
  }

  @media (hover: none) and (pointer: coarse) {
    visibility: hidden;
  }
`;

const HoverWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: -10;
  overflow: hidden;
  background: conic-gradient(
      from 137.17deg at 17.92% 22%,
      #ff5959 -11.81deg,
      #ff5959 8.13deg,
      rgba(252, 255, 119, 0.817708) 65.63deg,
      rgba(153, 255, 151, 0.625) 135deg,
      rgba(97, 170, 255, 0.721875) 193.12deg,
      rgba(167, 255, 98, 0.796875) 238.12deg,
      rgba(35, 128, 180, 0.865625) 279.38deg,
      rgba(82, 93, 255, 0.915625) 309.38deg,
      #cf42ca 328.19deg,
      #ff5959 348.19deg,
      #ff5959 368.13deg
    ),
    #ffffff;
`;
