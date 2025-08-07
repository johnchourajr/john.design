'use client';

import { ResumeItem } from '@/components/slices/ResumeSection/ResumeItem';
import { HomePageData } from '@/data/homepageContent';

export type ResumeSectionProps = HomePageData['resumeSection'];

export function ResumeSection({ title, resumeList }: ResumeSectionProps) {
  return (
    <section className="my-[6vw] px-6 grid auto-rows-fr items-start overflow-hidden">
      {title && <h2>{title}</h2>}
      {resumeList.map((item, index) => (
        <ResumeItem key={index} item={item} index={index} />
      ))}
    </section>
  );
}
