import React from "react";
import styled from "styled-components";
import Image from "next/image";

import { Wrapper } from "./style/global-styles";

const ImageWrapper = styled.div`
  border-radius: 100%;
  height: 25vw;
  max-height: 25rem;
  width: 25vw;
  max-width: 25rem;
  overflow: hidden;
  contain: fit-content;
  margin-bottom: 3rem;
  position: relative;

  > span,
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    pointer-events: none;

    h2 {
      line-height: 150%;

      &[data-quote="true"] {
        position: relative;

        &:after {
          content: "“";
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

function SectionHomeFamily({ family }) {
  return (
    <FooterUpperWrapper className="pV">
      <div className="image-area">
        <ImageWrapper>
          <Image src={family.img} fill alt="family-photo" />
        </ImageWrapper>
      </div>
      <div className="text-area">
        {family.about_me.map((item, i) => (
          <h2 key={i} data-quote={item.quote}>
            {item.text}
          </h2>
        ))}
      </div>
    </FooterUpperWrapper>
  );
}

export default SectionHomeFamily;
