import React from "react";
// import { graphql } from "gatsby";
import JournalPost from "../../components/journal-post";
import { GoDaddyCover } from "../../components/godaddy-cover";

import pageContent from "../../../_data/index.json";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";

/**
 * journal-post-template Component
 */
export default function JournalPostTemplate(post) {
  return <JournalPost {...post} customCover={<GoDaddyCover />} />;
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug("/godaddy");
  const content = post.content;

  return {
    props: {
      ...post,
      content,
    },
  };
}
