import { ProposalData, ProposalSlug } from '@/types/content-types';
import { isValidThemeColor } from '@/lib/theme/theme-config';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const proposalsDirectory = join(process.cwd(), 'data', 'proposals');

export function getProposalSlugs(): string[] {
  return fs
    .readdirSync(proposalsDirectory)
    .filter((file) => file.endsWith('.md'));
}

export function getProposalBySlug(slug: ProposalSlug): ProposalData {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(proposalsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content: markdown } = matter(fileContents);

  const {
    title = 'Untitled Proposal',
    client = '',
    date = new Date().toISOString(),
    description = '',
    themeColor,
    themeBackground,
    background,
  } = data;
  const parsedThemeColor = isValidThemeColor(themeColor)
    ? themeColor.trim()
    : undefined;
  const parsedThemeBackground = isValidThemeColor(themeBackground)
    ? themeBackground.trim()
    : isValidThemeColor(background)
      ? background.trim()
      : undefined;

  return {
    slug: realSlug,
    frontmatter: {
      title,
      client,
      date: new Date(date).toISOString(),
      description,
      themeColor: parsedThemeColor,
      themeBackground: parsedThemeBackground,
      slug: realSlug,
    },
    markdown,
  };
}

export function getAllProposals(): ProposalData[] {
  return getProposalSlugs()
    .map((slug) => getProposalBySlug(slug))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}
