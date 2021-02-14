import * as React from 'react';
import styled from 'styled-components';
import MotionScroll from './motion-scroll';
import { Link } from 'gatsby';
import JournalHomeFeature from './journal-home-feature';

export default function JournalIndexList({ items }) {
  return (
    <>
      <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={30}>
        <h4>Most Recent Post</h4>
      </MotionScroll>
      {items.map(({ node }, i) => {
        if (i === 0) {
          return (
            <>
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
        } else return null;
      })}
      <MotionScroll fadeIn={true} triggerPoint={0.95} yOffset={30}>
        <h4>All Posts</h4>
      </MotionScroll>
      <PostList>
        {items.map(({ node }, i) => {
          const isChildImageSharp = node?.frontmatter?.thumb?.childImageSharp;
          const image = isChildImageSharp
            ? node?.frontmatter?.thumb?.childImageSharp?.fluid
            : node?.frontmatter?.thumb?.publicURL;

          if (i > 0) {
            return (
              <MotionScroll
                key={i}
                className={'post'}
                fadeIn={true}
                triggerPoint={0.95}
                yOffset={50}
              >
                <Link to={node.frontmatter.slug}>
                  <h1>{node.frontmatter.title} </h1>

                  {isChildImageSharp ? (
                    <Image
                      style={{
                        backgroundImage: `url(${image.src})`
                      }}
                    />
                  ) : (
                    <Image
                      style={{
                        backgroundImage: `url(${image})`
                      }}
                    />
                  )}
                  <aside>
                    <h4>{node.frontmatter.date} </h4>
                  </aside>
                </Link>
              </MotionScroll>
            );
          } else return null;
        })}
      </PostList>
    </>
  );
}

const Image = styled.div`
  position: absolute;
  right: 10vw;
  top: 50%;
  transform: scale3d(0.9, 0.9, 0.9) translateY(-50%);
  transform-origin: center center;
  height: 12vw;
  width: 18vw;
  opacity: 0;
  will-change: transform, opacity;
  background-size: cover;
  backface-visibility: hidden;
  z-index: -5;
`;

const PostList = styled.div`
  display: inline;
  flex-direction: column;

  &:hover {
    .post h1,
    .post aside {
      opacity: 0.35;
    }
  }

  .post {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    a {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 3rem 0;
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      height: 0.275rem;
      width: 100%;
      background-color: ${(props) => props.theme.colors.black};
      z-index: -10;
    }

    h1 {
      @media (max-width: ${(props) => props.theme.size.tablet}) {
        font-size: 1.5rem;
      }
    }

    h1,
    aside,
    ${Image} {
      transition: opacity ${(props) => props.theme.animation.duration[100].css},
        transform ${(props) => props.theme.animation.duration[300].css};
      will-change: opacity, transform;
    }

    &:last-child {
      padding-bottom: 0;
    }

    &:hover h1,
    &:hover aside {
      opacity: 1 !important;
    }

    &:hover ${Image} {
      opacity: 1 !important;
      transform: scale3d(1, 1, 1) translateY(-50%);
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
  }
`;
