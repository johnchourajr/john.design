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

/** Day-job work, or work made on my own time (the work page, #128). */
export type WorkLight = 'daylight' | 'moonlight';

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
  /** The work page's opening paragraph for an open project (#128). */
  overview?: string;
  /** What the project delivered, listed under the overview. */
  deliverables?: string[];
  /** Shown in place of the site link when the site is no longer live. */
  siteNote?: string;
  /**
   * The work page's frames for an open project, in order: file names in
   * `.media/work-images/<slug>/`, uploaded to R2 (#128).
   */
  media?: string[];
  /** Day job or own time; the work page labels each row with it. */
  light?: WorkLight;
  /** Which of `media` shows beside the cursor on hover; the first image by default. */
  hoverImage?: string;
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
};

export type PostSlug = string;

export type ProposalFrontMatter = {
  title: string;
  client: string;
  date: string;
  description?: string;
  themeColor?: string;
  themeBackground?: string;
  slug: string;
};

export type ProposalData = {
  slug: string;
  frontmatter: ProposalFrontMatter;
  markdown: string;
};

export type ProposalSlug = string;
