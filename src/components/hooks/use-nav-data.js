// import { useStaticQuery, graphql } from 'gatsby';

// export const useNavData = () => {
//   const data = useStaticQuery(
//     graphql`
//       query navDataQuery {
//         allMdx(
//           filter: { frontmatter: { type: { eq: "topLevelPage" } } }
//           sort: { fields: frontmatter___weight, order: ASC }
//         ) {
//           edges {
//             node {
//               id
//               frontmatter {
//                 title
//                 type
//                 slug
//                 weight
//               }
//             }
//           }
//         }
//       }
//     `
//   );
//   return data.allMdx;
// };

// export default useNavData;
