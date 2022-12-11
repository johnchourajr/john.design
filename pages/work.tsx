import clsx from "clsx";
import { getRandomParentAndChildClassesArray } from "../components/justified-headline/data";
import { JustifiedHeadlineInner } from "../components/justified-headline/JustifiedHeadlineInner";

export default function WorkPage() {
  return (
    <>
      <JustifiedHeadlineInner
        className={clsx("leading-[1] w-full font-black pointer-events-none")}
        headline={[
          {
            text: "Work",
            motionObject: getRandomParentAndChildClassesArray(8),
          },
        ]}
        iterations={8}
        letters={true}
      />
      <JustifiedHeadlineInner
        className={clsx("leading-[1] w-full font-black pointer-events-none")}
        headline={[
          {
            text: "Coming Soon",
            motionObject: getRandomParentAndChildClassesArray(8),
            className: "!text-[1rem] lg:!text-[1vw] !tracking-wider uppercase",
          },
        ]}
      />
    </>
  );
}
