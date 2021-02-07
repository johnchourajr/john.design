import * as React from 'react';
import styled from 'styled-components';
import MotionScroll from './motion-scroll';
import { changeBodyClass, stringToSlug } from '../functions/util';
import { Link } from 'gatsby';
import JournalHomeFeature from './journal-home-feature';

export default function JournalIndexList({ items }) {
  return (
    <PostList>
      {items.map(({ node }, i) => {
        const slug = stringToSlug(node.frontmatter.title);

        if (i === 0) {
          return (
            <>
              <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={30}>
                <h4>Most Recent Post</h4>
              </MotionScroll>
              <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={50}>
                <JournalHomeFeature
                  slug={node.frontmatter.slug}
                  title={node.frontmatter.title}
                  date={node.frontmatter.date}
                  timeToRead={node.timeToRead}
                  excerpt={node.excerpt}
                  cover={node.frontmatter.cover}
                />
              </MotionScroll>
            </>
          );
        } else {
          return (
            <Post
              key={i}
              onMouseEnter={() =>
                changeBodyClass(
                  'enter',
                  slug,
                  node.frontmatter.foreground,
                  node.frontmatter.background,
                  node.frontmatter.thumb
                )
              }
              onMouseLeave={() =>
                changeBodyClass(
                  'exit',
                  slug,
                  node.frontmatter.foreground,
                  node.frontmatter.background,
                  node.frontmatter.thumb
                )
              }
              fadeIn={true}
              triggerPoint={0.95}
              yOffset={50}
            >
              <Link to={node.frontmatter.slug}>
                <h1>{node.frontmatter.title} </h1>
              </Link>

              <aside>
                <h4>{node.frontmatter.date} </h4>
              </aside>
            </Post>
          );
        }
      })}
    </PostList>
  );
}

const PostList = styled.div`
  display: inline;
  flex-direction: column;

  &:hover {
    ${MotionScroll} h3, ${MotionScroll} h4 {
      opacity: 0.35 !important;
    }
  }
`;
const Post = styled(MotionScroll)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;

  h3,
  h4 {
    transition: opacity ${(props) => props.theme.animation.duration[100].css};
    will-change: opacity, transform;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:hover {
    h3,
    h4 {
      opacity: 1 !important;
      /* font-feature-settings: 'ss02' on, 'ss05' on, 'salt' on, 'ss01' on !important; */
    }
  }

  aside {
    text-align: right;
    padding-left: 1rem;
    min-width: 12rem;

    * {
      display: inline;
      margin: 0;
    }
  }
`;
