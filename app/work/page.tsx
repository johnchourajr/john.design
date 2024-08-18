import WorkPage from '@/app-pages/work-page';
import { workContent } from '@/data/workContent';

export default async function Page() {
  const data = workContent;

  return <WorkPage {...data} />;
}
