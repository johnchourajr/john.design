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

const homePageData = {
  heroSection: {
    headlineData: [
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
    ],
    typographies: [
      {
        text: "This is John Choura",
      },
      {
        size: "sm",
        text: "What’s in a name?",
      },
    ],
    informationalChunks: [
      {
        text: [
          "JOHN, ",
          "*(/dʒɒn/; JON)* ",
          "the given name from the hebrew “Yochanan” and the anglo “Johanan”, meaning ",
          "*“Yahweh has been gracious.”*",
        ],
      },
      {
        text: [
          "Choura, ",
          "*(/K-0rr-Uh/; cora)* ",
          "the last name of Czechoslovakian origin, ",
          "*meaning unknown*",
          ".",
        ],
      },
    ],
    roles: {
      text: [
        "Art Director ",
        {
          text: "Balancing execution across visual identity, motion, photo/video, and more into singular brand experiences",
        },
        ", Product Designer ",
        {
          text: "The ability to create customer centric digital experiences across web and mobile platforms at scale",
        },
        ", and UI Developer ",
        {
          text: "The ability to use code as a tool to create interactive and engaging production-ready interfaces ",
        },
      ],
    },
  },
};

export default function HomePage() {
  const headlineData = useMemo(() => homePageData.heroSection.headlineData, []);

  return (
    <>
      <section
        id="hero"
        className="relative flex flex-col items-center z-0 min-h-[100vh]"
      >
        <div className="flex self-start w-full py-[20vw] md:py-0">
          <JustifiedHeadlineInner
            className={clsx("my-[16vw] leading-[1] w-full font-black ")}
            iterations={8}
            headline={headlineData}
          />
        </div>
        <div className="flex items-start flex-col gap-6 justify-center relative z-[100] mb-[8vw]">
          {homePageData.heroSection.typographies.map(
            ({ text, size }, index) => (
              <Typography key={index} size={size}>
                {text}
              </Typography>
            )
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {homePageData.heroSection.informationalChunks.map(
              (chunk, index) => (
                <InformationalChunk key={index} text={chunk.text} />
              )
            )}
          </div>
        </div>
        <div
          className={clsx(
            "inline-flex items-center flex-col gap-6 justify-center w-full relative z-[100] mb-[8vw]",
            "relative z-10"
          )}
        >
          <Typography
            size="xl"
            className="!font-pixel !font-normal text-center items-center leading-tight"
          >
            {homePageData.heroSection.roles.text.map((item, index) =>
              typeof item === "string" ? (
                item
              ) : (
                <ParentheticalChunk key={index} text={item.text} />
              )
            )}
          </Typography>
        </div>
        <JohnGLCanvas className="h-[150vw] md:h-[100vw]" />
      </section>
    </>
  );
}
