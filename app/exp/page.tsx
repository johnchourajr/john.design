import ExpPage from '@/app-pages/exp-page';
import { expData } from '@/data/expContent';
import { pageMetadata } from '@/data/metadata';
import { getMediaSize } from '@/lib/pages/journal-media';

export const metadata = pageMetadata({
  title: 'Experiments',
  description: 'Interactive experiments with WebGL shaders, type, and motion.',
  path: '/exp',
});

// A still of each experiment, captured into public/exp/previews/ (#128).
const withPreview = expData.map((item) => {
  const src = `/exp/previews/${item.href?.split('/').pop()}.jpg`;
  const size = getMediaSize(src);
  return { ...item, preview: size ? { src, ...size } : null };
});

export default function Page() {
  return <ExpPage content={withPreview} />;
}
