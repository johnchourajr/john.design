import WorkPage from '@/app-pages/work-page';
import { workContent } from '@/data/workContent';
import { pageMetadata } from '@/data/metadata';

export const metadata = pageMetadata({
  title: 'Work',
  description: 'Selected design and development work by John Choura.',
  path: '/work',
});

export default async function Page() {
  const data = workContent;

  return <WorkPage {...data} />;
}
