import PostPage from '@/app-pages/journal-details-page';
import { getAllPosts, getPostBySlug } from '@/lib/pages/posts';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return paths;
}

export default async function Page(props: any) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  return <PostPage post={post} />;
}
