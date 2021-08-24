import React, { useEffect } from "react";
import { graphql } from "gatsby";

import PageHeader from "../components/page-header";

import ScrollSection from "../components/scroll-section";
import { scrollChangeBodyClass } from "../functions/util";

/**
 * page-template Component
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.data.mdx
 * @param {Object} props.data.mdx.frontmatter
 * @param {Object} props.data.mdx.body
 */
export default function Template({
  data: {
    mdx: { frontmatter },
  },
}) {
  useEffect(() => {
    scrollChangeBodyClass("red", "black");
  }, []);

  return (
    <>
      <PageHeader title={frontmatter.title} />
      <ScrollSection id={"01"} foreground="red" background="black">
        <h1>01</h1>
      </ScrollSection>
      <ScrollSection id={"02"} foreground="black" background="white">
        <h1>02</h1>
      </ScrollSection>
      <ScrollSection id={"03"} foreground="white" background="black">
        <h1>03</h1>
      </ScrollSection>
    </>
  );
}

/**
 * pageQuery
 */
export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        slug
        title
      }
    }
  }
`;
