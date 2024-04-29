import { HomepageHero } from '@/components/slices/HomepageHero';
import { PillBlockList } from '@/components/slices/PillBlockList';
import { ResumeSection } from '@/components/slices/ResumeSection';
import { homepageContent } from '@/data/homepageContent';

export default function HomePage() {
  const { heroSection, rolesSection, personalSection, resumeSection } =
    homepageContent;

  return (
    <>
      <HomepageHero heroSection={heroSection} rolesSection={rolesSection} />
      <PillBlockList {...personalSection} />
      <ResumeSection {...resumeSection} />
    </>
  );
}
