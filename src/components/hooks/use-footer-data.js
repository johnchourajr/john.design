import { useStaticQuery, graphql } from 'gatsby';

export const useFooterData = () => {
  const {
    allMdx: { edges }
  } = useStaticQuery(
    graphql`
      query footerData {
        allMdx(
          filter: {
            frontmatter: { title: { eq: "Home" } }
          }
        ) {
          edges {
            node {
              frontmatter {
                section_fam {
                  about_me {
                    text
                    quote
                  }
                  photos {
                    img {
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
                }
              }
            }
          }
        }
      }
    `
  );
  return edges[0].node.frontmatter;
};
