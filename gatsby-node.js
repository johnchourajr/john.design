const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug
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
        slug: node.frontmatter.slug,
        id: node.id,
        next: next,
        previous: previous
      }
    });
  });
};
