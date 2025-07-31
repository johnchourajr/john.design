import clsx from 'clsx';
import Link from 'next/link';
import { PageItem } from '../../types/content-types';
import { TagsList } from './TagsList';

export type JournalGridItemProps = {
  tags?: string[];
  filePath?: string; // Add for Visual Editor annotations
} & PageItem;

export default function JournalGridItem({
  href,
  className,
  title,
  description,
  tags,
  filePath,
}: JournalGridItemProps) {
  return (
    <Link
      href={href || ''}
      className={clsx('group col-span-2 mb-10', className)}
      data-sb-object-id={filePath}
    >
      <p
        className={clsx(
          'group flex gap-1',
          'headline-display-sm sm:headline-display-md',
          'text-left group max-w-[20em] cursor-help z-50 relative pointer-events-none',
          'text-pretty max-w-[14em]',
        )}
      >
        <span
          className="no-underline group-hover:underline underline-offset-4 decoration-2"
          data-sb-field-path="title"
        >
          {title}
        </span>{' '}
      </p>
      <p
        className={clsx('headline-display-xs mt-3 mb-4')}
        data-sb-field-path="date"
      >
        {description}
      </p>
      {tags && (
        <div data-sb-field-path="tags">
          <TagsList tags={tags} size="md" />
        </div>
      )}
    </Link>
  );
}
