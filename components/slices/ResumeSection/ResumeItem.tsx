'use client';

import SvgGoDaddy from '@/components/svg/SvgGoDaddy';
import SvgHappyMoney from '@/components/svg/SvgHappyMoney';
import SvgPayPal from '@/components/svg/SvgPayPal';
import SvgRetool from '@/components/svg/SvgRetool';
import { WrapLetterWords, WrapWords } from '@/lib/utils/wrapInSpans';
import clsx from 'clsx';
import { m, useScroll } from 'motion/react';
import Link from 'next/link';
import {
  ComponentType,
  SVGProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export function ResumeItem({ item, index }: { item: any; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'end 85%'],
  });

  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Static positions - always the same order for SSR/hydration consistency
  const basePositions = [
    'justify-start',
    'justify-around',
    'justify-center',
    'justify-end',
  ];

  const [positions, setPositions] = useState(basePositions);

  useEffect(() => {
    // Mark as mounted to enable client-side animations
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Don't run until after hydration

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
  }, [isHovering, isMounted]);

  const logoMapping: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    GoDaddy: SvgGoDaddy,
    'Happy Money': SvgHappyMoney,
    PayPal: SvgPayPal,
    Retool: SvgRetool,
  };
  const LogoComponent = logoMapping[item.company];

  // Cache the justify value to prevent multiple calls returning different values
  const justifyClass = useMemo(() => {
    // Use index to ensure consistent server/client rendering
    const determinedIndex = index % positions.length;
    return positions[determinedIndex];
  }, [positions, index]);

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
          justifyClass,
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
          className={clsx('h-[.85em] flex mr-[.1em]', justifyClass)}
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
