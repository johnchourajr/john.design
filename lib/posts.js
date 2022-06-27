import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { parseISO, format } from "date-fns";
import { marked } from "marked";
import PlainTextRenderer from "../src/functions/marked-plaintext";

const postsDirectory = join(process.cwd(), "_data", "posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  /* Format date in order to order posts by date */
  const date = format(parseISO(data.date), "MMMM dd, yyyy");

  /* Use the PlainTextRenderer to render the content as plain text */
  const renderer = new PlainTextRenderer();
  const cleanContent = marked(content, { renderer });
  const exerpt = cleanContent.slice(0, 100) + "...";

  /* estimate time to read a post */
  const wordCount = cleanContent.split(" ").length;
  const timeToRead = Math.round(wordCount / 200);

  return {
    slug: realSlug,
    frontmatter: { ...data, date },
    exerpt,
    wordCount,
    timeToRead,
    content,
  };
}

export function getAllPosts() {
  const slugs = fs.readdirSync(postsDirectory);
  const slugArray = slugs.map((slug) => getPostBySlug(slug));

  const itemArray = slugArray.map((obj) => {
    const date = new Date(obj.frontmatter.date);
    const normalizeDate = Math.floor(date / 1000);
    return { ...obj, date: normalizeDate };
  });
  const posts = itemArray.sort(
    (objA, objB) => Number(objB.date) - Number(objA.date)
  );

  return posts;
}
