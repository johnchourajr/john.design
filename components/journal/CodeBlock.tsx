'use client';

import clsx from 'clsx';
import { domAnimation, LazyMotion, m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import codestyle from './codestyle';

export const CodeBlock = ({
  children,
  language,
}: {
  children: string;
  language: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setShowButton(height > 600);
    }
  }, [children]);

  return (
    <LazyMotion features={domAnimation}>
      <div className={'relative'}>
        <m.div
          ref={contentRef}
          className={clsx('overflow-hidden')}
          variants={{
            hidden: { height: showButton ? 600 : 'auto' },
            visible: { height: 'auto' },
          }}
          initial="hidden"
          animate={isExpanded ? 'visible' : 'hidden'}
        >
          <SyntaxHighlighter PreTag="div" language={language} style={codestyle}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </m.div>
        {showButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={clsx(
              'absolute w-full bottom-0 left-0 right-0 text-root p-4 text-right text-string cursor-pointer border-none',
              !isExpanded && 'bg-gradient-to-t from-black to-transparent',
            )}
          >
            <span className="bg-black backdrop-blur p-1 px-2 rounded-md border-1 border-root">
              {isExpanded ? 'Show less' : 'Show more'}
            </span>
          </button>
        )}
      </div>
    </LazyMotion>
  );
};
