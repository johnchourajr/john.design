import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styled from "styled-components";

/**
 * HoverBuddy Function
 *
 * Takes no props
 */
export default function HoverBuddy() {
  const [id, setId] = React.useState("253A71");
  const [mounted, setMounted] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [useIframe, setUseIframe] = React.useState(false) as any;

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorRotateX = useMotionValue(0);
  const cursorRotateY = useMotionValue(0);

  const handleLoading = () => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      setMounted(true);
    };
  });

  useEffect(() => {
    // if (typeof document !== `undefined` && typeof window !== `undefined`) {
    const moveCursor = (e) => {
      setId(document.body.getAttribute("data-figma-id"));
      setUseIframe(document.body.getAttribute("data-iframe"));

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
    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
    // }
  }, [cursorX, cursorY, cursorRotateX, cursorRotateY]);

  const springConfig = { damping: 20, stiffness: 100 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const file = `https://www.figma.com/embed?embed_host=astra&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FrY8kva5mMuZ76jr1In7a3g%2FMotion%3Fnode-id%3D1%${id}%26viewport%3D768%252C638%252C0.5647107362747192%26scaling%3Dcontain%26hotspot-hints%3D0%26hide-ui%3D1`;

  return (
    <HoverBuddyWrapper>
      {mounted && (
        <>
          <Image
            className="hover-image"
            style={{
              translateX: cursorXSpring,
              translateY: cursorYSpring,
              rotateX: cursorRotateX,
              rotateY: cursorRotateY,
            }}
            alt=""
          ></Image>
          {useIframe && (
            <Frame
              src={file}
              className={`hover-iframe`}
              style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
                rotateX: cursorRotateX,
                rotateY: cursorRotateY,
              }}
              data-loaded={loaded}
              onLoad={() => handleLoading()}
            />
          )}
        </>
      )}
    </HoverBuddyWrapper>
  );
}

const Frame = styled(motion.iframe)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 60vw;
  height: 40vw;
  z-index: 0;
  visibility: hidden;
  opacity: 0;
  transform-origin: center center;
  transition: opacity ${(props) => props.theme.animation.duration[300].css}
    ${(props) => props.theme.animation.timingFunction.css};
  will-change: transform, opacity;
  background-size: cover;
  backface-visibility: hidden;

  &[data-loaded="false"] {
    visibility: hidden !important;
    opacity: 0 !important;
  }
`;

const Image = styled(motion.div)`
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
  backface-visibility: hidden;

  &[data-iframe="true"] {
    visibility: hidden !important;
    opacity: 0 !important;
  }
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
  overflow: hidden;
  backface-visibility: hidden;
  padding: 1px;
  background-clip: content-box;
`;
