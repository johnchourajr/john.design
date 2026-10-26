import WorkPage from '@/app-pages/work-page';
import { workContent } from '@/data/workContent';
import { pageMetadata } from '@/data/metadata';
import { getWorkFrames } from '@/lib/pages/work-media';
import type { PageItem } from '@/types/content-types';

export const metadata = pageMetadata({
  title: 'Work',
  description: 'Selected design and development work by John Choura.',
  path: '/work',
});

const withFrames = (list: PageItem[]) =>
  list.map((item) => ({
    ...item,
    frames: item.slug ? getWorkFrames(item.slug) : [],
  }));

export default async function Page() {
  return (
    <WorkPage
      moonlight={{
        title: workContent.moonlightData.title,
        list: withFrames(workContent.moonlightData.list),
      }}
      daylight={{
        title: workContent.daylightData.title,
        list: withFrames(workContent.daylightData.list),
      }}
    />
  );
}
