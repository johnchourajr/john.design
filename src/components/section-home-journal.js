import React from "react";
import { StaticQuery } from "gatsby";
import JournalItem from "./journal-item";

export default function SectionHomeJournal() {
	return (
		<StaticQuery
			query={graphql`
				query journalFeature {
					allMdx(
						filter: {
							frontmatter: {
								template: { eq: "journalPostTemplate" }
							}
						}
						limit: 1
						sort: { fields: frontmatter___date, order: DESC }
					) {
						edges {
							node {
								id
								frontmatter {
									slug
									date(formatString: "MMM DD, yyyy")
									title
									cover
								}
								timeToRead
								excerpt
							}
						}
					}
				}
			`}
			render={({ allMdx: { edges } }, i) => {
				const { node } = edges[0];
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
			}}
		/>
	);
}
