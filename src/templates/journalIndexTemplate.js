import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import PageHeader from '../components/page-header';
import { Wrapper } from '../components/style/global-styles';
import JournalIndexList from '../components/journal-index-list';
import HoverBuddy from '../components/hover-buddy';

export default function JournalIndexPage({
  data: {
    allMdx: { edges },
    mdx: { frontmatter }
  }
}) {
  return (
    <>
      <PageHeader title={frontmatter.title} />
      <Wrapper>
        <JournalIndexList items={edges} />
      </Wrapper>
      <HoverBuddy />
    </>
  );
}

export const pageQuery = graphql`
  query pageQuery($id: String!) {
    allMdx(
      filter: { frontmatter: { template: { eq: "journalPostTemplate" } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
            date(formatString: "MMM DD, yyyy")
            cover
            thumb
            foreground
            background
          }
          timeToRead
          excerpt
        }
      }
    }
    mdx(id: { eq: $id }) {
      frontmatter {
        date(formatString: "MMM DD, YYYY")
        slug
        title
      }
    }
  }
`;
