import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { Wrapper } from '../components/style/global-styles';
import PageHeader from '../components/page-header';

export default function Template({ data }) {
  const { mdx } = data;
  const { frontmatter, body } = mdx;
  return (
    <>
      <PageHeader title={frontmatter.title} size="sm" />
      <Wrapper className="pB">
        <MDXRenderer>{body}</MDXRenderer>
      </Wrapper>
    </>
  );
}

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
