import PostPage from '@/app-pages/journal-details-page';
import { getAllPosts, getPostBySlug } from '@/lib/pages/posts';
import { PostData } from '@/types/content-types';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return paths;
}

export async function generateMetadata(props: { params: PostData }) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);
  const { title, description, cover, videoCover, ogImage, slug } =
    post.frontmatter;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://yourwebsite.com/journal/${slug}`,
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

export default async function Page(props: { params: PostData }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  return <PostPage post={post} />;
}
