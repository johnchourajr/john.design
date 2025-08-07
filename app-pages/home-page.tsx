import { HomepageHero } from '@/components/slices/HomepageHero';
import { PillBlockList } from '@/components/slices/PillBlockList';
import { ResumeSection } from '@/components/slices/ResumeSection';
import { homepageContent } from '@/data/homepageContent';

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
