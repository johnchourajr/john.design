import RSSFeed from '@/app-pages/rss-page';
import { getFeed } from '../../../lib/rss';

export default async function Page() {
  const url = 'https://johnchoura.substack.com/feed';
  const { items } = await getFeed(url);

  return <RSSFeed feed={items} />;
}
