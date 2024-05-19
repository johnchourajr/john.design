import clsx from 'clsx';
import Link from 'next/link';
import { PageItem } from '../../types/content-types';
import { TagsList } from './TagsList';

export type JournalArchiveGridItemProps = {
  tags?: string[];
} & PageItem;

export default function JournalArchiveGridItem({
  href,
  className,
  title,
  description,
  status,
  tags,
}: JournalArchiveGridItemProps) {
  return (
    <Link href={href || ''} className={clsx('group', className)}>
      <p className="opacity-60 text-caption"> {status}</p>
      <p
        className={clsx(
          'group flex gap-1',
          'headline-display-xs',
          'text-left group max-w-[30em] cursor-help z-50 relative pointer-events-none',
        )}
      >
        <span className="no-underline group-hover:underline line-clamp-1">
          {title}
        </span>{' '}
        {href && `→`}
      </p>

      <p className={clsx('text-sm mt-1')}>{description}</p>
      {tags && <TagsList tags={tags} />}
    </Link>
  );
}
