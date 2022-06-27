import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

/**
 * Local Components
 */
import Tick from "./tick";
import MotionScroll from "./motion-scroll";

/**
 * Local Styles/JS
 */
import { Wrapper } from "./style/global-styles";
import { repeatTitle } from "../functions/util";

/**
 * PageHeader Component
 */
export default function PageHeader({ title, size = "lg" }) {
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <Wrapper>
      <MotionScroll triggerPoint={0} yOffset={50}>
        <PageHeaderWrapper
          className={size}
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 1 }}
        >
          <Tick tickerSpeed={2} direction="left" offset={0}>
            {() => (
              <span>
                <p
                  className={`${
                    size === "lg" ? "h1" : size === "sm" ? "h2" : "h1"
                  } display`}
                >
                  {repeatTitle(`${title}`)}
                </p>
              </span>
            )}
          </Tick>
        </PageHeaderWrapper>
      </MotionScroll>
    </Wrapper>
  );
}

const PageHeaderWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  overflow: visible;
  height: 50vh;
  min-height: 500px;

  &.sm {
    height: 30vh;
    min-height: 300px;
    padding-top: 4rem;
  }

  .ticker {
    position: relative;
    z-index: -1;
    pointer-events: none;
    user-select: none;
  }

  p.h1,
  p.h2,
  p.h3 {
    -webkit-text-stroke-width: 1.25px;
    -webkit-text-stroke-color: black;
    color: transparent !important;

    @media ${(props) => props.theme.device.mobileLg} {
      -webkit-text-stroke-width: 2px;
    }
  }
`;
