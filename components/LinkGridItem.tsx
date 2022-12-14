import clsx from "clsx";
import Link from "next/link";
import { Typography } from "./Typography";

export interface LinkGridItemProps {
  href?: string;
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
  const Tag = href ? Link : ("div" as any);

  const statusClasses = clsx(
    status === "Coming Soon" &&
      "opacity-60 bg-gradient-to-r from-root to-black via-transparent bg-clip-text text-transparent",
    status === "Coming Soon" &&
      "transition-all ease-out-expo group-hover:!bg-root group-hover:opacity-100 duration-300",
    status === "Coming Soon" &&
      "group-focus-visible:!bg-root group-focus-visible:opacity-100"
  );
  return (
    <Tag href={href} className={clsx("group", className)}>
      <Typography size="xs" className="opacity-60">
        {" "}
        {status}
      </Typography>
      <Typography
        as="h2"
        size="md"
        className={clsx(
          "text-left group max-w-[50em] cursor-help z-50 relative pointer-events-none",
          statusClasses
        )}
      >
        <span className="underline">{title}</span> {href && `→`}
      </Typography>
      <p className={clsx("text-sm mt-1", statusClasses)}>{description}</p>
    </Tag>
  );
}
