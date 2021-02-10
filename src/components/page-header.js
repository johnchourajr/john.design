import React from 'react';
import styled from 'styled-components';

import { Wrapper } from '../components/style/global-styles';
import Tick from '../components/tick';
import { repeatTitle } from '../functions/util';
import MotionScroll from './motion-scroll';

/**
 *
 * @param {Object} props
 * @param {String} props.title
 */
export default function PageHeader({ title }) {
  return (
    <Wrapper>
      <MotionScroll triggerPoint={0} yOffset={50}>
        <PageHeaderWrapper>
          <Tick tickerSpeed={2}>
            {() => (
              <span>
                <h1 className="display">{repeatTitle(`${title}`)}</h1>
              </span>
            )}
          </Tick>
        </PageHeaderWrapper>
      </MotionScroll>
    </Wrapper>
  );
}

const PageHeaderWrapper = styled.div`
  height: 50vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  overflow: visible;

  .ticker {
    position: relative;
    z-index: -1;
    pointer-events: none;
    user-select: none;
  }

  h1 {
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: black;
    color: transparent !important;
  }
`;
