import { useStaticQuery, graphql } from 'gatsby';

export const useJournalData = () => {
  const {
    allMdx: { edges }
  } = useStaticQuery(
    graphql`
      query journalData {
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
                    gatsbyImageData(
                      placeholder: DOMINANT_COLOR
                      layout: FULL_WIDTH
                      formats: WEBP
                      blurredOptions: { toFormat: WEBP }
                    )
                  }
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
  return edges;
};
