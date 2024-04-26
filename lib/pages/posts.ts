import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDirectory = join(process.cwd(), "data", "posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Simplified date handling using JavaScript's built-in methods
  const date = new Date(data.date).toISOString();

  // Use marked directly for Markdown conversion to HTML
  const htmlContent = marked(content);

  // Calculate excerpt and reading time directly
  const excerpt = htmlContent.slice(0, 160) + "..."; // Assuming HTML content can be excerpted directly
  const wordCount = content.split(/\s+/).length;
  const timeToRead = Math.ceil(wordCount / 200); // Average reading speed

  return {
    slug: realSlug,
    frontmatter: { ...data, date },
    excerpt,
    wordCount,
    timeToRead,
    content: htmlContent, // Consider storing HTML if your application uses it directly
  };
}

export function getAllPosts() {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}
