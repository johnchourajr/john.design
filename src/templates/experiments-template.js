import React from 'react';
import { graphql } from 'gatsby';

import { Wrapper } from '../components/style/global-styles';
import PageHeader from '../components/page-header';
import PunchBoard from '../components/experiments/punchboard';
import { createGlobalStyle } from 'styled-components';
import Blotter from '../components/experiments/blotter';

export const ExperimentStyles = createGlobalStyle`
  footer {
    display: none;
    visibility: hidden;
  }

  nav > div {
    display: none;
    visibility: hidden;
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
    mdx: { frontmatter }
  }
}) {
  const { experiment } = frontmatter;

  const experiments = {
    PunchBoard: PunchBoard,
    Blotter: Blotter
  };

  const ExperimentComponent =
    experiments[experiment] !== undefined
      ? experiments[experiment]
      : React.Fragment;

  return (
    <>
      <ExperimentStyles />
      <ExperimentComponent />
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
        experiment
      }
    }
  }
`;
