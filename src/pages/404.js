import React from "react";

/**
 * Local Components
 */
import { Wrapper } from "../components/style/global-styles";
import PageHeader from "../components/page-header";

/**
 * FourOhFour Component
 *
 * @param {Object} props
 * @param {Object} props.path
 */
export default function FourOhFour({ path }) {
  return (
    <>
      <PageHeader title={"404"} size="lg" />
      <Wrapper>
        <h1>Nothing found at {path}</h1>
      </Wrapper>
    </>
  );
}
