import * as React from "react";

import JournalItem from "../components/journal-item";
import Layout from "../components/layout";
import PageHeader from "../components/page-header";
import { Wrapper } from "../components/style/global-styles";

function JournalItems({ items }) {
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			{items.map(({ node }, i) => {
				return (
					<JournalItem
						key={i}
						slug={node.frontmatter.slug}
						title={node.frontmatter.title}
						date={node.frontmatter.date}
						timeToRead={node.timeToRead}
						excerpt={node.excerpt}
						cover={node.frontmatter.cover}
					/>
				);
			})}
		</div>
	);
}

export default function JournalIndexPage({
	data: {
		allMdx: { edges },
		mdx: { frontmatter },
	},
}) {
	return (
		<Layout pageTitle={frontmatter.title}>
			<PageHeader title={frontmatter.title} />
			<Wrapper>
				<JournalItems items={edges} />
			</Wrapper>
		</Layout>
	);
}

export const pageQuery = graphql`
	query pageQuery($id: String!) {
		allMdx(
			filter: { frontmatter: { template: { eq: "journalPostTemplate" } } }
			sort: { fields: frontmatter___date, order: DESC }
		) {
			edges {
				node {
					id
					frontmatter {
						title
						slug
						date(formatString: "MMM DD, yyyy")
						cover
					}
					timeToRead
					excerpt
				}
			}
		}
		mdx(id: { eq: $id }) {
			frontmatter {
				date(formatString: "MMM DD, YYYY")
				slug
				title
			}
		}
	}
`;
