import * as React from "react";
import Layout from "../components/layout";

// styles

const headingStyles = {
	marginTop: 0,
	marginBottom: 64,
	maxWidth: 320,
};
const headingAccentStyles = {
	color: "#663399",
};
const paragraphStyles = {
	marginBottom: 48,
};
const codeStyles = {
	color: "#8A6534",
	padding: 4,
	backgroundColor: "#FFF4DB",
	fontSize: "1.25rem",
	borderRadius: 4,
};
const listStyles = {
	marginBottom: 96,
	paddingLeft: 0,
};
const listItemStyles = {
	fontWeight: "300",
	fontSize: "24px",
	maxWidth: "560px",
};

const linkStyle = {
	color: "#8954A8",
	fontWeight: "bold",
	fontSize: "16px",
	verticalAlign: "5%",
};

const docLinkStyle = {
	...linkStyle,
	listStyleType: "none",
	marginBottom: 24,
};

const descriptionStyle = {
	color: "#232129",
	fontSize: "14px",
};

const docLink = {
	text: "Documentation",
	url: "https://www.gatsbyjs.com/docs/",
	color: "#8954A8",
};
// data
const links = [
	{
		text: "Tutorial",
		url: "https://www.gatsbyjs.com/docs/tutorial/",
		description:
			"A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
		color: "#E95800",
	},
	{
		text: "How to Guides",
		url: "https://www.gatsbyjs.com/docs/how-to/",
		description:
			"Practical step-by-step guides to help you achieve a specific goal. Most useful when you're trying to get something done.",
		color: "#1099A8",
	},
	{
		text: "Reference Guides",
		url: "https://www.gatsbyjs.com/docs/reference/",
		description:
			"Nitty-gritty technical descriptions of how Gatsby works. Most useful when you need detailed information about Gatsby's APIs.",
		color: "#BC027F",
	},
	{
		text: "Conceptual Guides",
		url: "https://www.gatsbyjs.com/docs/conceptual/",
		description:
			"Big-picture explanations of higher-level Gatsby concepts. Most useful for building understanding of a particular topic.",
		color: "#0D96F2",
	},
	{
		text: "Plugin Library",
		url: "https://www.gatsbyjs.com/plugins",
		description:
			"Add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.",
		color: "#000000",
	},
];

// markup
const IndexPage = () => {
	return (
		<Layout>
			<title>Home Page</title>
			<h1 style={headingStyles}>
				Congratulations
				<br />
				<span style={headingAccentStyles}>
					— you just made a Gatsby site!{" "}
				</span>
				<span role="img" aria-label="Party popper emojis">
					🎉🎉🎉
				</span>
			</h1>
			<p style={paragraphStyles}>
				Edit <code style={codeStyles}>src/pages/index.js</code> to see
				this page update in real-time.{" "}
				<span role="img" aria-label="Sunglasses smiley emoji">
					😎
				</span>
			</p>
			<ul style={listStyles}>
				<li style={docLinkStyle}>
					<a
						style={linkStyle}
						href={`${docLink.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter`}
					>
						{docLink.text}
					</a>
				</li>
				{links.map((link) => (
					<li style={{ ...listItemStyles, color: link.color }}>
						<span>
							<a
								style={linkStyle}
								href={`${link.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter`}
							>
								{link.text}
							</a>
							<p style={descriptionStyle}>{link.description}</p>
						</span>
					</li>
				))}
			</ul>
		</Layout>
	);
};

export default IndexPage;
