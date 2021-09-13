import React from "react";
import styled from "styled-components";

/**
 * Local Components
 */
import Tick from "../components/tick";

/**
 * Local Styles/JS
 */
import { stringToSlug } from "../functions/util";
import { Wrapper } from "../components/style/global-styles";
import ScrollSection from "./scroll-section";
import VideoCover from "./inline-video";

/**
 *
 * @param {Object} props
 * @param {String} props.item
 * @param {String} props.slug
 * @param {String} props.background
 * @param {String} props.foreground
 */
function TickerText({ item, slug, background, foreground }) {
  return (
    <H2Center className="display" data-name={slug}>
      <span className="text">{item.title}</span>
      <span className="slash">{" / "}</span>
    </H2Center>
  );
}

/**
 *
 * @param {Object} props
 * @param {Object} props.data mdxRemark data
 * @param {String} props.background
 * @param {String} props.foreground
 */
export default function SectionHomeHero({
  data,
  background,
  foreground,
  ...rest
}) {
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <HomeSection
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 1 }}
      background={background}
      foreground={foreground}
      {...rest}
    >
      <Wrapper>
        <H2Left className="display">
          John Choura is <span className="indefinite-article-a">a</span>
          <span className="indefinite-article-an">an</span>{" "}
        </H2Left>
        <TickWrapper tickerSpeed={3}>
          {() =>
            data.section_hero.map((item, i) => {
              const slug = stringToSlug(item.title);
              return (
                <TickerText
                  key={i}
                  slug={slug}
                  item={item}
                  background={background}
                  foreground={foreground}
                />
              );
            })
          }
        </TickWrapper>
        <H2Right className="display">in Long Beach, CA.</H2Right>
      </Wrapper>
      <VideoBackground
        className="video-bkg"
        source={[
          {
            src:
              "https://john-prismic-gatsby-starter.cdn.prismic.io/john-prismic-gatsby-starter/3d1ff6bf-b12d-4d75-87e5-675f74a0ea12_John_Headshot_Loop%281%29%282%29.mp4",
            type: "video/mp4",
          },
        ]}
        videoOptions={{
          autoPlay: true,
          playsInline: true,
          preload: "auto",
          muted: true,
          loop: true,
        }}
        remeasureOnWindowResize
      />
    </HomeSection>
  );
}

const VideoBackground = styled(VideoCover)`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vh;
  height: 100%;
  z-index: -1;
  transform: scale(1.2) translateY(0%);
`;

const H2Left = styled.h2`
  text-align: left;
  padding-top: 5vw;
`;

const H2Right = styled.h2`
  text-align: right;
`;

const TickWrapper = styled(Tick)`
  transition: transform ${(props) => props.theme.animation.duration[300].css},
    opacity ${(props) => props.theme.animation.duration[200].css};
  will-change: transform;
  min-height: 2rem;
`;

const H2Center = styled.h2`
  position: relative;
  text-align: center;
  white-space: pre;
  height: 1em;

  &:hover {
    font-feature-settings: "ss02" on, "ss05" on, "salt" on, "ss01" on !important;

    span.text {
      opacity: 1 !important;
      transform: scale3d(2, 2, 2) !important;
    }
  }

  span {
    transition: opacity ${(props) => props.theme.animation.duration[100].css};
    will-change: opacity, transform;
    position: relative;
  }
`;

const HomeSection = styled(ScrollSection)`
  min-height: calc(30rem);
  height: calc(100vw);
  display: flex;
  align-items: center;
  position: relative;
  padding-top: 4rem;
  overflow: hidden;
  background: black;
  color: white;

  @media ${(props) => props.theme.device.tablet} {
    min-height: calc(60rem);
    height: calc(85vh);
    padding-top: 0;
  }
`;
