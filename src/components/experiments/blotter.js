import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  FliesText,
  LiquidDistortionText,
  DistortionText,
  SplitColorChannelText
} from 'react-text-fun';

import styled from 'styled-components';
import { changeBodyClass } from '../../functions/util';

export default function Blotter() {
  useEffect(() => {
    changeBodyClass('enter', '', 'white', 'black');
  }, []);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorRotateX = useMotionValue(0);
  const cursorRotateY = useMotionValue(0);

  useEffect(() => {
    if (typeof document !== `undefined` && typeof window !== `undefined`) {
      const moveCursor = (e) => {
        const windowWidth = e.view.innerWidth;
        const windowHeight = e.view.innerWidth;
        const elWidth = 16;
        const elHeight = 16;

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
  const rotation = useTransform(cursorXSpring, [0, 90], [10, 300]);

  return (
    <Wrap>
      <Cursor
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          rotateX: cursorRotateX,
          rotateY: cursorRotateY
        }}
      />

      <SplitColorChannelText
        text="John.Art"
        ontFamily={'LabilGrotesk-Medium'}
        fontSize={220}
        rotation={24.0}
        rgbOffset={0.12}
        addBlur={true}
        addNoise={true}
        paddingLeft={100}
        paddingRight={100}
      />
    </Wrap>
  );
}

const Cursor = styled(motion.div)`
  width: 1rem;
  height: 1rem;
  background: white;
  mix-blend-mode: difference;
  border-radius: 1rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
`;

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .channel-split-component {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
