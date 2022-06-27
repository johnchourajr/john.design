import React from "react";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";
import JournalPost from "../../components/journal-post";
import { GoDaddyCover } from "../../components/godaddy-cover";

/**
 * journal-post-template Component
 */
export default function JournalPostTemplate(post) {
  const customCover = () => {
    if (post.slug === "godaddy") {
      return <GoDaddyCover />;
    } else {
      return null;
    }
  };

  return <JournalPost {...post} customCover={customCover()} />;
}

export function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);

  const content = post.content;

  return {
    props: {
      ...post,
      content,
    },
  };
}

export function getStaticPaths() {
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
