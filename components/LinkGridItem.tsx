import clsx from "clsx";
import Link from "next/link";

export interface LinkGridItemProps {
  href: string;
  className?: string;
  title: string;
  description: string;
  status?: "NEW" | "Coming Soon";
}

export default function LinkGridItem({
  href,
  className,
  title,
  description,
  status,
}: LinkGridItemProps) {
  return (
    <Link href={href} className={clsx("", className)}>
      <h2>
        <span className="underline">{title}</span> &rarr;
        {status && <span className="text-xs opacity-60"> {status}</span>}
      </h2>
      <p>{description}</p>
    </Link>
  );
}
