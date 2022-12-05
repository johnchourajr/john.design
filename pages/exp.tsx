import LinkGridItem, { LinkGridItemProps } from "../components/LinkGridItem";

const data: LinkGridItemProps[] = [
  {
    href: "/exp/color-wheel",
    title: "Color Wheel",
    description: "All of the colors of the rainbow.",
    status: "NEW",
  },
  {
    href: "/exp/john-gl",
    title: "JohnGL",
    description: "What if picture of John and webGL had a bebe.",
    status: "NEW",
  },
  {
    href: "/exp/justified-headline",
    title: "Justified Headline",
    description: "It's like a headline the feels really justified.",
    status: "NEW",
  },
  {
    href: "/exp/freehand",
    title: "Freehand",
    description: "Probably aight to draw anywhere, right?",
  },
  {
    href: "/exp/scroll-grow",
    title: "Scroll Grow",
    description: "So when you scroll, it's... weird.",
  },

  {
    href: "/exp/see-scroll",
    title: "See Scroll",
    description: "Some things go on and on and on and on and on.",
    status: "Coming Soon",
  },
];

export default function ExpPage() {
  return (
    <main>
      <h3 className="my-8">Experiments</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 my-8 gap-8">
        {data.map((item, i) => (
          <LinkGridItem key={i} {...item} />
        ))}
      </div>
    </main>
  );
}
