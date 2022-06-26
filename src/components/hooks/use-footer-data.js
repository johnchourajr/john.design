// import { useStaticQuery, graphql } from 'gatsby';

// export const useFooterData = () => {
//   const {
//     allMdx: { edges }
//   } = useStaticQuery(
//     graphql`
//       query footerData {
//         allMdx(
//           filter: {
//             frontmatter: { title: { eq: "Home" }, type: { eq: "topLevelPage" } }
//           }
//         ) {
//           edges {
//             node {
//               frontmatter {
//                 section_fam {
//                   about_me {
//                     text
//                     quote
//                   }
//                   photos {
//                     img {
//                       childImageSharp {
//                         fluid(maxWidth: 800) {
//                           ...GatsbyImageSharpFluid
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     `
//   );
//   return edges[0].node.frontmatter;
// };
