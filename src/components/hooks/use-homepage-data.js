import { useStaticQuery, graphql } from 'gatsby';

export const useHomepageData = () => {
  const {
    allMdx: { edges }
  } = useStaticQuery(
    graphql`
      query homePageData {
        allMdx(
          filter: {
            frontmatter: { title: { eq: "Home" }, type: { eq: "topLevelPage" } }
          }
        ) {
          edges {
            node {
              frontmatter {
                section_hero {
                  title
                  foreground
                  background
                }
                section_resume {
                  title
                  foreground
                  background
                  image
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
