import clsx from 'clsx';
import Link from 'next/link';
import { PageItem } from '../../types/content-types';

export type LinkGridItemProps = PageItem;

export default function LinkGridItem({
  href,
  externalHref,
  className,
  title,
  description,
  status,
}: LinkGridItemProps) {
  const isLink = href || externalHref;
  const Tag = isLink ? Link : ('div' as any);

  const statusClasses = clsx(
    status === 'Coming Soon' &&
      'opacity-60 bg-gradient-to-r from-root to-black via-transparent bg-clip-text text-transparent',
    status === 'Coming Soon' &&
      'transition-all ease-out-expo group-hover:!bg-root group-hover:opacity-100 duration-300',
    status === 'Coming Soon' &&
      'group-focus-visible:!bg-root group-focus-visible:opacity-100',
  );

  const itemProps = () => {
    if (href) {
      return {
        href: href || '',
      };
    } else if (externalHref) {
      return {
        href: externalHref || '',
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    } else {
      return {};
    }
  };

  return (
    <Tag
      {...itemProps()}
      className={clsx('group', externalHref && 'cursor-ne-resize', className)}
    >
      <p className="opacity-60 text-caption"> {status}</p>
      <p
        className={clsx(
          'group flex gap-1',
          'headline-display-xs',
          'text-left group max-w-[30em] cursor-help z-50 relative pointer-events-none',
          statusClasses,
        )}
      >
        <span className="no-underline group-hover:underline line-clamp-1">
          {title}
        </span>{' '}
        {href && `→`}
      </p>
      <p className={clsx('text-sm mt-1', statusClasses)}>{description}</p>
    </Tag>
  );
}
