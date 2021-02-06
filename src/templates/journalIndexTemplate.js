import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import PageHeader from '../components/page-header';
import { Wrapper } from '../components/style/global-styles';
import JournalIndexList from '../components/journal-index-list';

export default function JournalIndexPage({
  data: {
    allMdx: { edges },
    mdx: { frontmatter }
  }
}) {
  return (
    <Layout pageTitle={frontmatter.title}>
      <PageHeader title={frontmatter.title} />
      <Wrapper>
        <JournalIndexList items={edges} />
      </Wrapper>
      {/* <HoverBuddy size="sm" /> */}
    </Layout>
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
