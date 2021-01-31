import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Layout from '../components/layout';
import { Wrapper } from '../components/style/global-styles';
import MotionScroll from '../components/motion-scroll';

export default function Template({ pageContext, data }) {
  const { mdx } = data;
  const { frontmatter, body, timeToRead } = mdx;
  const { next, previous } = pageContext;
  const hasNext = next?.frontmatter.template.includes('journal');
  const hasPrev = previous?.frontmatter.template.includes('journal');

  return (
    <Layout pageTitle={frontmatter.title}>
      <PostWrapper className="blog-post">
        <Wrapper>
          <PostHeader>
            <h2 className="display">{frontmatter.title}</h2>
          </PostHeader>

          {frontmatter.cover && (
            <PostImage
              style={{ backgroundImage: `url(${frontmatter.cover})` }}
            ></PostImage>
          )}
          <MotionScroll fadeIn triggerPoint={1} yOffset={100}>
            <PostCredit>
              <h4>
                by John Choura / {frontmatter.date} / {timeToRead} Minute Read
              </h4>
            </PostCredit>
          </MotionScroll>
          <MotionScroll fadeIn triggerPoint={1} yOffset={200}>
            <ContentWrapper>
              <MDXRenderer>{body}</MDXRenderer>
            </ContentWrapper>
          </MotionScroll>
        </Wrapper>
        <PostSegue>
          {hasPrev ? (
            <SegueItem className="previous">
              <h6 className="no-underline">Newer</h6>
              <Link to={previous.frontmatter.slug}>
                <h3>{previous.frontmatter.title}</h3>
              </Link>
            </SegueItem>
          ) : (
            <SegueItem className="previous none">
              <h6 className="no-underline">Nothing Newer</h6>
            </SegueItem>
          )}
          {hasNext ? (
            <SegueItem className="next">
              <h6 className="no-underline">Older</h6>
              <Link to={next.frontmatter.slug}>
                <h3>{next.frontmatter.title}</h3>
              </Link>
            </SegueItem>
          ) : (
            <SegueItem className="next none">
              <h6 className="no-underline">Nothing Older</h6>
            </SegueItem>
          )}
        </PostSegue>
      </PostWrapper>
    </Layout>
  );
}

const PostWrapper = styled.section`
  position: relative;
  margin-bottom: 7vw;
`;

const PostHeader = styled.div`
  margin: 20vw 0 10vw;
`;

const PostImage = styled.figure`
  width: 101vw;
  min-height: 300px;
  height: 45vw;
  transform: translateX(-7.5vw);
  background-size: cover;
  background-position: center center;
  margin: 3.5vw 0;
`;

const PostCredit = styled.div`
  margin: 3.5vw 0;
`;

const PostSegue = styled(Wrapper)`
  display: flex;
  padding-top: 10.5vw;
  padding-bottom: 10.5vw;
  background-color: ${(props) => props.theme.colors.black};

  * {
    color: ${(props) => props.theme.colors.white};
  }
`;

const SegueItem = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  width: 50%;

  h3 {
    @media ${(props) => props.theme.device.tablet} {
      max-width: 8em;
    }
  }

  &.none h6 {
    opacity: 0.5;
  }

  &.next {
    text-align: right;
    align-items: flex-end;

    h3 {
      padding-left: 0.5rem;
    }

    @media ${(props) => props.theme.device.tablet} {
      h3 {
        padding-left: 3rem;
      }
    }
  }

  &.previous {
    text-align: left;
    align-items: flex-start;

    h3 {
      padding-right: 0.5rem;
    }

    @media ${(props) => props.theme.device.tablet} {
      h3 {
        padding-right: 3rem;
      }
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
  width: 100%;
  margin: 0 auto 7vw;

  @media ${(props) => props.theme.device.laptop} {
    width: 42rem;
    h1,
    h2,
    h3 {
      max-width: 85%;
    }
  }

  img,
  p img {
    max-width: 100%;
    width: 100%;
  }

  p {
    font-size: 1.25rem;
    letter-spacing: 0.01em;
  }

  a {
    color: ${(props) => props.theme.colors.gray2};
    transition: color ${(props) => props.theme.animation.duration[100].css}
      ${(props) => props.theme.animation.timingFunction.css};
    opacity: 1;

    &:hover {
      color: ${(props) => props.theme.colors.black};
    }
  }
`;

export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        date(formatString: "MMM DD, yyyy")
        slug
        title
        cover
      }
      timeToRead
      excerpt
    }
  }
`;
