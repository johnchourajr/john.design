import ExpPage from '@/app-pages/exp-page';
import { expData } from '@/data/expContent';
import { pageMetadata } from '@/data/metadata';

export const metadata = pageMetadata({
  title: 'Experiments',
  description: 'Interactive experiments with WebGL shaders, type, and motion.',
  path: '/exp',
});

export default function Page() {
  return <ExpPage content={expData} />;
}
