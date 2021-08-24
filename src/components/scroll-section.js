import React, { useEffect } from "react";
import { Wrapper } from "./style/global-styles";
import { scrollChangeBodyClass } from "../functions/util";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import { m, LazyMotion, domAnimation } from "framer-motion";

export function ScrollSection({
  id,
  foreground,
  background,
  children,
  ...rest
}) {
  const { ref, inView, entry } = useInView({
    triggerOnce: false,
    rootMargin: "0% 0px 0%",
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      // console.log(id, "visible");
      scrollChangeBodyClass(foreground, background);
    }
  }, [entry, inView]);

  return (
    <LazyMotion features={domAnimation}>
      <m.section ref={ref} {...rest}>
        {children}
      </m.section>
    </LazyMotion>
  );
}

export default ScrollSection;
