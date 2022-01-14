import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, useTransform, useMotionValue, animate } from "framer-motion";
import { getIndex, useFlubber } from "./hooks/use-flubber";
import {
  pUpperInitial,
  pUpperAnimate,
  pLowerInitial,
  pLowerAnimate,
} from "./svg/paypal";

// const pathsUpper = [pUpperInitial, pUpperAnimate, pUpperInitial];
// const colorsUpper = [1, 0.8, 1];
// const pathsLower = [pLowerInitial, pLowerAnimate, pLowerInitial];
// const colorsLower = [1, 0.3, 1];

export function PayPalCover() {
  // const [pathIndex, setPathIndex] = useState(0);
  // const progress = useMotionValue(pathIndex);
  // const pathUpper = useFlubber(progress, pathsUpper);
  // const fillUpper = useTransform(
  //   progress,
  //   pathsUpper.map(getIndex),
  //   colorsUpper
  // );

  // const pathLower = useFlubber(progress, pathsLower);
  // const fillLower = useTransform(
  //   progress,
  //   pathsLower.map(getIndex),
  //   colorsLower
  // );

  // React.useEffect(() => {
  //   const animation = animate(progress, pathIndex, {
  //     duration: 0.8,
  //     ease: "easeInOut",
  //     onComplete: () => {
  //       if (pathIndex === pathsUpper.length - 1) {
  //         progress.set(0);
  //         setPathIndex(1);
  //       } else {
  //         setPathIndex(pathIndex + 1);
  //       }
  //     },
  //   });

  //   return () => animation.stop();
  // }, [pathIndex]);
  return (
    <CoverContainer>
      <svg width="100vw" height="75%" viewBox="0 0 300 300">
        <defs>
          <filter id="multiply">
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        <g>
          {/* <motion.path fill="white" opacity={fillUpper} d={pathUpper} />
          <motion.path fill="white" opacity={fillLower} d={pathLower} /> */}
        </g>
      </svg>
    </CoverContainer>
  );
}

const CoverContainer = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  height: 50vw;
  min-height: 50px;

  width: 100vw;
  transform: translateX(-1rem);
  margin: 3.5vw 0;
  overflow: hidden;

  @media ${(props) => props.theme.device.mobileLg} {
    transform: translateX(-7vw);
  }

  background: conic-gradient(
      from -37.36deg at 50.03% 46.14%,
      rgba(254, 208, 79, 0.817708) 0deg,
      rgba(254, 208, 79, 0.817708) 73.69deg,
      #179bd7 136.88deg,
      #253b80 193.12deg,
      #1b337e 211.88deg,
      #253b80 226.87deg,
      #179bd7 297.74deg,
      rgba(254, 208, 79, 0.817708) 344.25deg,
      rgba(254, 208, 79, 0.817708) 360deg
    ),
    #ffffff;

  &[data-state="post"] path[data-color="black"] {
    fill: white !important;
  }

  path[data-multiply] {
    mix-blend-mode: multiply;
  }
`;
