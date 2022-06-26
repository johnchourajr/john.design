import React from "react";
import Link from "next/link";
import styled from "styled-components";

/**
 * Local Components
 */
import HoverGradient from "../hover-gradient";

/**
 * Local styles
 */
import { Wrapper } from "../style/global-styles";

import pageContent from "../../../_data/index.json";

/**
 * Footer component
 *
 * @param {Object} props
 * @param {Object} props.pageContext
 */
export default function Footer({ pageContext }) {
  const ref = React.useRef();
  return (
    <FooterContainer id="footer" ref={ref}>
      <FooterLowerWrapper>
        <FooterRow className="pV">
          <h2>Thx</h2>
          <h2>John.Design™</h2>
        </FooterRow>
        <FooterRow className="links">
          <FooterLinks>
            {pageContent.pages.map(({ title, path, top_level_nav }, i) => {
              if (top_level_nav)
                return (
                  <Link key={i} href={path}>
                    <a className="p">{`/${title}`}</a>
                  </Link>
                );
            })}
            <Link key={"contact"} href={"/contact"}>
              <a className="p">/Contact</a>
            </Link>
            <Link key={"colophon"} href={"/colophon"}>
              <a className="p">/Colophon</a>
            </Link>
          </FooterLinks>

          <p className="caption legal">
            All work is copyright J. John Choura Jr. unless otherwise mentioned.
          </p>
        </FooterRow>
      </FooterLowerWrapper>
      <HoverGradient refContainer={ref} />
    </FooterContainer>
  );
}

const FooterLowerWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  border-top: solid 3px ${(props) => props.theme.colors.black};
`;

const FooterRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 2vw;

  &.pV {
    padding-top: 7vw;
    padding-bottom: 7vw;
  }

  &.links {
    flex-direction: column;

    @media ${(props) => props.theme.device.laptop} {
      flex-direction: row;
    }
  }
`;

const FooterLinks = styled.div`
  margin-bottom: 1rem;

  a {
    margin-right: 2vw;
  }
`;

const FooterContainer = styled.footer`
  position: relative;
  overflow: hidden;
`;
