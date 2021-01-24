import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import { Wrapper } from "../components/style/global-styles";
import SectionHomeHero from "../components/section-home-hero";
import SectionHomeJournal from "../components/section-home-journal";

export default function Template({
	data: {
		allMdx: { edges },
	},
}) {
	const { frontmatter } = edges[0].node;

	return (
		<Layout pageTitle={frontmatter.title}>
			<SectionHomeHero data={frontmatter} />
			<Wrapper>
				<section>
					<ul>
						{frontmatter.section_resume.map((item, i) => (
							<li key={i}>
								<h1>
									<span>{item.title} </span>
									<span>{item.name} </span>
									<span>{item.date} </span>
								</h1>
							</li>
						))}
					</ul>
				</section>
			</Wrapper>
			<Wrapper>
				<section>
					<ul>
						{frontmatter.section_brands.map((item, i) => (
							<li key={i}>
								<h1>{item.name} </h1>
							</li>
						))}
					</ul>
				</section>
			</Wrapper>
			<Wrapper>
				<section>
					{frontmatter.section_art.headline}
					{frontmatter.section_art.img}
				</section>
			</Wrapper>
			<Wrapper>
				<section>
					<SectionHomeJournal />
				</section>
			</Wrapper>
		</Layout>
	);
}

export const indexQuery = graphql`
	query indexQuery {
		allMdx(
			filter: {
				frontmatter: { title: { eq: "Home" }, type: { eq: "topLevelPage" } }
			}
		) {
			edges {
				node {
					id
					frontmatter {
						title
						section_art {
							headline
							img
						}
						section_brands {
							name
							url
						}
						section_hero
						section_resume {
							date
							name
							title
						}
					}
				}
			}
		}
	}
`;
