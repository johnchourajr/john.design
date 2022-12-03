import LinkGridItem, { LinkGridItemProps } from "../components/LinkGridItem";
import { JohnGLCanvas } from "./exp/john-gl";
import { JustifiedHeadlineInner } from "./exp/justified-headline";

const data: LinkGridItemProps[] = [
  {
    href: "/exp",
    title: "Experiments",
    description: "Proof of concept work in the progress of building the site.",
  },
  {
    href: "/journal",
    title: "Journal",
    description: "Site journal content",
    status: "Coming Soon",
  },
  {
    href: "/work",
    title: "Work",
    description: "Site work content",
    status: "Coming Soon",
  },
];

export default function HomePage() {
  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8 relative z-50">
        {data.map((item, i) => (
          <LinkGridItem key={i} {...item} />
        ))}
      </div>
      <div className="flex items-center justify- relative z-0 h-[100vh]">
        <div className="flex w-[100vw] z-10 relative !pointer-events-none">
          <JustifiedHeadlineInner />
        </div>
        <JohnGLCanvas />
      </div>
    </main>
  );
}
