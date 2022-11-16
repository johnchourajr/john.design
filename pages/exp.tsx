import LinkGridItem, { LinkGridItemProps } from "../components/LinkGridItem";

const data: LinkGridItemProps[] = [
  {
    href: "/exp/justified-headline",
    title: "Justified Headline",
    description: "The ability to have a headline do some wild transitions.",
    status: "NEW",
  },
  {
    href: "/exp/freehand",
    title: "Freehand",
    description: "The ability to draw directly over the top of the site.",
  },
  {
    href: "/exp/scroll-grow",
    title: "Scroll Grow",
    description: "The ability to view content on scroll in a... unique way.",
  },
];

export default function Home() {
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
