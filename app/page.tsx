// Import your Client Component
import { homepageContent } from '@/data/homepageContent';
import HomePage from './home-page';

export default async function Page() {
  const content = homepageContent;

  return <HomePage {...content} />;
}
