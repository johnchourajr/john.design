import { wrapLettersInSpansWithWordsInSpans } from '@/lib/utils/wrapInSpans';
import { SectionStructure } from '@/types/content-types';
import { m, useTransform } from 'motion/react';
import { ParentheticalChunk } from '../../fragments/ParentheticalChunk';

export function RolesItem({
  rolesSection,
  index,
  item,
  scrollYProgress,
}: {
  rolesSection: SectionStructure;
  index: number;
  item: string | { text: string };
  scrollYProgress: any;
}) {
  const list = rolesSection?.text || [];
  const calc = -index / list.length - 0.1;
  const opacity = useTransform(scrollYProgress, [0, 1], [calc, 1]);

  return typeof item === 'string' ? (
    <m.span key={index} style={{ opacity }}>
      {wrapLettersInSpansWithWordsInSpans({
        text: item,
        layout: false,
        className: 'mx-[0.1em] inline-block',
        letterClassName: 'inline-flex',
        letterInitial: 'initial',
        letterWhileHover: 'hover',
        letterTransition: { duration: 0.05, ease: 'easeOut' },
      })}
    </m.span>
  ) : (
    <m.span key={index} style={{ opacity }}>
      <ParentheticalChunk key={index} text={item.text} />
    </m.span>
  );
}
