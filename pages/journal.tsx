import clsx from "clsx";
import InlineLink from "../components/InlineLink";
import { LINE_ONE, TOP_LINE } from "../components/justified-headline/data";
import { JustifiedHeadlineInner } from "../components/justified-headline/JustifiedHeadlineInner";
import { Typography } from "../components/Typography";

export default function JournalPage() {
  return (
    <>
      <JustifiedHeadlineInner
        className={clsx("leading-[1] w-full font-black pointer-events-none")}
        headline={[{ text: "Journal", motionObject: LINE_ONE }]}
        letters={true}
      />
      <JustifiedHeadlineInner
        className={clsx("leading-[1] w-full font-black pointer-events-none")}
        headline={[{ text: "Coming Soon", motionObject: TOP_LINE }]}
      />
    </>
  );
}
