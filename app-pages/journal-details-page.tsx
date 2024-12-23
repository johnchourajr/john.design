import { PostPage } from '@/components/journal/PostPage';
import { getAllPosts, getPostBySlug } from '@/lib/pages/posts';
import { PostData } from '@/types/content-types';
import { GetStaticPropsContext } from 'next';

export function generateMetadata({ frontmatter, markdown }: PostData) {
  return {
    title: `${frontmatter.title} | John Choura`,
    description: markdown.slice(0, 160),
    image: frontmatter.cover,
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>) {
  const post = getPostBySlug(params?.slug as string);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return { props: { post } };
}

export default PostPage;
