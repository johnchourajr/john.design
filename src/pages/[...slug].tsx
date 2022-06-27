import React from "react";
import pageContent from "@data/index.json";

/**
 * Local Components
 */
import { Wrapper } from "../components/style/global-styles";
import PageHeader from "../components/page-header";
import ReactMarkdown from "react-markdown";
import { Headline } from "../components/type";

/**
 * TemplatePage Component
 */
export default function TemplatePage({ content }) {
  return (
    <>
      {content?.title && <PageHeader title={content.title} size="sm" />}

      <Wrapper className="pB content-styles">
        {content?.subhead && (
          <>
            <Headline size="h3" display={true}>
              <ReactMarkdown
                components={{
                  p: React.Fragment,
                }}
              >
                {content.subhead}
              </ReactMarkdown>
            </Headline>
            <br />
            <Headline size="h1">—</Headline>
            <br />
          </>
        )}
        {content?.body && <ReactMarkdown>{content.body}</ReactMarkdown>}
      </Wrapper>
    </>
  );
}

export async function getStaticPaths() {
  // filter pageContent to only include pages with a key of "default"
  const pages = pageContent.pages.filter(
    (page) => page?.template === "default"
  );

  const paths = pages.map((page) => {
    const path = page.path;
    const slug = path.split("/").slice(1);
    return { params: { slug, path } };
  });

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const currentPath = `/${params.slug.join("/")}`;
  const content = pageContent.pages.find(
    (page) => page.path === currentPath
  ) || {
    notfound: true,
  };
  return { props: { content } };
}
