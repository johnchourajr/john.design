import LinkGridItem, { LinkGridItemProps } from "../components/LinkGridItem";
import { JohnGLCanvas } from "./exp/john-gl";
import { JustifiedHeadlineInner } from "../components/justified-headline/JustifiedHeadlineInner";
import { getRandomParentAndChildClassesArray } from "../components/justified-headline/data";
import clsx from "clsx";
import { Typography } from "../components/Typography";
import { useMemo } from "react";
import { InformationalChunk } from "../components/chunks/InformationalChunk";
import { ParentheticalChunk } from "../components/chunks/ParentheticalChunk";
import FreehandCanvas from "../components/FreehandCanvas";

export default function HomePage() {
  const headlineData = useMemo(() => {
    return [
      {
        text: "John Is",
        motionObject: getRandomParentAndChildClassesArray(8),
        className:
          "z-[100] relative !text-[1rem] lg:!text-[1vw] !tracking-wider uppercase",
      },
      {
        text: "Working On",
        motionObject: getRandomParentAndChildClassesArray(8),
      },
      {
        text: "The *Internet*",
        motionObject: getRandomParentAndChildClassesArray(8),
      },
    ];
  }, []);

  return (
    <>
      <section
        id="hero"
        className="flex flex-col items-center justify- relative z-0 min-h-[100vh]"
      >
        <div className="flex self-start w-full !pointer-events-none">
          <JustifiedHeadlineInner
            className={clsx(
              "my-[16vw] leading-[1] w-full font-black pointer-events-none"
            )}
            iterations={8}
            headline={headlineData}
          />
        </div>
        <div className="flex items-start flex-col gap-6 justify-center relative z-[100] mb-[8vw]">
          <Typography>This is John Choura</Typography>
          <Typography size="sm">What’s in a name?</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <InformationalChunk
              text={[
                "JOHN, ",
                "*(/dʒɒn/; JON)* ",
                "the given name from the hebrew “Yochanan” and the anglo “Johanan”, meaning ",
                "*“Yahweh has been gracious.”*",
              ]}
            />
            <InformationalChunk
              text={[
                "Choura, ",
                "*(/K-0rr-Uh/; cora)* ",
                "the last name of Czechoslovakian origin, ",
                "*meaning unknown*",
                ".",
              ]}
            />
          </div>
        </div>
        <div className="inline-flex items-center flex-col gap-6 justify-center w-full relative z-[100] mb-[8vw]">
          <Typography
            size="xl"
            className="!font-pixel !font-normal text-center items-center leading-tight"
          >
            Art Director{" "}
            <ParentheticalChunk text="Balancing execution across visual identity, motion, photo/video, and more into singular brand experiences" />
            , Product Designer{" "}
            <ParentheticalChunk text="The ability to create customer centric digital experiences across web and mobile platforms at scale" />
            , and UI Developer{" "}
            <ParentheticalChunk text="The ability to use code as a tool to create interactive and engaging production-ready interfaces " />
          </Typography>
        </div>
        <JohnGLCanvas />
      </section>
      <FreehandCanvas />
    </>
  );
}
