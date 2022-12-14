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
        return "!text-[3rem] lg:!text-[6vw]";
      case "lg":
        return "!text-[1.5rem] lg:!text-[2vw]";
      case "md":
        return "!text-[1rem] lg:!text-[1vw] tracking-wider uppercase";
      case "sm":
        return "!text-[0.625rem] lg:!text-[0.625vw] tracking-widest uppercase";
      case "xs":
        return "!text-[0.5rem] lg:!text-[0.5vw] tracking-widest uppercase";
      default:
        return "!text-[1rem] lg:!text-[1vw] tracking-wider uppercase";
    }
  };

  return (
    <Tag className={clsx("font-bold", getSize(), className)} {...rest}>
      {children}
    </Tag>
  );
}
