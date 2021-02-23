import { useStaticQuery, graphql } from 'gatsby';

export const useJournalFeatureData = () => {
  const {
    allMdx: { edges }
  } = useStaticQuery(
    graphql`
      query journalFeature {
        allMdx(
          filter: { frontmatter: { template: { eq: "journal-post-template" } } }
          limit: 1
          sort: { fields: frontmatter___date, order: DESC }
        ) {
          edges {
            node {
              id
              frontmatter {
                slug
                date(formatString: "MMM DD, yyyy")
                title
                cover {
                  childImageSharp {
                    gatsbyImageData(
                      placeholder: DOMINANT_COLOR
                      layout: FULL_WIDTH
                      formats: PNG
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
        }
      }
    `
  );
  return edges[0];
};
