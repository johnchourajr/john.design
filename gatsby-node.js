const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createNodeField } = actions;
	if (node.internal.type === `Mdx`) {
		const slug = createFilePath({ node, getNode, basePath: `pages` });
		createNodeField({
			node,
			name: `slug`,
			value: slug,
		});
	}
};

exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions;
	const result = await graphql(`
		query {
			allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
				edges {
					node {
						frontmatter {
							slug
							template
						}
						id
					}
					next {
						frontmatter {
							type
							slug
							title
							template
						}
					}
					previous {
						frontmatter {
							type
							slug
							title
							template
						}
					}
				}
			}
		}
	`);
	result.data.allMdx.edges.forEach(({ node, next, previous }) => {
		createPage({
			path: node.frontmatter.slug,
			component: path.resolve(
				`./src/templates/${String(node.frontmatter.template)}.js`
			),
			context: {
				// Data passed to context is available
				// in page queries as GraphQL variables.
				slug: node.frontmatter.slug,
				id: node.id,
				next: next,
				previous: previous,
				// next: {
				// 	title: next.frontmatter.title,
				// 	slug: next.frontmatter.slug,
				// 	template: next.frontmatter.slug,
				// },
				// previous: {
				// 	title: previous.frontmatter.title,
				// 	slug: previous.frontmatter.slug,
				// 	template: previous.frontmatter.slug,
				// },
			},
		});
	});
};

// exports.createPages = async ({ actions, graphql, reporter }) => {
// 	const { createPage } = actions;

// 	return graphql(`
// 		{
// 			allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
// 				edges {
// 					node {
// 						frontmatter {
// 							slug
// 							template
// 						}
// 						id
// 					}
// 				}
// 			}
// 		}
// 	`).then((result) => {
// 		if (result.errors) {
// 			reporter.panicOnBuild(`Error while running GraphQL query.`);
// 			return;
// 		}
// 		console.log(result);

// 		result.data.allMdx.edges.forEach(({ node }) => {
// 			createPage({
// 				path: node.frontmatter.slug,
// 				component: path.resolve(
// 					`./src/templates/${String(node.frontmatter.template)}.js`
// 				),
// 				context: {
// 					// additional data can be passed via context
// 					slug: node.frontmatter.slug,
// 					id: node.id,
// 				},
// 			});
// 		});
// 	});
// };
