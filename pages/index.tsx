import { homepageContent } from "@/data/homepageContent";
import { ResumeSection } from "@/components/slices/ResumeSection";
import { PillBlockList } from "@/components/slices/PillBlockList";
import { HomepageHero } from "@/components/slices/HomepageHero";

export default function HomePage() {
  const { heroSection, rolesSection, personalSection, resumeSection } =
    homepageContent;

  return (
    <>
      <HomepageHero heroSection={heroSection} rolesSection={rolesSection} />
      <PillBlockList list={personalSection.list} />
      <ResumeSection resumeList={resumeSection.resumeList} />
    </>
  );
}
