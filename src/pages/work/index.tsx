import React from "react";
import pageContent from "@data/index.json";

import { Wrapper } from "@components/style/global-styles";
import PageHeader from "@components/page-header";
import styled from "styled-components";
import { Headline } from "@components/type";

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
 * WorkPage
 */
export default function WorkPage({ content }) {
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
      <PageHeader title={content.title} />
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
            {"You're in!"}{" "}
            <a
              href="https://www.figma.com/proto/ZKCSwMaWuBlwH6AXkSb4hp/Work-by-John-Choura?page-id=1246%3A9433&node-id=1246%3A28084&viewport=296%2C48%2C0.03&scaling=contain"
              target="_blank"
              rel="noreferrer"
            >
              {"View Work →"}
            </a>
          </Headline>
        ) : (
          <Headline size="h1">
            <a href="mailto:hi+workinquiry@john.design">
              {"Email for access to work."}
            </a>
          </Headline>
        )}
      </Wrapper>
    </>
  );
}

export async function getStaticProps({ params }) {
  const content = pageContent.pages.find((page) => page.path === "/work") || {
    notfound: true,
  };
  return { props: { content } };
}
