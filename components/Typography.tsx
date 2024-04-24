import clsx from "clsx";

export function Typography({
  tag = "p",
  children,
  className,
  size = "md",
  ...rest
}: any) {
  const Tag = tag;
  const getSize = () => {
    switch (size) {
      case "xl":
        return "headline-display-lg";
      case "lg":
        return "headline-display-md";
      case "md":
        return clsx(
          "!text-[1.5rem] lg:!text-[1.25rem] tracking-wider uppercase"
        );
      case "sm":
        return "!text-[0.8rem] lg:!text-[0.8rem] tracking-widest uppercase";
      case "xs":
        return "!text-[0.65rem] lg:!text-[0.65rem] tracking-widest uppercase";
      default:
        return "!text-[1.5rem] lg:!text-[1.25rem] tracking-wider uppercase";
    }
  };

  return (
    <Tag
      className={clsx("font-sans tracking-widest", getSize(), className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
