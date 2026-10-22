import { pageMetadata } from '@/data/metadata';
import { expData } from '@/data/expContent';

/** Metadata for an experiment, from its entry on the /exp index. */
export function expMetadata(href: string) {
  const item = expData.find((exp) => exp.href === href);
  return pageMetadata({
    title: item?.title,
    description: item?.description,
    path: href,
  });
}
