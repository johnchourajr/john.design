import { useStaticQuery, graphql } from 'gatsby';

export const useSiteMetadata = () => {
  const {
    site,
    allMdx: { edges }
  } = useStaticQuery(
    graphql`
      query siteMeta {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
        allMdx(
          filter: {
            frontmatter: { title: { eq: "Home" }, type: { eq: "topLevelPage" } }
          }
        ) {
          edges {
            node {
              frontmatter {
                og {
                  id
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
    `
  );

  const og = edges[0].node.frontmatter.og.childImageSharp.gatsbyImageData;

  return { meta: site.siteMetadata, og: og };
};

export default useSiteMetadata;
