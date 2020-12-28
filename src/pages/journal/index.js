import { Link } from "gatsby";
import * as React from "react";
import Layout from "../../components/layout";

// markup
export default function IndexPage({ data }) {
	const { allMarkdownRemark } = data;
	const { edges } = allMarkdownRemark;
	// console.log(edges);
	return (
		<Layout pageTitle="Journal">
			<h1>Journal</h1>
			{edges.map((post, i) => (
				<Link to={post.node.frontmatter.slug} key={i}>
					<div>{post.node.frontmatter.title}</div>
					<div>{post.node.frontmatter.date}</div>
				</Link>
			))}
		</Layout>
	);
}

export const pageQuery = graphql`
	query JournalIndex {
		allMarkdownRemark(
			filter: { frontmatter: { template: { eq: "journalTemplate" } } }
			sort: { fields: frontmatter___date, order: DESC }
		) {
			edges {
				node {
					id
					frontmatter {
						title
						slug
						date(formatString: "MMMM DD, YYYY")
					}
				}
			}
		}
	}
`;
