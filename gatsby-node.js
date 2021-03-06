const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

/**
 * Creates custom schemas in GraphQL
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter!
    }
    type MdxFrontmatter {
      cover: File @fileByRelativePath
      thumb: File @fileByRelativePath
      clients: Clients! @link
    }
    type Clients @dontInfer {
      year: String!
    }
  `);
};

/**
 * Creates field in GraphQL for a year field
 */
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const date = new Date(node.frontmatter.date);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const year_month = `${year}-${month}`;
    const day = date.getDate();

    createNodeField({ node, name: 'year', value: year });
    createNodeField({ node, name: 'month', value: month });
    createNodeField({ node, name: 'year-month', value: year_month });
    createNodeField({ node, name: 'day', value: day });

    const slug = createFilePath({ node, getNode, basePath: `pages` });

    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }
};

/**
 * Creates all pages
 */
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            frontmatter {
              type
              slug
              template
              title
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
        title: node.frontmatter.title,
        template: node.frontmatter.template,
        slug: node.frontmatter.slug,
        id: node.id,
        next: next,
        previous: previous
      }
    });
  });
};
