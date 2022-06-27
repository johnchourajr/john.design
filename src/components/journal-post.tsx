import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { Wrapper } from "./style/global-styles";
import MotionScroll from "./motion-scroll";
import dark from "../data/syntaxTheme";
import SEO from "@globals/seo";
import rehypeRaw from "rehype-raw";

const CodeBlock = ({ children, language, ...props }) => {
  return (
    <SyntaxHighlighter style={dark} language={language} {...props}>
      {children}
    </SyntaxHighlighter>
  );
};

function PostCover({ frontmatter, customCover }) {
  /**
   * Image Element
   */
  const imageSrc = frontmatter?.cover;

  if (customCover) {
    return customCover;
  } else if (frontmatter?.cover) {
    return (
      <PostImage>
        <Image
          src={imageSrc}
          alt={`${frontmatter?.title} Cover Art`}
          layout="fill"
        />
      </PostImage>
    );
  } else return null;
}

/**
 * JournalPost Component
 */
export default function JournalPost({
  content,
  exerpt,
  frontmatter,
  customCover,
  timeToRead,
}) {
  return (
    <>
      <SEO
        title={frontmatter?.title}
        description={exerpt}
        image={frontmatter?.cover}
      />
      <PostWrapper className="blog-post">
        <Wrapper>
          <PostHeader>
            <MotionScroll triggerPoint={0} yOffset={50}>
              <h2 className="display">{frontmatter?.title}</h2>
            </MotionScroll>
          </PostHeader>
          <PostCover frontmatter={frontmatter} customCover={customCover} />
          <MotionScroll fadeIn triggerPoint={0.85} yOffset={50}>
            <PostCredit>
              <h4>
                by John Choura / {frontmatter?.date}/ {timeToRead} Minute Read
              </h4>
            </PostCredit>
          </MotionScroll>
          <MotionScroll fadeIn triggerPoint={0.85} yOffset={100} id="post">
            <ContentWrapper className="content-styles" itemProp="articleBody">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <CodeBlock
                        children={String(children).replace(/\n$/, "")}
                        style={dark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </ContentWrapper>
          </MotionScroll>
        </Wrapper>
      </PostWrapper>
    </>
  );
}
const PostWrapper = styled.section`
  position: relative;
`;
const PostHeader = styled.div`
  margin: 10rem 0 10vw;
  height: fit-content;

  @media ${(props) => props.theme.device.laptop} {
    margin: 20vw 0 10vw;
  }

  @media ${(props) => props.theme.device.desktop} {
    margin: 15vw 0 8vw;
  }
`;
const PostImage = styled.figure`
  width: 100vw;
  min-height: 300px;
  height: 45vw;
  transform: translateX(-1rem);
  background-color: white;
  margin: 3.5vw 0;
  overflow: hidden;

  @media ${(props) => props.theme.device.mobileLg} {
    transform: translateX(-7vw);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale3d(1.01, 1.01, 1.01);
    transition: transform ${(props) => props.theme.animation.duration[300].css};
  }
`;
const PostCredit = styled.div`
  margin: 2rem 0 3rem;

  @media ${(props) => props.theme.device.laptop} {
    margin: 3.5vw 0;
  }
`;
const PostSegue = styled(Wrapper)`
  display: flex;
  padding-top: 10.5vw;
  padding-bottom: 10.5vw;
  background-color: ${(props) => props.theme.colors.black};

  * {
    color: ${(props) => props.theme.colors.white};
  }
`;
const SegueItem = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  width: 50%;

  h3 {
    @media ${(props) => props.theme.device.tablet} {
      max-width: 12em;
    }
  }

  &.none h6 {
    opacity: 0.5;
  }

  &.next {
    text-align: right;
    align-items: flex-end;

    h3 {
      padding-left: 0.5rem;
    }

    @media ${(props) => props.theme.device.tablet} {
      h3 {
        padding-left: 3rem;
      }
    }
  }

  &.previous {
    text-align: left;
    align-items: flex-start;

    h3 {
      padding-right: 0.5rem;
    }

    @media ${(props) => props.theme.device.tablet} {
      h3 {
        padding-right: 3rem;
      }
    }
  }
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
  width: 100%;
  margin: 0 auto 7vw;

  @media ${(props) => props.theme.device.laptop} {
    width: 42rem;
    h1,
    h2,
    h3 {
      max-width: 85%;
    }
  }

  img,
  p img {
    max-width: 100%;
    width: 100%;
  }

  p {
    font-size: 1rem;
    letter-spacing: 0.01em;

    @media ${(props) => props.theme.device.laptop} {
      font-size: 1.25rem;
    }
  }
`;
