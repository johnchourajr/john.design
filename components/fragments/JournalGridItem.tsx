import clsx from 'clsx';
import Link from 'next/link';
import { PageItem } from '../../types/content-types';

export type JournalGridItemProps = PageItem;

export default function JournalGridItem({
  href,
  className,
  title,
  description,
}: JournalGridItemProps) {
  const Tag = href ? Link : ('div' as any);

  return (
    <Link href={href || ''} className={clsx('group col-span-2', className)}>
      <p
        className={clsx(
          'group flex gap-1',
          'headline-display-sm sm:headline-display-md',
          'text-left group max-w-[20em] cursor-help z-50 relative pointer-events-none',
        )}
      >
        <span className="no-underline group-hover:underline underline-offset-4 decoration-2">
          {title}
        </span>{' '}
      </p>
      <p className={clsx('headline-display-xs mt-3')}>{description}</p>
    </Link>
  );
}
