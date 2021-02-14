import React from 'react';
import styled from 'styled-components';
import GatsbyImage from 'gatsby-image';
import { motion } from 'framer-motion';

/**
 *
 * @param {Object} props
 * @param {Object} props.photos
 */
export function FooterImageBlock({ photos }) {
  const constraintsRef = React.useRef(null);

  return (
    <ImageBlockWrap
      ref={constraintsRef}
      style={{ '--photo-total': photos.length }}
    >
      {photos.map((item, i) => (
        <ImageBlock
          key={i}
          style={{ '--index': i }}
          drag
          dragConstraints={constraintsRef}
        >
          <GatsbyImage fluid={item.img.childImageSharp.fluid} />
        </ImageBlock>
      ))}
    </ImageBlockWrap>
  );
}

const ImageBlock = styled(motion.div)`
  width: calc(75vw / var(--photo-total));
  position: absolute;
  left: calc(15% * var(--index));
  top: calc(5vw * var(--index));
  flex-shrink: 0;
  z-index: var(--index);

  &:hover {
    z-index: 9999;
    cursor: grab;

    .gatsby-image-wrapper {
      transform: scale3d(1.03, 1.03, 1.03);
    }
  }

  .gatsby-image-wrapper {
    transform: none;
    transition: transform ${(props) => props.theme.animation.duration[300].css};
    will-change: transform, opacity;
    pointer-events: none;
    border-radius: 0.25rem;
  }
`;
const ImageBlockWrap = styled(motion.div)`
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  min-height: 30vw;
  position: relative;
  margin-bottom: calc(4.5vw * var(--photo-total));
`;
