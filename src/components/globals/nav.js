import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import Logo from '../svg/logo';
import styled from 'styled-components';

function NavLinkItem({
  data: {
    allMdx: { edges }
  }
}) {
  return (
    <>
      {edges.map(({ node: { frontmatter } }, i) => {
        return (
          <NavLink key={i} to={frontmatter.slug} className="h5">
            {frontmatter.slug === '/' ? '/' : `/${frontmatter.title}`}
          </NavLink>
        );
      })}
    </>
  );
}

function NavLinks() {
  return (
    <NavLinksWrapper>
      <StaticQuery
        query={graphql`
          query navQuery {
            allMdx(
              filter: { frontmatter: { type: { eq: "topLevelPage" } } }
              sort: { fields: frontmatter___weight, order: ASC }
            ) {
              edges {
                node {
                  id
                  frontmatter {
                    title
                    type
                    slug
                    weight
                  }
                }
              }
            }
          }
        `}
        render={(data) => <NavLinkItem data={data} />}
      />
    </NavLinksWrapper>
  );
}

function SkipWrapper() {
  return (
    <SkipToContent className="skip-to-content-link" to="#main">
      Skip to content
    </SkipToContent>
  );
}

export default function Nav() {
  return (
    <>
      <SkipWrapper />
      <NavWrapper>
        <NavLink to="/">
          <Logo />
        </NavLink>
        <NavLinks />
      </NavWrapper>
    </>
  );
}

const NavWrapper = styled.nav`
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

const NavLinksWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 75%;

  @media ${(props) => props.theme.device.tablet} {
    width: 50%;
  }

  a.h5 {
    margin: 0;
    color: ${(props) => props.theme.colors.black};
    pointer-events: visible;
  }
`;

const NavLink = styled(Link)`
  pointer-events: bounding-box;
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
