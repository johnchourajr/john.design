import { PostData, PostSlug } from '@/types/content-types';
import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import { join } from 'path';

const postsDirectory = join(process.cwd(), 'data', 'posts');

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
}

export function getPostBySlug(slug: PostSlug): PostData {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const { title = 'Default Title', date = new Date().toISOString() } = data;

  const htmlContent = marked(content) as string;
  const wordCount = content.split(/\s+/).length;
  const timeToRead = Math.ceil(wordCount / 200);

  return {
    slug: realSlug,
    frontmatter: { title, date: new Date(date).toISOString() },
    wordCount,
    timeToRead,
    content: htmlContent,
  };
}

export function getAllPosts(): PostData[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}