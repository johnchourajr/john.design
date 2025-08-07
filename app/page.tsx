// Import your Client Component
import HomePage from '@/app-pages/home-page';
import { homepageContent } from '@/data/homepageContent';

export default async function Page() {
  const content = homepageContent;

  return (
    <>
      <h1 className="sr-only">{content.heroSection.staticHeadline}</h1>
      <HomePage {...content} />
    </>
  );
}
