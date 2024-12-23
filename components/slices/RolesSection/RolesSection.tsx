import { SectionStructure } from '@/types/content-types';
import clsx from 'clsx';
import { useScroll } from 'framer-motion';
import { useRef } from 'react';
import { useDrawing } from '../../Drawing';
import { RolesItem } from './RolesItem';

export function RolesSection({
  rolesSection,
}: {
  rolesSection: SectionStructure;
}) {
  const ref = useRef(null);
  const { enableDrawing } = useDrawing();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 100%', 'end 95%'],
  });

  return (
    <div
      className={clsx(
        'inline-flex items-center flex-col p-4 gap-6 justify-center w-full relative z-[100] mb-[8vw]',
        'relative z-10',
        enableDrawing && 'select-none',
      )}
    >
      <p
        ref={ref}
        className="headline-display-xl !normal-case !font-pixel !font-normal text-center items-center leading-tight"
      >
        {rolesSection?.text?.map((item, index) => {
          return (
            <RolesItem
              key={index}
              index={index}
              item={item}
              rolesSection={rolesSection}
              scrollYProgress={scrollYProgress}
            />
          );
        })}
      </p>
    </div>
  );
}
