import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';

type InlineLinkProps = {
  className?: string;
  children: React.ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  title?: string;
  ariaLabel?: string;
} & LinkProps;

export default function InlineLink({
  href,
  children,
  className,
  ...props
}: InlineLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'relative z-50 underline pointer-events-auto cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
