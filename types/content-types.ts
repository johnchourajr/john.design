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
  status?: "NEW" | "Coming Soon";
};
