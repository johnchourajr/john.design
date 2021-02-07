import React from 'react';
import styled from 'styled-components';

import { Wrapper } from '../components/style/global-styles';
import Tick from '../components/tick';
import { repeatTitle } from '../functions/util';

// const rotations = ["-6.69deg", "-12.78deg", "-33.78deg", "17.51deg"];

export default function PageHeader(props) {
  // const [rotation, setRotation] = React.useState(rotations[0]);

  // React.useEffect(() => {
  // 	const random = Math.floor(Math.random() * rotations.length);
  // 	setRotation(rotations[random]);
  // }, []);

  const title = repeatTitle(`${props.title}`);

  return (
    <Wrapper>
      <PageHeaderWrapper>
        <Tick tickerSpeed={2} offset={''}>
          {() => (
            <span>
              <h1 className="display">{title}</h1>
            </span>
          )}
        </Tick>
      </PageHeaderWrapper>
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
