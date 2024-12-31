import PostPage from '@/app-pages/journal-details-page';
import { getAllPosts, getPostBySlug } from '@/lib/pages/posts';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  const { title, description, cover, videoCover, slug } = post.frontmatter;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://yourwebsite.com/journal/${slug}`,
      images: cover || videoCover,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: cover || videoCover,
    },
  };
}

export default async function Page(props: any) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  return <PostPage post={post} />;
}
