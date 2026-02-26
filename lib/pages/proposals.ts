import { ProposalData, ProposalSlug } from '@/types/content-types';
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
  } = data;

  return {
    slug: realSlug,
    frontmatter: {
      title,
      client,
      date: new Date(date).toISOString(),
      description,
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
