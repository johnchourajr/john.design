import { motion } from "framer-motion";

import { slugify } from "./slugify";
import { addStrongTags } from "@/components/justified-headline/utils";

type SpanProps = {
  text: string;
  className?: string;
  layout?: boolean;
};

export function wrapWordsInSpans({ text, className, layout }: SpanProps) {
  return (
    text &&
    text.split(" ").map((word, index) => (
      <motion.span
        key={index}
        data-word={slugify(`${word} ${index}`)}
        className={className}
        layout={layout}
      >
        {word}{" "}
      </motion.span>
    ))
  );
}

export function WrapWords(props: SpanProps) {
  return <>{wrapWordsInSpans(props)}</>;
}

export function wrapLettersInSpans({ text, className, layout }: SpanProps) {
  return (
    text &&
    text.split("").map((letter, index) => (
      <motion.span
        key={index}
        data-letter={slugify(`${letter} ${index}`)}
        className={className}
        layout={layout}
      >
        {letter}
      </motion.span>
    ))
  );
}

export function WrapLetter(props: SpanProps) {
  return <>{wrapLettersInSpans(props)}</>;
}

export function wrapLettersInSpansWithWordsInSpans({
  text,
  className,
  layout,
}: SpanProps) {
  return (
    text &&
    text.split(" ").map((word, wi) => (
      <motion.span
        key={wi}
        data-word={slugify(word)}
        className={className}
        layout={layout}
      >
        {word &&
          word.split("").map((letter, li) => (
            <motion.span
              key={li}
              data-letter={slugify(`${word} ${letter} ${li}`)}
              layout={layout}
            >
              {letter}
            </motion.span>
          ))}{" "}
      </motion.span>
    ))
  );
}

export function WrapLetterWords(props: SpanProps) {
  return <>{wrapLettersInSpansWithWordsInSpans(props)}</>;
}
