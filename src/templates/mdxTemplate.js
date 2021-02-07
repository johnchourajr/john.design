import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { Wrapper } from '../components/style/global-styles';

export default function Template({ data }) {
  const { mdx } = data;
  const { frontmatter, body } = mdx;
  return (
    <>
      <Wrapper className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <ContentWrapper>
          <MDXRenderer>{body}</MDXRenderer>
        </ContentWrapper>
      </Wrapper>
    </>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  img {
    max-width: 100%;
  }
`;

export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        date(formatString: "MMM DD, YYYY")
        slug
        title
      }
    }
  }
`;
