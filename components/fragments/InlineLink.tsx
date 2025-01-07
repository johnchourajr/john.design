import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';

type InlineLinkProps = {
  className?: string;
  children: React.ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  title?: string;
  underline?: boolean;
  showArrow?: boolean;
  'aria-label'?: string;
} & LinkProps;

export default function InlineLink({
  href,
  children,
  className,
  target,
  underline = true,
  showArrow = true,
  ...props
}: InlineLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'relative z-50 pointer-events-auto cursor-pointer',
        className,
      )}
      target={target}
      {...props}
    >
      <span
        className={clsx(
          underline && 'underline underline-offset-2 decoration-1',
        )}
      >
        {children}
      </span>{' '}
      {showArrow && target === '_blank' && <span>↗</span>}
    </Link>
  );
}
