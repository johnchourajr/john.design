import React from "react";
import styled from "styled-components";

/**
 * Local Components
 */
import MotionScroll from "./motion-scroll";

/**
 * Local Styles/JS
 */
import { Wrapper } from "./style/global-styles";
import { commaSeparate } from "../functions/util";
import ScrollSection from "./scroll-section";

/**
 *
 * @param {Object} props
 * @param {Object} props.brands
 */
export default function SectionJobs({ brands, ...rest }) {
  return (
    <ScrollSection {...rest}>
      <Section id="brands" className="pV">
        <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={25}>
          <h4>Brands Worked With</h4>
          <br />
        </MotionScroll>
        <h1>
          {brands.map((item, i) => (
            <MotionScroll
              fadeIn={true}
              triggerPoint={0.85}
              yOffset={150}
              useSpan={true}
            >
              <Word href={item.url} target="_blank">
                {item.name}
              </Word>
              {commaSeparate(i + 1, brands)}
            </MotionScroll>
          ))}
        </h1>
      </Section>
    </ScrollSection>
  );
}

const Section = styled(Wrapper)`
  background-color: ${(props) => props.theme.colors.white};
  padding-top: 0 !important;
`;

const Word = styled.a`
  text-decoration: underline !important;
`;
