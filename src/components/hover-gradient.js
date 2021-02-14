import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styled from 'styled-components';

/**
 * HoverGradient Function
 *
 * Takes no props
 */
export default function HoverGradient(props) {
  const [id, setId] = React.useState('253A71');
  const [mounted, setMounted] = useState(false);

  const cursorX = useMotionValue(-1700);
  const cursorY = useMotionValue(-1700);
  const cursorRotateZ = useMotionValue(0);

  useEffect(() => {
    return () => {
      setMounted(true);
    };
  });

  useEffect(() => {
    if (typeof document !== `undefined` && typeof window !== `undefined`) {
      const moveCursor = (e) => {
        setId(document.body.getAttribute(''));

        const windowWidth = e.view.innerWidth;
        const elWidth = windowWidth * 2.5;
        const elHeight = windowWidth * 2.5;

        cursorX.set(e.layerX - elWidth / 2);
        cursorY.set(e.layerY - elHeight / 2);

        const windowCenterX = windowWidth / 2;
        const mouseX = e.layerX - windowCenterX;

        cursorRotateZ.set(mouseX * 0.1);
      };
      document
        .getElementById('footer')
        .addEventListener('mousemove', moveCursor);
      return () => {
        document
          .getElementById('footer')
          .removeEventListener('mousemove', moveCursor);
      };
    }
  }, [cursorX, cursorY, cursorRotateZ]);

  const springConfig = { damping: 50, stiffness: 100 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorZSpring = useSpring(cursorRotateZ, springConfig);

  if (typeof window == `undefined`) {
    return <></>;
  }

  return (
    <HoverWrapper>
      {mounted && (
        <Gradient
          className="hover-image"
          style={{
            translateX: cursorXSpring,
            translateY: cursorYSpring,
            rotateZ: cursorZSpring
          }}
        />
      )}
    </HoverWrapper>
  );
}

const Gradient = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 250vw;
  height: 250vw;
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
