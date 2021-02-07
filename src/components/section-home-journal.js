import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';

import { Wrapper } from './style/global-styles';
import { repeatTitle } from '../functions/util';
import Tick from './tick';
import JournalHomeFeature from './journal-home-feature';
import MotionScroll from './motion-scroll';

export default function SectionHomeJournal() {
  return (
    <StaticQuery
      query={graphql`
        query journalFeature {
          allMdx(
            filter: { frontmatter: { template: { eq: "journalPostTemplate" } } }
            limit: 1
            sort: { fields: frontmatter___date, order: DESC }
          ) {
            edges {
              node {
                id
                frontmatter {
                  slug
                  date(formatString: "MMM DD, yyyy")
                  title
                  cover
                }
                timeToRead
                excerpt
              }
            }
          }
        }
      `}
      render={({ allMdx: { edges } }, i) => {
        const { node } = edges[0];
        return (
          <JournalSectionContent
            key={i}
            content={node}
            slug={node.frontmatter.slug}
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            timeToRead={node.timeToRead}
            excerpt={node.excerpt}
            cover={node.frontmatter.cover}
          />
        );
      }}
    />
  );
}

function JournalSectionContent({
  content: { frontmatter, timeToRead, excerpt }
}) {
  const title = repeatTitle(`journal`);

  return (
    <Wrapper className="pV">
      <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={50}>
        <PageHeaderWrapper>
          <Tick tickerSpeed={2} offset={''}>
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
        <JournalHomeFeature
          slug={frontmatter.slug}
          title={frontmatter.title}
          date={frontmatter.date}
          timeToRead={timeToRead}
          excerpt={excerpt}
          cover={frontmatter.cover}
        />
      </MotionScroll>

      <LowerLink>
        <Link to="/journal">
          <h4>View All →</h4>
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
