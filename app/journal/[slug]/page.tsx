import PostPage from '@/app-pages/journal-details-page';
import { getAllPosts, getPostBySlug } from '@/lib/pages/posts';

// Only prerendered posts exist; any other slug is a 404, not a missing file.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);
  const { title, description, cover, videoCover, ogImage, slug } =
    post.frontmatter;

  return {
    title,
    description,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://john.design/journal/${slug}`,
      images: ogImage || cover || videoCover,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage || cover || videoCover,
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  return <PostPage post={post} />;
}
