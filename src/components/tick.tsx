import React, { useState } from "react";
import Ticker from "./ticker";
import styled from "styled-components";
import PageVisibility from "react-page-visibility";

/**
 *
 * @param {Object} props
 * @param {Number} props.tickerSpeed
 * @param {String} props.direction
 * @param {any} props.offset
 * @param {any} props.children
 */
export default function Tick({
  tickerSpeed,
  direction,
  offset,
  children,
  ...rest
}) {
  const [pageIsVisible, setPageIsVisible] = useState(true);

  const handleVisibilityChange = (isVisible) => {
    setPageIsVisible(isVisible);
  };

  const speed = tickerSpeed ? tickerSpeed : 10;

  return (
    <TickerWrapper {...rest}>
      <PageVisibility onChange={handleVisibilityChange}>
        {pageIsVisible && (
          <Ticker
            move={true}
            direction={direction ? direction : "toLeft"}
            offset={offset}
            speed={speed}
          >
            {children}
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
