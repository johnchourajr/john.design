export type MotionObject = {
  parent: string;
  child: string;
}[];

export type TextStructure = {
  text: string;
  motionObject?: MotionObject;
  className?: string;
  size?: string;
};

export type TextList = (string | TextStructure)[];

export type SectionStructure = {
  title?: string;
  text?: TextList;
  list?: string[];
};

export type PageItem = {
  title: string;
  description?: string;
  href?: string;
  slug?: string;
  className?: string;
  status?: 'NEW' | 'Coming Soon';
};

export type PostFrontMatter = {
  title: string;
  date: string; // date as ISO string
  [key: string]: any; // Add this to allow for any other dynamic keys in the front matter
};

export type PostData = {
  slug: string;
  frontmatter: PostFrontMatter;
  wordCount: number;
  timeToRead: number;
  content: string; // This is the HTML content generated from markdown
};

export type PostSlug = string;
