import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";

export default function Template({ data }) {
	const { markdownRemark } = data; // data.markdownRemark holds your post data
	const { frontmatter, html } = markdownRemark;
	return (
		<Layout pageTitle={frontmatter.title}>
			<h1>{frontmatter.title}</h1>
		</Layout>
	);
}

export const pageQuery = graphql`
	query($slug: String!) {
		markdownRemark(frontmatter: { slug: { eq: $slug } }) {
			html
			frontmatter {
				slug
				title
			}
		}
	}
`;
