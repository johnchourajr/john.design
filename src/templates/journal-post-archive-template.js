import React from 'react';
import { graphql } from 'gatsby';
import JournalPost from '../components/journal-post';

/**
 * journal-post-template Component
 *
 * @param {Object} props
 * @param {Object} props.pageContext
 * @param {Object} props.data
 */
export default function JournalPostTemplate({ pageContext, data }) {
  return <JournalPost pageContext={pageContext} data={data} />;
}

/**
 * postQuery
 */
export const postQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        date(formatString: "MMM DD, yyyy")
        slug
        title
        cover {
          childImageSharp {
            gatsbyImageData(
              placeholder: DOMINANT_COLOR
              layout: FULL_WIDTH
              formats: WEBP
              blurredOptions: { toFormat: WEBP }
            )
          }
          publicURL
        }
      }
      timeToRead
      excerpt
    }
  }
`;
