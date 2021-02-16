import React from 'react';
import { graphql } from 'gatsby';

import { Wrapper } from '../components/style/global-styles';
import PageHeader from '../components/page-header';

/**
 * page-template Component
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.data.mdx
 * @param {Object} props.data.mdx.frontmatter
 * @param {Object} props.data.mdx.body
 */
export default function Template({
  data: {
    mdx: { frontmatter }
  }
}) {
  return (
    <>
      <PageHeader title={frontmatter.title} />
      <Wrapper></Wrapper>
    </>
  );
}

/**
 * pageQuery
 */
export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        slug
        title
      }
    }
  }
`;
