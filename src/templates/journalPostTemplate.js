import React from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Layout from "../components/layout";
import { Wrapper } from "../components/style/global-styles";

export default function Template({ data }) {
	const { mdx } = data;
	const { frontmatter, body, timeToRead } = mdx;
	return (
		<Layout pageTitle={frontmatter.title}>
			<PostWrapper className="blog-post">
				<Wrapper>
					<h2 className="display">{frontmatter.title}</h2>
					<div>
						<pre>{frontmatter.cover}</pre>
					</div>
					<div>
						<h4>
							by John Choura / {frontmatter.date} / {timeToRead}{" "}
							Minute Read
						</h4>
					</div>

					<ContentWrapper>
						<MDXRenderer>{body}</MDXRenderer>
					</ContentWrapper>
				</Wrapper>
			</PostWrapper>
		</Layout>
	);
}

const PostWrapper = styled.div`
	position: relative;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	position: relative;
	width: 100%;
	margin: 0 auto;

	@media ${(props) => props.theme.device.tablet} {
		width: 50%;
	}

	img {
		max-width: 100%;
	}
`;

export const pageQuery = graphql`
	query($id: String!) {
		mdx(id: { eq: $id }) {
			id
			body
			frontmatter {
				date(formatString: "MMM DD, yyyy")
				slug
				title
				cover
			}
			timeToRead
			excerpt
		}
	}
`;
