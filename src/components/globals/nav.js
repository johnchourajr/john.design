import React, { useEffect } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { motion, useViewportScroll } from "framer-motion";

/**
 * Svg
 */
import Logo from "../svg/logo";

/**
 * Data hooks
 */
import useNavData from "../hooks/use-nav-data";

/**
 * NavLinkItem component
 *
 * @param {Object} props
 * @param {Object} props.data
 */
function NavLinkItem({ data }) {
  return (
    <>
      {data.map(({ node: { frontmatter } }, i) => {
        return (
          <NavLink key={i} to={frontmatter.slug} className="h5">
            {`/${frontmatter.title}`}
          </NavLink>
        );
      })}
    </>
  );
}

/**
 * SkipWrapper component
 *
 * @param {Object} props
 */
function SkipWrapper(props) {
  return (
    <>
      <SkipToContent className="skip-to-content-link" to="#main">
        Skip to content
      </SkipToContent>

      {props?.pageContext?.template === "journal-post-template" && (
        <SkipToContent className="skip-to-content-link" to="#post">
          Skip to post
        </SkipToContent>
      )}
    </>
  );
}

/**
 * Nav component
 *
 * @param {Object} props
 */
export default function Nav(props) {
  const { edges } = useNavData();
  const { scrollY } = useViewportScroll();
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
      <SkipWrapper {...props} />
      <NavWrapper
        initial="initial"
        animate="visible"
        variants={variants}
        transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
      >
        <NavLink to="/">
          <Logo />
        </NavLink>
        <NavLinksWrapper
          animate={hidden ? "hidden" : "visible"}
          variants={variants}
          onHoverStart={() => setHidden(false)}
          transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
        >
          <NavLinkItem data={edges} />
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

const NavLink = styled(Link)`
  pointer-events: visible;
`;

const SkipToContent = styled(Link)`
  color: ${(props) => props.theme.colors.white} !important;
  background: ${(props) => props.theme.colors.black};
  left: 0;
  padding: 1.5rem;
  position: absolute;
  transform: translateY(-100%);
  transition: transform ${(props) => props.theme.animation.duration[200].css}
    ${(props) => props.theme.animation.timingFunction.css};
  z-index: 9999;

  &:focus-visible {
    transform: translateY(0%);
  }
`;
