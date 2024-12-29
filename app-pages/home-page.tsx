import { HomepageHero } from '@/components/slices/HomepageHero';
import { homepageContent } from '@/data/homepageContent';
import dynamic from 'next/dynamic';

const PillBlockList = dynamic(() =>
  import('@/components/slices/PillBlockList').then((mod) => mod.PillBlockList),
);

const ResumeSection = dynamic(() =>
  import('@/components/slices/ResumeSection').then((mod) => mod.ResumeSection),
);

type HomePageProps = {
  heroSection: typeof homepageContent.heroSection;
  rolesSection: typeof homepageContent.rolesSection;
  personalSection: typeof homepageContent.personalSection;
  resumeSection: typeof homepageContent.resumeSection;
};

export default function HomePage({
  heroSection,
  rolesSection,
  personalSection,
  resumeSection,
}: HomePageProps) {
  return (
    <>
      <HomepageHero heroSection={heroSection} rolesSection={rolesSection} />
      <PillBlockList {...personalSection} />
      <ResumeSection {...resumeSection} />
    </>
  );
}
