import { Transition, m, type VariantLabels, type Variants } from 'motion/react';

import { slugify } from './slugify';

type SpanProps = {
  text: string;
  className?: string;
  layout?: boolean;
};

type SpanPropsWithVariants = SpanProps & {
  letterClassName?: string;
  wordInitial?: VariantLabels;
  wordWhileHover?: VariantLabels;
  letterInitial?: VariantLabels;
  letterWhileHover?: VariantLabels;
  wordVariants?: Variants;
  letterVariants?: Variants;
  letterTransition?: Transition;
};

export function wrapWordsInSpans({ text, className, layout }: SpanProps) {
  return (
    text &&
    text.split(' ').map((word, index) => (
      <m.span
        key={index}
        data-word={slugify(`${word} ${index}`)}
        className={className}
        layout={layout}
      >
        {word}{' '}
      </m.span>
    ))
  );
}

export function WrapWords(props: SpanProps) {
  return <>{wrapWordsInSpans(props)}</>;
}

export function wrapLettersInSpans({ text, className, layout }: SpanProps) {
  return (
    text &&
    text.split('').map((letter, index) => (
      <m.span
        key={index}
        data-letter={slugify(`${letter} ${index}`)}
        className={className}
        layout={layout}
      >
        {letter}
      </m.span>
    ))
  );
}

export function WrapLetter(props: SpanProps) {
  return <>{wrapLettersInSpans(props)}</>;
}

export function wrapLettersInSpansWithWordsInSpans({
  text,
  className,
  letterClassName,
  layout,
  wordInitial,
  wordWhileHover,
  wordVariants,
  letterInitial,
  letterWhileHover,
  letterVariants,
  letterTransition,
}: SpanPropsWithVariants) {
  return (
    text &&
    text.split(' ').map((word, wi) => (
      <m.span
        key={slugify(word)}
        data-word={slugify(word)}
        className={className}
        initial={wordInitial}
        whileHover={wordWhileHover}
        variants={wordVariants}
        layout={layout}
      >
        {word &&
          word.split('').map((letter, li) => (
            <m.span
              key={slugify(`${word} ${letter} ${li}`)}
              data-letter={slugify(`${word} ${letter} ${li}`)}
              className={letterClassName}
              initial={letterInitial}
              whileHover={letterWhileHover}
              layout={layout}
            >
              <m.span variants={letterVariants} transition={letterTransition}>
                {letter}
              </m.span>
            </m.span>
          ))}{' '}
      </m.span>
    ))
  );
}

export function WrapLetterWords(props: SpanPropsWithVariants) {
  return <>{wrapLettersInSpansWithWordsInSpans(props)}</>;
}
