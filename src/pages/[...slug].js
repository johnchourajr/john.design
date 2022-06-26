import React from "react";
import pageContent from "../../_data/index.json";

/**
 * Local Components
 */
import { Wrapper } from "../components/style/global-styles";
import PageHeader from "../components/page-header";

/**
 * mdx-template Component
 */
export default function Template() {
  return (
    <>
      {/* <PageHeader title={frontmatter.title} size="sm" /> */}
      <Wrapper className="pB content-styles">
        {/* <MDXRenderer>{body}</MDXRenderer> */}
      </Wrapper>
    </>
  );
}

export async function getStaticPaths() {
  const paths = pageContent.pages.map((page) => {
    const slug = page.path.split("/").slice(1);
    return { params: { slug } };
  });
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const currentPath = `/${params.slug.join("/")}`;
  const page = pageContent.pages.find((page) => page.path === currentPath) || {
    notfound: true,
  };
  return { props: { page } };
}

/**
 * mdxPageQuery
 */
// export const mdxPageQuery = graphql`
//   query ($id: String!) {
//     mdx(id: { eq: $id }) {
//       id
//       body
//       frontmatter {
//         date(formatString: "MMM DD, YYYY")
//         slug
//         title
//       }
//     }
//   }
// `;
