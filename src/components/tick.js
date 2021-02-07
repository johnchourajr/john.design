import React, { useState } from 'react';
import Ticker from 'react-ticker';
import styled from 'styled-components';
import PageVisibility from 'react-page-visibility';

export default function Tick(props) {
  const [pageIsVisible, setPageIsVisible] = useState(true);

  const handleVisibilityChange = (isVisible) => {
    setPageIsVisible(isVisible);
  };

  const speed = props.tickerSpeed ? props.tickerSpeed : 10;

  return (
    <TickerWrapper {...props}>
      <PageVisibility onChange={handleVisibilityChange}>
        {pageIsVisible && (
          <Ticker
            move={true}
            direction={props.direction ? props.direction : 'toLeft'}
            offset={props.offset}
            speed={speed}
          >
            {props.children}
          </Ticker>
        )}
      </PageVisibility>
    </TickerWrapper>
  );
}

const TickerWrapper = styled.div`
  .ticker {
    width: 107vw;
    transform: translate3d(-7vw, 0, 0);
    overflow: visible !important;
    display: inline-flex;
    user-select: none;
  }

  .ticker__element {
    display: inline-flex;
    flex-wrap: nowrap;
    width: fit-content;
    white-space: pre;
  }
`;
