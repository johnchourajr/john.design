import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import useNavData from '../hooks/use-nav-data';
import { useFooterData } from '../hooks/use-footer-data';
import { Wrapper } from '../style/global-styles';
import GatsbyImage from 'gatsby-image';

/**
 * Footer Component
 */
export default function Footer() {
  const { edges } = useNavData();
  const {
    section_fam: { about_me, photos }
  } = useFooterData();

  return (
    <FooterContainer>
      <FooterUpperWrapper className="pV">
        <div className="image-area">
          <Image>
            <GatsbyImage fluid={photos[0].img.childImageSharp.fluid} />
          </Image>
        </div>
        <div className="text-area">
          {about_me.map((item, i) => (
            <h2 data-quote={item.quote}>{item.text}</h2>
          ))}
        </div>
      </FooterUpperWrapper>
      <FooterLowerWrapper>
        <FooterRow className="pV">
          <h2>Thx</h2>
          <h2>John.Design</h2>
        </FooterRow>
        <FooterRow className="links">
          <FooterLinks>
            {edges.map(({ node: { frontmatter } }, i) => {
              return (
                <Link key={i} to={frontmatter.slug} className="p">
                  {frontmatter.slug === '/' ? '/' : `/${frontmatter.title}`}
                </Link>
              );
            })}
            <Link key={'colophon'} to={'/colophon'} className="p">
              /Colophon
            </Link>
          </FooterLinks>

          <p className="legal">
            All work is copyright J. John Choura Jr. unless otherwise mentioned.
          </p>
        </FooterRow>
      </FooterLowerWrapper>
    </FooterContainer>
  );
}

const Image = styled.div`
  border-radius: 100%;
  height: 25vw;
  max-height: 25rem;
  width: 25vw;
  max-width: 25rem;
  overflow: hidden;
  contain: fit-content;
  margin-bottom: 3rem;

  .gatsby-image-wrapper {
    width: 100%;
    height: 100%;
  }
`;

const FooterUpperWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;

  @media ${(props) => props.theme.device.laptop} {
    flex-direction: row;
  }

  .text-area {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    h2 {
      line-height: 150%;

      &[data-quote='true'] {
        position: relative;

        &:after {
          content: '“';
          position: absolute;
          left: -0.5em;
          top: 0;
          font-size: 1em;
        }
      }
    }
  }

  .text-area,
  .image-area {
    @media ${(props) => props.theme.device.laptop} {
      width: 50%;
    }
  }
`;

const FooterLowerWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  border-top: solid 3px ${(props) => props.theme.colors.black};
`;

const FooterRow = styled.div`
  display: flex;
  flex-direction: row;
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
  a {
    margin-right: 2vw;
  }
`;

const FooterContainer = styled.footer`
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
  );
  margin-top: 7vw;
`;
