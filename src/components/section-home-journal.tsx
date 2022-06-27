import React from "react";
import Link from "next/link";
import styled from "styled-components";

/**
 * Local Components
 */
import Tick from "./tick";
import JournalHomeFeature from "./journal-home-feature";
import MotionScroll from "./motion-scroll";

/**
 * Local Styles/JS
 */
import { Wrapper } from "./style/global-styles";
import { repeatTitle } from "../functions/util";

/**
 * Data Hooks
 */
// import { useJournalFeatureData } from "./hooks/use-journal-feature-data";

/**
 * SectionHomeJournal Component
 */
export default function SectionHomeJournal({ posts }) {
  const title = repeatTitle(`journal`);

  return (
    <Wrapper className="pV">
      <MotionScroll id="journal" fadeIn={true} triggerPoint={0.85} yOffset={50}>
        <PageHeaderWrapper>
          <Tick tickerSpeed={2} offset={""} direction="right">
            {() => (
              <span>
                <h1 className="display funky">{title}</h1>
              </span>
            )}
          </Tick>
        </PageHeaderWrapper>
      </MotionScroll>
      <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={30}>
        <h4>Most Recent Post</h4>
      </MotionScroll>
      <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={50}>
        {posts.map(
          (
            { timeToRead, exerpt, frontmatter: { slug, title, date, cover } },
            i
          ) => {
            if (i === 0) {
              return (
                <MotionScroll
                  key={i}
                  fadeIn={true}
                  triggerPoint={0.85}
                  yOffset={50}
                >
                  <JournalHomeFeature
                    slug={slug}
                    title={title}
                    date={date}
                    cover={cover}
                    timeToRead={timeToRead}
                    exerpt={exerpt}
                  />
                </MotionScroll>
              );
            } else return null;
          }
        )}
      </MotionScroll>

      <LowerLink>
        <Link href="/journal">
          <a>
            <h4>View All →</h4>
          </a>
        </Link>
      </LowerLink>
    </Wrapper>
  );
}

const PageHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: visible;
  padding: 0 0 4rem;

  .ticker {
    position: relative;
    z-index: -1;
    pointer-events: none;
    user-select: none;
  }

  h1 {
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: black;
    color: transparent;
  }
`;

const LowerLink = styled.div`
  display: flex;
`;
