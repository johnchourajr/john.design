import JournalPage from '@/app-pages/journal-index-page';
import { getAllPosts } from '@/lib/pages/posts';

export default async function Page() {
  const posts = getAllPosts();

  return <JournalPage posts={posts} />;
}
