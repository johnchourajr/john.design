import { getAllPosts, getPostBySlug } from '@/lib/pages/posts';

const PostPage = ({ post }: any) => {
  if (!post) return <p>Loading...</p>;

  return (
    <article>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};

export async function getStaticPaths() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  const post = getPostBySlug(params.slug);
  return { props: { post } };
}

export default PostPage;
