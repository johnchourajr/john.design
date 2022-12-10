import LinkGridItem, { LinkGridItemProps } from "../components/LinkGridItem";
import { JohnGLCanvas } from "./exp/john-gl";
import { JustifiedHeadlineInner } from "../components/justified-headline/JustifiedHeadlineInner";
import {
  LINE_ONE,
  LINE_TWO,
  TOP_LINE,
} from "../components/justified-headline/data";
import clsx from "clsx";
import { Typography } from "../components/Typography";

function ParentheticalChunk({ text }: any) {
  return (
    <span className=" whitespace-nowrap">
      ({" "}
      <span className="inline-flex items-center justify-center h-0 translate-y-[-0.45em] max-w-[16vw]">
        <Typography
          tag="span"
          size="sm"
          className="inline-flex text-center whitespace-pre-wrap"
        >
          {text}
        </Typography>
      </span>{" "}
      )
    </span>
  );
}

export default function HomePage() {
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
            headline={[
              {
                text: "John Is",
                motionObject: TOP_LINE,
                className: "z-[100] relative",
              },
              { text: "Working On", motionObject: LINE_ONE },
              { text: "The *Internet*", motionObject: LINE_TWO },
            ]}
          />
        </div>
        <div className="flex items-center flex-col gap-6 justify-center w-full relative z-[100] mb-[8vw]">
          <Typography>This is John Choura</Typography>
          <Typography size="sm">What’s in a name?</Typography>
          <div className="grid grid-cols-2 gap-6">
            <div className="max-w-[25vw]">
              <Typography size="sm" className="text-center">
                JOHN, (/dʒɒn/; JON) the given name from the hebrew “Yochanan”
                and the anglo “Johanan”, meaning “Yahweh has been gracious”
              </Typography>
            </div>
            <div className="max-w-[25vw]">
              <Typography size="sm" className="text-center">
                Choura, (/K-0rr-Uh/; cora) the last name of Czechoslovakian
                origin, meaning unknown.
              </Typography>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center flex-col gap-6 justify-center w-full relative z-[100] mb-[8vw]">
          <Typography
            size="xl"
            className="!font-pixel font-normal text-center items-center leading-tight"
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
    </>
  );
}
