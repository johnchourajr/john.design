import React, { useState } from 'react';
import styled from 'styled-components';

import { Wrapper } from '../components/style/global-styles';
import Tick from '../components/tick';
import { stringToSlug, changeBodyClass } from '../functions/util';

/**
 *
 * @param {String} props.item
 * @param {String} props.slug
 */
function TickerText({ item, slug }) {
  return (
    <H2Center
      className="display"
      data-name={slug}
      onMouseEnter={() => changeBodyClass('enter', slug)}
      onMouseLeave={() => changeBodyClass('exit', slug)}
    >
      <span className="text">{item}</span>
      <span className="slash">{' / '}</span>
    </H2Center>
  );
}

/**
 *
 * @param {Object} data mdxRemark data
 */
export default function SectionHomeHero({ data, ...rest }) {
  const [tickerSpeed, setTickerSpeed] = useState(15);
  const sectionHeroLength = data.section_hero.length - 1;

  return (
    <HomeSection triggerPoint={2} yOffset={400} {...rest}>
      <Wrapper>
        <H2Left className="display">{data.section_hero[0]} </H2Left>
        <TickWrapper
          onMouseEnter={() => setTickerSpeed(5)}
          onMouseLeave={() => setTickerSpeed(15)}
          tickerSpeed={tickerSpeed}
        >
          {() =>
            data.section_hero.map((item, i) => {
              const slug = stringToSlug(item);
              if (i === 0 || i === sectionHeroLength) {
                return null;
              } else {
                return <TickerText key={i} slug={slug} item={item} />;
              }
            })
          }
        </TickWrapper>

        <H2Right className="display">
          {data.section_hero[sectionHeroLength]}
        </H2Right>
      </Wrapper>
    </HomeSection>
  );
}

const H2Left = styled.h2`
  text-align: left;
  padding-top: 10vw;
`;

const H2Right = styled.h2`
  text-align: right;
`;

const TickWrapper = styled(Tick)`
  transition: transform ${(props) => props.theme.animation.duration[300].css},
    opacity ${(props) => props.theme.animation.duration[200].css};
  will-change: transform;

  &:hover {
    transform: scale3d(0.95, 0.95, 0.95);

    h2 span {
      opacity: 0.2;
    }
  }
`;

const H2Center = styled.h2`
  text-align: center;
  white-space: pre;

  &:hover {
    font-feature-settings: 'ss02' on, 'ss05' on, 'salt' on, 'ss01' on !important;

    span.text {
      opacity: 1 !important;
      transform: scale(2) !important;
    }
  }

  span {
    transition: opacity ${(props) => props.theme.animation.duration[100].css};
    will-change: opacity, transform;
  }
`;

const HomeSection = styled.section`
  min-height: calc(60rem);
  height: calc(95vh - 8rem);
  display: flex;
  align-items: center;
`;
