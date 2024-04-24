import { Typography } from "@/components/Typography";
import { HomePageData } from "@/data/homepageContent";

export type ResumeSectionProps = HomePageData["resumeSection"];

export function ResumeSection({ title, resumeList }: ResumeSectionProps) {
  return (
    <>
      <section>
        {resumeList.map((item, index) => (
          <Typography key={index} tag="p">
            {item.title}
            {item.role}
            {item.company}
            {item.url}
          </Typography>
        ))}
      </section>
    </>
  );
}
