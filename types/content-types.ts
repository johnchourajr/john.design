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
  tags?: string[];
  href?: string;
  externalHref?: string;
  slug?: string;
  className?: string;
  status?: 'NEW' | 'Coming Soon';
  date?: string;
};

export type PostFrontMatter = {
  title: string;
  date: string; // date as ISO string
  author?: string;
  template?: string;
  cover?: string;
  videoCover?: string;
  thumb?: string;
  ogImage?: string;
  refer?: string;
  tags?: string[];
  hidden?: boolean; // Add this line
  description?: string;
  slug: string;
};

export type PostData = {
  slug: string;
  frontmatter: PostFrontMatter;
  wordCount: number;
  timeToRead: number;
  markdown: string;
  filePath?: string; // Add this for Visual Editor annotations
};

export type PostSlug = string;
