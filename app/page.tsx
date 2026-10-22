// Import your Client Component
import HomePage from '@/app-pages/home-page';
import { homepageContent } from '@/data/homepageContent';
import { pageMetadata } from '@/data/metadata';

export const metadata = pageMetadata({ path: '/' });

export default async function Page() {
  const content = homepageContent;

  return (
    <>
      <h1 className="sr-only">{content.heroSection.staticHeadline}</h1>
      <HomePage {...content} />
    </>
  );
}
