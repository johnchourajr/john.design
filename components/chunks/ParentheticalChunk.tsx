import { Typography } from "../Typography";

export function ParentheticalChunk({ text }: any) {
  return (
    <span className=" whitespace-nowrap">
      ({" "}
      <span className="inline-flex items-center justify-start h-0 translate-y-[-0.45em]">
        <Typography
          tag="span"
          size="sm"
          className="inline-flex text-left whitespace-pre-wrap max-w-[30em] indent-[6em]"
        >
          {text}
        </Typography>
      </span>{" "}
      )
    </span>
  );
}
