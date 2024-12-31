import { PostData, PostSlug } from '@/types/content-types';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const postsDirectory = join(process.cwd(), 'data', 'posts');

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
}

export function getPostBySlug(slug: PostSlug): PostData {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content: markdown } = matter(fileContents);

  const {
    title = 'Default Title',
    date = new Date().toISOString(),
    template = 'default',
    cover = null,
    videoCover = null,
    thumb = null,
    ogImage = null,
    refer = null,
    tags = [],
    hidden = false,
    description = '',
  } = data;

  const wordCount = markdown.split(/\s+/).length;
  const timeToRead = Math.ceil(wordCount / 200);

  return {
    slug: realSlug,
    frontmatter: {
      title,
      date: new Date(date).toISOString(),
      template,
      cover,
      videoCover,
      thumb,
      ogImage,
      refer,
      tags,
      hidden,
      description,
      slug: realSlug,
    },
    wordCount,
    timeToRead,
    markdown,
  };
}

export function getAllPosts(): PostData[] {
  const isProduction = process.env.NODE_ENV === 'production';

  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post) => !isProduction || !post.frontmatter.hidden)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}
