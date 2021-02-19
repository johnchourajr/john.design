import * as React from 'react';
import { graphql } from 'gatsby';

/**
 * Local Components
 */
import PageHeader from '../components/page-header';
import { Wrapper } from '../components/style/global-styles';
import JournalIndexList from '../components/journal-index-list';

/**
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.data.allMdx
 * @param {Object} props.data.allMdx.edges
 * @param {Object} props.data.mdx
 * @param {Object} props.data.mdx.frontmatter
 */
export default function Template({
  data: {
    allMdx: { edges },
    mdx: { frontmatter }
  }
}) {
  return (
    <>
      <PageHeader title={frontmatter.title} />
      <Wrapper className="pB">
        <JournalIndexList items={edges} />
      </Wrapper>
    </>
  );
}

/**
 * pageQuery
 */
export const pageQuery = graphql`
  query pageQuery($id: String!) {
    allMdx(
      filter: { frontmatter: { template: { eq: "journal-post-template" } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
            date(formatString: "MMM DD, yyyy")
            cover {
              childImageSharp {
                fluid(maxWidth: 2500) {
                  ...GatsbyImageSharpFluid
                }
              }
              publicURL
            }
            thumb {
              childImageSharp {
                fluid(maxWidth: 650, toFormat: WEBP) {
                  ...GatsbyImageSharpFluid
                }
              }
              publicURL
            }
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
