import { useStaticQuery, graphql } from 'gatsby';

export const useJournalData = () => {
  const {
    allMdx: { edges }
  } = useStaticQuery(
    graphql`
      query journalData {
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
                cover {
                  childImageSharp {
                    fluid(maxWidth: 800, toFormat: WEBP) {
                      ...GatsbyImageSharpFluid
                    }
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
