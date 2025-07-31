import clsx from 'clsx';
import Link from 'next/link';
import { PageItem } from '../../types/content-types';
import { TagsList } from './TagsList';

export type JournalArchiveGridItemProps = {
  tags?: string[];
  filePath?: string; // Add for Visual Editor annotations
} & PageItem;

export default function JournalArchiveGridItem({
  href,
  className,
  title,
  description,
  status,
  tags,
  filePath,
}: JournalArchiveGridItemProps) {
  return (
    <Link
      href={href || ''}
      className={clsx('group', className)}
      data-sb-object-id={filePath}
    >
      <p className="opacity-60 text-caption"> {status}</p>
      <p
        className={clsx(
          'group flex gap-1',
          'headline-display-xs',
          'text-left group max-w-[30em] cursor-help z-50 relative pointer-events-none',
        )}
      >
        <span
          className="no-underline group-hover:underline line-clamp-1"
          data-sb-field-path="title"
        >
          {title}
        </span>{' '}
        {href && `→`}
      </p>

      <p className={clsx('text-sm mt-1')} data-sb-field-path="date">
        {description}
      </p>
      {tags && (
        <div data-sb-field-path="tags">
          <TagsList tags={tags} />
        </div>
      )}
    </Link>
  );
}
