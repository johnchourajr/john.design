import * as React from "react";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";

/**
 * Local Components
 */
import MotionScroll from "./motion-scroll";
import JournalHomeFeature from "./journal-home-feature";

/**
 * JournalIndexList Component
 *
 * @param {Object} props
 * @param {Object} props.items
 */
export default function JournalIndexList({ items }) {
  return (
    <>
      <MotionScroll fadeIn={true} triggerPoint={0.85} yOffset={30}>
        <h4>Most Recent Post</h4>
      </MotionScroll>
      {items.map(
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
      <MotionScroll fadeIn={true} triggerPoint={0.95} yOffset={30}>
        <h4>All Posts</h4>
      </MotionScroll>
      <PostList>
        {items.map(({ frontmatter: { slug, title, date, thumb } }, i) => {
          if (i > 0) {
            return (
              <MotionScroll
                key={i}
                className={"post"}
                fadeIn={true}
                triggerPoint={0.95}
                yOffset={50}
              >
                <Link href={slug}>
                  <a>
                    <h1>{title} </h1>

                    {thumb && (
                      <ImageWrap>
                        <Image src={thumb} layout="fill" alt="" />
                      </ImageWrap>
                    )}
                    <aside>
                      <h4>{date} </h4>
                    </aside>
                  </a>
                </Link>
              </MotionScroll>
            );
          } else return null;
        })}
      </PostList>
    </>
  );
}

const ImageWrap = styled.div`
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

  img,
  image {
    object-fit: cover;
  }
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
      content: "";
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
    ${ImageWrap} {
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

    &:hover ${ImageWrap} {
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
