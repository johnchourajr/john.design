import React from "react";
import { graphql } from "gatsby";

import { Wrapper } from "../components/style/global-styles";
import PageHeader from "../components/page-header";
import styled from "styled-components";
import { Headline } from "../components/type";

const Input = styled.div`
  position: relative;
  width: 100%;
  height: 6rem;
  margin-bottom: 4vw;

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    appearance: none;
    border-radius: 0.5rem;
    border: none;
    font-family: "LabilGrotesk-Medium";
    font-size: 2rem;
    padding: 2rem;
  }

  label {
    position: absolute;
    visibility: hidden;
    top: 1rem;
    left: 1rem;
    z-index: 1;
  }
`;

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
  const [pw, setPw] = React.useState("");
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    // NOT AT ALL SECURE lol
    // IF YOU FOUND THIS, CONGRATS
    if (pw === "werkjc") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [pw]);

  return (
    <>
      <PageHeader title={frontmatter.title} />
      <Wrapper>
        <Input>
          <label>Passkey </label>
          <input
            type="password"
            name="pw"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="enter secret passkey"
          />
        </Input>

        {show ? (
          <Headline size="h1">
            You're in!{" "}
            <a
              href="https://www.figma.com/proto/ZKCSwMaWuBlwH6AXkSb4hp/Work-by-John-Choura?page-id=1246%3A9433&node-id=1246%3A28084&viewport=296%2C48%2C0.03&scaling=contain"
              target="_blank"
              rel="noreferrer"
            >
              View Work →
            </a>
          </Headline>
        ) : (
          <Headline size="h1">
            <a href="mailto:hi+workinquiry@john.design">
              Email for access to work.
            </a>
          </Headline>
        )}
      </Wrapper>
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
