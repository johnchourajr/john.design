import React, { useEffect } from "react";
import { graphql } from "gatsby";

/**
 * Local Components
 */
import SectionHomeHero from "../components/section-home-hero";
import SectionHomeJournal from "../components/section-home-journal";
import SectionJobs from "../components/section-home-jobs";
import SectionBrands from "../components/section-home-brands";
import HoverBuddy from "../components/hover-buddy";
import { scrollChangeBodyClass } from "../functions/util";

/**
 * index-page-template
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.data.allMdx
 * @param {Object} props.data.allMdx.edges
 */
export default function Template({
  data: {
    allMdx: { edges },
  },
}) {
  useEffect(() => {
    scrollChangeBodyClass("white", "black");
  }, []);

  const { frontmatter } = edges[0].node;

  return (
    <>
      <SectionHomeHero
        data={frontmatter}
        background={"black"}
        foreground={"white"}
      />
      <SectionJobs
        jobs={frontmatter.section_resume}
        background={"black"}
        foreground={"white"}
      />
      <SectionBrands
        brands={frontmatter.section_brands}
        background={"black"}
        foreground={"white"}
      />
      <SectionHomeJournal background={null} foreground={null} />
      <HoverBuddy />
    </>
  );
}

/**
 * indexQuery
 */
export const indexQuery = graphql`
  query indexQuery {
    allMdx(filter: { frontmatter: { title: { eq: "Home" } } }) {
      edges {
        node {
          id
          frontmatter {
            title
            section_brands {
              name
              url
            }
            section_hero {
              title
              figma_id
              foreground
              background
            }
            section_resume {
              date
              title
              role
              url
              foreground
              background
              image
            }
          }
        }
      }
    }
  }
`;
