'use client';

import clsx from 'clsx';
import { m, useScroll } from 'framer-motion';

import { HomePageData } from '@/data/homepageContent';
import { WrapLetterWords, WrapWords } from '@/lib/utils/wrapInSpans';

const SvgGoDaddy = dynamic(() => import('@/components/svg/SvgGoDaddy'), {
  ssr: false,
  loading: () => <div></div>,
});
const SvgHappyMoney = dynamic(() => import('@/components/svg/SvgHappyMoney'), {
  ssr: false,
  loading: () => <div></div>,
});
const SvgPayPal = dynamic(() => import('@/components/svg/SvgPayPal'), {
  ssr: false,
  loading: () => <div></div>,
});
const SvgRetool = dynamic(() => import('@/components/svg/SvgRetool'), {
  ssr: false,
  loading: () => <div></div>,
});

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ComponentType,
  useEffect,
  useRef,
  useState,
  type SVGProps,
} from 'react';
export type ResumeSectionProps = HomePageData['resumeSection'];

function ResumeItem({ item, index }: { item: any; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'end 85%'],
  });

  const [isHovering, setIsHovering] = useState(false);
  const [positions, setPositions] = useState([
    'justify-start',
    'justify-around',
    'justify-center',
    'justify-end',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        const last = prev.pop();
        return last ? [last, ...prev] : prev;
      });
    }, 1000);

    if (isHovering) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isHovering]);

  const logoMapping: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    GoDaddy: SvgGoDaddy,
    'Happy Money': SvgHappyMoney,
    PayPal: SvgPayPal,
    Retool: SvgRetool,
  };
  const LogoComponent = logoMapping[item.company];

  const getJustify = () => {
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  };

  return (
    <m.div
      ref={ref}
      key={index}
      className="text-center clip pt-[4vw] group"
      style={{
        opacity: scrollYProgress,
      }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <p className="text-string pb-4">{item.title}</p>
      <Link
        href={item.url}
        aria-labelledby={`company-name-${index}`}
        passHref
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'headline-display-lg-serif w-full flex-wrap inline-flex items-center justify-start whitespace-pre-wrap-children',
          getJustify(),
        )}
      >
        {item.showLogo && LogoComponent && (
          <m.span
            className={clsx(
              'mr-[.15em] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out-expo',
            )}
            layout
          >
            <LogoComponent
              className="h-[.85em] w-[.85em] inline-block translate-y-[-10%]"
              aria-labelledby={`company-name-${index}`}
            />
          </m.span>
        )}
        <WrapWords text={item.role} layout />
        <m.span
          className={clsx('h-[.85em] flex mr-[.1em]', getJustify())}
          layout
        >
          <span className="headline-display-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out-expo">
            <WrapLetterWords text={item.company} />
          </span>
        </m.span>
      </Link>
    </m.div>
  );
}

const DynamicResumeItem = dynamic(() => Promise.resolve(ResumeItem), {
  ssr: false,
});

export function ResumeSection({ title, resumeList }: ResumeSectionProps) {
  return (
    <section className="my-[6vw] px-6 grid auto-rows-fr items-start overflow-hidden">
      {title && <h2>{title}</h2>}
      {resumeList.map((item, index) => (
        <DynamicResumeItem key={index} item={item} index={index} />
      ))}
    </section>
  );
}
