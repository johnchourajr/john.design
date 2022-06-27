import React from "react";

/**
 * Headline component
 */
interface HeadlineProps {
  size?: string;
  display?: boolean;
  children: React.ReactNode;
  funky?: boolean;
}
export function Headline({
  children,
  display,
  size,
  funky,
  ...rest
}: HeadlineProps) {
  return (
    <p className={size} data-display={display} data-funky={funky} {...rest}>
      {children}
    </p>
  );
}

/**
 * Paragraph component
 */
interface ParagraphProps {
  children: React.ReactNode;
}
export function Paragraph({ children, ...rest }: ParagraphProps) {
  return <p {...rest}>{children}</p>;
}

/**
 * Caption component
 */
interface CaptionProps {
  children: React.ReactNode;
}
export function Caption({ children, ...rest }: CaptionProps) {
  return (
    <p className="caption" {...rest}>
      {children}
    </p>
  );
}
