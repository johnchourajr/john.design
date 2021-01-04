import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import { Wrapper } from "../components/style/global-styles";
import PageHeader from "../components/page-header";

export default function Template({ data }) {
	const { mdx } = data; // data.mdx holds your post data
	const { frontmatter } = mdx;
	return (
		<Layout pageTitle={frontmatter.title}>
			<PageHeader title={frontmatter.title} />
			<Wrapper></Wrapper>
		</Layout>
	);
}

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
