import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Wrapper } from '../components/style/global-styles';
import Tick from '../components/tick';
import {
  stringToSlug,
  changeBodyClass,
  changeFigmaDataState
} from '../functions/util';

/**
 *
 * @param {Object} props
 * @param {String} props.item
 * @param {String} props.slug
 */
function TickerText({ item, slug }) {
  return (
    <H2Center
      className="display"
      data-name={slug}
      onMouseEnter={() =>
        changeBodyClass('enter', slug, item.foreground, item.background)
      }
      onMouseLeave={() =>
        changeBodyClass('exit', slug, item.foreground, item.background)
      }
    >
      <span className="text">{item.title}</span>
      <span className="slash">{' / '}</span>
    </H2Center>
  );
}

/**
 *
 * @param {Object} props
 * @param {Object} props.data mdxRemark data
 */
export default function SectionHomeHero({ data, ...rest }) {
  const [tickerSpeed, setTickerSpeed] = useState(15);
  const figmaId = '253A9';

  return (
    <HomeSection
      onMouseEnter={() => changeFigmaDataState('enter', figmaId)}
      onMouseLeave={() => changeFigmaDataState('exit', figmaId)}
      {...rest}
    >
      <Wrapper>
        <H2Left className="display">
          John Choura is <span className="indefinite-article-a">a</span>
          <span className="indefinite-article-an">an</span>{' '}
        </H2Left>
        <TickWrapper
          onMouseEnter={() => setTickerSpeed(5)}
          onMouseLeave={() => setTickerSpeed(15)}
          tickerSpeed={tickerSpeed}
        >
          {() =>
            data.section_hero.map((item, i) => {
              const slug = stringToSlug(item.title);
              return <TickerText key={i} slug={slug} item={item} />;
            })
          }
        </TickWrapper>
        <H2Right className="display">in Long Beach, Calif.</H2Right>
      </Wrapper>
      <Attr>
        <p>
          Background created in{' '}
          <a
            href="https://www.figma.com/file/rY8kva5mMuZ76jr1In7a3g/?node-id=0%3A1"
            target="_blank"
            rel="noreferrer"
          >
            Figma
          </a>
        </p>
      </Attr>
    </HomeSection>
  );
}

const Attr = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;

  p {
    margin: 0;
    opacity: 0.3;
  }
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

  &:hover {
    transform: scale3d(0.95, 0.95, 0.95);

    h2 span {
      opacity: 0.2;
    }
  }
`;

const H2Center = styled.h2`
  position: relative;
  text-align: center;
  white-space: pre;
  height: 1em;

  &:hover {
    font-feature-settings: 'ss02' on, 'ss05' on, 'salt' on, 'ss01' on !important;

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

const HomeSection = styled(motion.section)`
  min-height: calc(30rem);
  height: calc(100vw);
  display: flex;
  align-items: center;
  position: relative;

  @media ${(props) => props.theme.device.tablet} {
    min-height: calc(60rem);
    height: calc(85vh);
  }
`;
