import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useViewportScroll } from 'framer-motion';
import { changeBodyClass } from '../functions/util';

import GoDaddyLogoMotion from './svg/motion.godaddy';

export function GoDaddyCover() {
  const { scrollY } = useViewportScroll();
  const [state, setState] = useState('active');

  function update(dir) {
    if (dir === 'down') {
      if (scrollY?.current < 100) {
        setState('post');
        changeBodyClass('enter', '', '#1bdbdb', '#111111', '');
      } else if (scrollY?.current >= 100) {
        setState('active');
        changeBodyClass('exit', '', '#1bdbdb', '#111111', '');
      }
    } else {
      if (scrollY?.current < 100) {
        setState('active');
        changeBodyClass('exit', '', '#1bdbdb', '#111111', '');
      } else if (scrollY?.current >= 100) {
        setState('post');
        changeBodyClass('enter', '', '#1bdbdb', '#111111', '');
      }
    }
  }

  useEffect(() => {
    return scrollY.onChange(() => update());
  });

  return (
    <CoverContainer data-state={state}>
      <GoDaddyLogoMotion
        animate={state}
        onPointerDown={() => update('down')}
        onPointerUp={() => update()}
      />
    </CoverContainer>
  );
}

const CoverContainer = styled.div`
  --svg-height: calc((85vw - (0.5rem)) * 0.35);

  height: 30vw;
  min-height: 50px;

  &[data-state='post'] path[data-color='black'] {
    fill: white !important;
  }
`;
