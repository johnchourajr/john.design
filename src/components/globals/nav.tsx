import React, { useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { motion, useViewportScroll } from "framer-motion";

import pageContent from "@data/index.json";

/**
 * Svg
 */
import Logo from "../svg/logo";

/**
 * NavLinkItem component
 */
const NavLinkItem = ({ data }) =>
  data &&
  data.map(({ title, path, top_level_nav }, i) => {
    if (top_level_nav)
      return (
        <Link key={i} href={path}>
          <NavLink className="h5">{`/${title}`}</NavLink>
        </Link>
      );
  });

/**
 * Nav component
 *
 * @param {Object} props
 */
export default function Nav() {
  const { scrollY } = useViewportScroll() as any;
  const [hidden, setHidden] = React.useState(false);

  function update() {
    if (scrollY?.current < scrollY?.prev) {
      setHidden(false);
    } else if (scrollY?.current > 100 && scrollY?.current > scrollY?.prev) {
      setHidden(true);
    }
  }

  useEffect(() => {
    return scrollY.onChange(() => update());
  });

  const variants = {
    visible: { opacity: 1, y: 0 },
    initial: { opacity: 0, y: -75 },
    hidden: { opacity: 0, y: -25 },
  };

  return (
    <>
      <NavWrapper
        initial="initial"
        animate="visible"
        variants={variants}
        transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
      >
        <Link href="/">
          <NavLink>
            <Logo />
          </NavLink>
        </Link>
        <NavLinksWrapper
          animate={hidden ? "hidden" : "visible"}
          variants={variants}
          onHoverStart={() => setHidden(false)}
          transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
        >
          <Link href="/">
            <NavLink className="h5">{`/Home`}</NavLink>
          </Link>
          <NavLinkItem data={pageContent.pages} />
        </NavLinksWrapper>
      </NavWrapper>
    </>
  );
}

const NavWrapper = styled(motion.nav)`
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  height: 6rem;
  margin: 0 1rem;
  width: calc(100vw - 2rem);
  left: 0;
  pointer-events: none;
  z-index: 10;

  @media ${(props) => props.theme.device.tablet} {
    margin: 0 7vw;
    width: 86vw;
    height: 8rem;
  }
`;

const NavLinksWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  /* width: 75%; */

  @media ${(props) => props.theme.device.tablet} {
    gap: 10vw;
    /* width: 50%; */
  }

  a.h5 {
    margin: 0;
    color: ${(props) => props.theme.colors.black};
  }
`;

const NavLink = styled.span`
  pointer-events: visible;
  cursor: pointer;
`;
