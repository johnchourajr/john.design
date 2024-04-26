import LinkGridItem, { LinkGridItemProps } from '@/components/LinkGridItem';
import { JustifiedHeadlineInner } from '@/components/justified-headline/JustifiedHeadlineInner';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import clsx from 'clsx';

const data: LinkGridItemProps[] = [
  {
    href: '/exp/rss-substack',
    title: 'RSS Substack',
    description: 'Get substack content.',
    status: 'NEW',
  },
  {
    href: '/exp/color-wheel',
    title: 'Color Wheel',
    description: 'All of the colors of the rainbow.',
    status: 'NEW',
  },
  {
    href: '/exp/john-gl',
    title: 'JohnGL',
    description: 'What if picture of John and webGL had a bebe.',
    status: 'NEW',
  },
  {
    href: '/exp/justified-headline',
    title: 'Justified Headline',
    description: "It's like a headline the feels really justified.",
    status: 'NEW',
  },
  {
    href: '/exp/freehand',
    title: 'Freehand',
    description: 'Probably aight to draw anywhere, right?',
  },
  {
    href: '/exp/scroll-grow',
    title: 'Scroll Grow',
    description: "So when you scroll, it's... weird.",
  },
  {
    // href: "/exp/logo-animate",
    title: 'Logo Animate',
    description: 'Animating the logo because why the hell not.',
    status: 'Coming Soon',
  },
  {
    // href: "/exp/see-scroll",
    title: 'See Scroll',
    description: 'Some things go on and on and on and on and on.',
    status: 'Coming Soon',
  },
];

export default function ExpPage() {
  return (
    <>
      <section className="my-[4vw]">
        <JustifiedHeadlineInner
          className={clsx('leading-[1] w-full font-black pointer-events-none')}
          headline={[
            {
              text: 'Experiments',
              motionObject: getRandomParentAndChildClassesArray(8),
            },
          ]}
          letters={true}
          iterations={8}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-[10vw] px-4">
        {data.map((item, i) => (
          <LinkGridItem key={i} {...item} />
        ))}
      </section>
    </>
  );
}
