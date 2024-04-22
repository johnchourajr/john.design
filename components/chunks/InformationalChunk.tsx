import clsx from "clsx";
import { Typography } from "../Typography";

export function InformationalChunk({ text }: any) {
  return (
    <Typography
      size="sm"
      className="text-left indent-[6em] group max-w-[30em] cursor-help "
    >
      {text.map((t: string, i: number) => {
        const highlight = t.includes("*");
        if (highlight) {
          t = t.replaceAll("*", "");
        }
        return (
          <span
            key={i}
            className={clsx(
              highlight ? "group-hover:opacity-100" : "group-hover:opacity-50",
              "ease-out-expo transition-opacity duration-300 "
            )}
          >
            {t}
          </span>
        );
      })}
    </Typography>
  );
}
