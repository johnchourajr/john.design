import React from "react";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";
import JournalPost from "../../components/journal-post";

/**
 * journal-post-template Component
 */
export default function JournalPostTemplate(post) {
  return <JournalPost {...post} />;
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const content = post.content;

  return {
    props: {
      ...post,
      content,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
