import React from "react";
import pageContent from "@data/index.json";

/**
 * Local Components
 */
import { Wrapper } from "../components/style/global-styles";
import SectionHomeHero from "../components/section-home-hero";
import SectionHomeJournal from "../components/section-home-journal";
import SectionJobs from "../components/section-home-jobs";
import SectionBrands from "../components/section-home-brands";
import HoverBuddy from "../components/hover-buddy";
import SEO from "../components/globals/seo";
import SectionHomeFamily from "../components/section-home-family";
import { getAllPosts } from "../../lib/posts";

/**
 * index-page-template
 *
 * @param {Object} props
 */
export default function Template({ content, posts }) {
  return (
    <>
      <SEO>
        <title>{content.title}</title>
      </SEO>
      <SectionHomeHero data={content} />
      <SectionJobs jobs={content.section_resume} />
      <SectionBrands brands={content.section_brands} />
      <Wrapper>
        <section>
          {content.section_art.headline}
          {content.section_art.img}
        </section>
      </Wrapper>
      <SectionHomeJournal posts={posts} />
      <SectionHomeFamily family={content.section_fam} />
      <HoverBuddy />
    </>
  );
}

export async function getStaticProps({ params }) {
  const posts = getAllPosts();

  const content = pageContent.index;
  return { props: { content, posts } };
}
