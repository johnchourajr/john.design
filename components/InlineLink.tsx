import Link, { LinkProps } from "next/link";
import clsx from "clsx";

interface InlineLinkProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

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
        "relative z-50 underline pointer-events-auto cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
