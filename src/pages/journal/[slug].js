import React from "react";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";
import markdownToHtml from "../../../lib/markdownToHtml";
// import { graphql } from "gatsby";
import JournalPost from "../../components/journal-post";

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

/**
 * journal-post-template Component
 *
 * @param {Object} props
 * @param {Object} props.pageContext
 * @param {Object} props.data
 */
export default function JournalPostTemplate(post) {
  console.log(post);
  return <JournalPost {...post} />;
}

// /**
//  * postQuery
//  */
// export const postQuery = graphql`
//   query ($id: String!) {
//     mdx(id: { eq: $id }) {
//       id
//       body
//       frontmatter {
//         date(formatString: "MMM DD, yyyy")
//         slug
//         title
//         cover {
//           childImageSharp {
//             fluid(maxWidth: 2500) {
//               ...GatsbyImageSharpFluid
//             }
//           }
//           publicURL
//         }
//       }
//       timeToRead
//       excerpt
//     }
//   }
// `;
