import React from "react";
import { graphql } from "gatsby";
import JournalPost from "../components/journal-post";
import { PayPalCover } from "../components/paypal-cover";

/**
 * journal-post-template Component
 *
 * @param {Object} props
 * @param {Object} props.pageContext
 * @param {Object} props.data
 */
export default function JournalPostTemplate({ pageContext, data }) {
  return (
    <JournalPost
      pageContext={pageContext}
      data={data}
      customCover={<PayPalCover />}
    />
  );
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
            fluid(maxWidth: 2500) {
              ...GatsbyImageSharpFluid
            }
          }
          publicURL
        }
      }
      timeToRead
      excerpt
    }
  }
`;
