import clsx from "clsx";
import { getRandomParentAndChildClassesArray } from "../components/justified-headline/data";
import { JustifiedHeadlineInner } from "../components/justified-headline/JustifiedHeadlineInner";
import LinkGridItem, { LinkGridItemProps } from "../components/LinkGridItem";
import { Typography } from "../components/Typography";

const daylightData: LinkGridItemProps[] = [
  {
    // href: "/work/paypal",
    title: "PayPal.com",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/godaddy-point-of-sale",
    title: "GoDaddy Point of Sale",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/godaddy-commerce",
    title: "GoDaddy Commerce",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/happy-money-office",
    title: "Happy Money Office",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/happy-money",
    title: "Happy Money Brand",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/joy-app",
    title: "Joy App",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/vizio-smartcast",
    title: "Vizio SmartCast",
    description: "",
    status: "Coming Soon",
  },
];

const moonlightData: LinkGridItemProps[] = [
  {
    // href: "/work/the-cape",
    title: "thecape.agency",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/smile-gdp",
    title: "smilegdp.com",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/petroleum-club",
    title: "lbpetroleum.club",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/chris-rushing",
    title: "chrisrushing.com",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/kelsey-dake",
    title: "kelseydake.com",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/the-grand",
    title: "thegrandlb.com",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/arcade",
    title: "Arcade Coffee",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/fermensch",
    title: "Fermensch Kombucha",
    description: "",
    status: "Coming Soon",
  },
  {
    // href: "/work/golden-state",
    title: "Golden State Coffee",
    description: "",
    status: "Coming Soon",
  },
];

export default function WorkPage() {
  return (
    <>
      <section className="my-[4vw]">
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
              className:
                "!text-[1rem] lg:!text-[1vw] !tracking-wider uppercase",
            },
          ]}
        />
      </section>
      <section className="my-[10vw]">
        <Typography size="sm">Daylight Work</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 my-8 gap-8">
          {daylightData.map((item, i) => (
            <LinkGridItem key={i} {...item} />
          ))}
        </div>
      </section>
      <section className="my-[10vw]">
        <Typography size="sm">Moonlight Work</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 my-8 gap-8">
          {moonlightData.map((item, i) => (
            <LinkGridItem key={i} {...item} />
          ))}
        </div>
      </section>
    </>
  );
}
