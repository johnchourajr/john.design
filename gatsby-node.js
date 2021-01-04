const path = require("path");

exports.createPages = async ({ actions, graphql, reporter }) => {
	const { createPage } = actions;

	const result = await graphql(`
		{
			allMdx(
				sort: { order: DESC, fields: [frontmatter___date] }
				limit: 1000
			) {
				edges {
					node {
						frontmatter {
							slug
							template
						}
						id
					}
				}
			}
		}
	`);

	// Handle errors
	if (result.errors) {
		reporter.panicOnBuild(`Error while running GraphQL query.`);
		return;
	}

	result.data.allMdx.edges.forEach(({ node }) => {
		const template = node.frontmatter.template
			? node.frontmatter.template
			: "pageTemplate";
		createPage({
			path: node.frontmatter.slug,
			component: path.resolve(`./src/templates/${String(template)}.js`),
			context: {
				// additional data can be passed via context
				slug: node.frontmatter.slug,
				id: node.id,
			},
		});
	});
};
