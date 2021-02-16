import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';

/**
 * Local Components
 */
import { Wrapper } from '../components/style/global-styles';
import PageHeader from '../components/page-header';

/**
 * mdx-template Component
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.data.mdx
 * @param {Object} props.data.mdx.frontmatter
 * @param {Object} props.data.mdx.body
 */
export default function Template({
  data: {
    mdx: { frontmatter, body }
  }
}) {
  return (
    <>
      <PageHeader title={frontmatter.title} size="sm" />
      <Wrapper className="pB content-styles">
        <MDXRenderer>{body}</MDXRenderer>
      </Wrapper>
    </>
  );
}

/**
 * mdxPageQuery
 */
export const mdxPageQuery = graphql`
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
