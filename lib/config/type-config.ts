export type FontStyle = {
  id?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  size?: string;
  clamp?: number[] | null; // [min, max]
  lineHeight?: number;
  letterSpacing?: string;
  textTransform?: string;
};

export type TypeType = Record<string, FontStyle>;

const kmr = "var(--font-kmr-apparat), sans-serif";
const px = "var(--font-px-grotesk), sans-serif";
const tiempos = "var(--font-tiempos), serif";

const headlineShared = {
  fontFamily: kmr,
  fontWeight: 100,
  clamp: null,
  lineHeight: 1,
};

const headline: TypeType = {
  "display-xl": {
    id: "headline-display-xl",
    fontFamily: kmr,
    fontWeight: 300,
    clamp: [4.5, 11],
    lineHeight: 0.8,
    letterSpacing: "-0.05em",
  },
  "display-lg": {
    id: "headline-display-lg",
    fontFamily: kmr,
    fontWeight: 100,
    clamp: [3.5, 5.625],
    lineHeight: 1,
  },
  "display-md": {
    id: "headline-display-md",
    fontFamily: kmr,
    fontWeight: 100,
    clamp: [3, 4],
    lineHeight: 1,
  },
  xxl: {
    id: "headline-xxl",
    size: "3rem",
    ...headlineShared,
  },
  xl: {
    id: "headline-xl",
    size: "2.5rem",
    ...headlineShared,
  },
  lg: {
    id: "headline-lg",
    size: "2.25rem",
    ...headlineShared,
  },
  md: {
    id: "headline-md",
    size: "2rem",
    letterSpacing: "0.01em",
    ...headlineShared,
  },
  sm: {
    id: "headline-sm",
    size: "1.75rem",
    letterSpacing: "0.01em",
    ...headlineShared,
  },
  xs: {
    id: "headline-xs",
    size: "1.25rem",
    letterSpacing: "0.01em",
    ...headlineShared,
  },
};

const text: TypeType = {
  title: {
    id: "text-title",
    size: "1.5rem",
    lineHeight: 1.1,
    fontFamily: kmr,
    fontWeight: 300,
    letterSpacing: "0.01em",
  },
  blockquote: {
    id: "text-blockquote",
    size: "1.25rem",
    lineHeight: 1.5,
    fontFamily: tiempos,
    fontWeight: 400,
  },
  body: {
    id: "text-body",
    size: "1rem",
    lineHeight: 1.2,
    fontWeight: 300,
    fontFamily: px,
    letterSpacing: "0.01em",
  },
  "body-tiempos": {
    id: "text-body-tiempos",
    size: "1rem",
    lineHeight: 2,
    fontWeight: 400,
    fontFamily: tiempos,
  },
  "body-code": {
    id: "text-body-code",
    size: "1rem",
    lineHeight: 1.2,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  code: {
    id: "text-code",
    size: "0.875rem",
    lineHeight: 1.6,
    letterSpacing: "0.01em",
    fontFamily: "monospace",
  },
  "code-expression": {
    id: "text-code-expression",
    size: "0.75rem",
    lineHeight: 1,
    fontWeight: 200,
    fontFamily: px,
  },
  "string-sm": {
    id: "text-string-sm",
    size: "0.75rem",
    lineHeight: 1,
    fontWeight: 300,
    fontFamily: px,
    textTransform: "uppercase",
  },
  "string-md": {
    id: "text-string-md",
    size: "1rem",
    lineHeight: 1,
    fontWeight: 300,
    fontFamily: px,
    textTransform: "uppercase",
  },
  caption: {
    id: "text-caption",
    size: "0.75rem",
    lineHeight: 1.5,
    fontWeight: 300,
    letterSpacing: "0.01em",
    fontFamily: px,
  },
};

export { headline, text };
