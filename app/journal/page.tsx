import JournalPage from '@/app-pages/journal-index-page';
import { getAllPosts } from '@/lib/pages/posts';
import { pageMetadata } from '@/data/metadata';

export const metadata = pageMetadata({
  title: 'Journal',
  description: 'Writing by John Choura on design, code, and the internet.',
  path: '/journal',
});

export default async function Page() {
  const posts = getAllPosts();

  return <JournalPage posts={posts} />;
}
