import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';

type InlineLinkProps = {
  className?: string;
  children: React.ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  title?: string;
  'aria-label'?: string;
} & LinkProps;

export default function InlineLink({
  href,
  children,
  className,
  target,
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
      <span className="underline">{children}</span>{' '}
      {target === '_blank' && <span>↗</span>}
    </Link>
  );
}
