import * as React from "react";

/**
 * Local Components
 */
import PageHeader from "@components/page-header";
import { Wrapper } from "@components/style/global-styles";
import JournalIndexList from "@components/journal-index-list";

/**
 * Data
 */
import { getAllPosts } from "@lib/posts";
import pageContent from "@data/index.json";

/**
 * JournalPage Template
 */
export default function JournalPage({ content, posts }) {
  return (
    <>
      <PageHeader title={content.title} />
      <Wrapper className="pB">
        <JournalIndexList items={posts} />
      </Wrapper>
    </>
  );
}

export function getStaticProps() {
  const posts = getAllPosts();

  const content = pageContent.pages.find(
    (page) => page.path === "/journal"
  ) || {
    notfound: true,
  };
  return { props: { content, posts } };
}
