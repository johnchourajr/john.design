'use client';

import clsx from 'clsx';
import { Children, isValidElement, ReactElement, useEffect, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { CodeBlock } from '@/components/journal/CodeBlock';
import styles from '@/components/journal/journal.module.css';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2]
      .replace(/\*\*/g, '')
      .replace(/[*_`]/g, '')
      .replace(/—.*$/, '')
      .trim();
    items.push({
      id: slugify(match[2].replace(/\*\*/g, '').replace(/[*_`]/g, '').trim()),
      text,
      level: match[1].length,
    });
  }
  return items;
}

const isImageNode = (node: ReactElement<any>): boolean => {
  return node.props.src && typeof node.props.src === 'string';
};

const CustomParagraph: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const imageChildren = Children.toArray(children).filter(
    (child) =>
      isValidElement(child) && isImageNode(child as ReactElement<any>),
  );

  if (imageChildren.length > 0) {
    return <>{imageChildren}</>;
  }

  return <p>{children}</p>;
};

function getChildText(children: React.ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') return child;
      if (isValidElement(child)) {
        const props = child.props as Record<string, any>;
        if (props.children) return getChildText(props.children);
      }
      return '';
    })
    .join('');
}

function HeadingWithId({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) {
  const text = getChildText(children);
  const id = slugify(text);

  if (level === 2) {
    return (
      <h2 id={id} className="scroll-mt-20">
        {children}
      </h2>
    );
  }

  return (
    <h3 id={id} className="scroll-mt-20">
      {children}
    </h3>
  );
}

const components: Partial<Components> = {
  ul({ children }) {
    return <ul>{children}</ul>;
  },
  ol({ children }) {
    return <ol>{children}</ol>;
  },
  li({ children }) {
    return <li>{children}</li>;
  },
  p({ children }) {
    return <CustomParagraph>{children}</CustomParagraph>;
  },
  h2({ children }) {
    return <HeadingWithId level={2}>{children}</HeadingWithId>;
  },
  h3({ children }) {
    return <HeadingWithId level={3}>{children}</HeadingWithId>;
  },
  hr() {
    return <hr className="!border-t-white/10" />;
  },
  code(props) {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
    ) : (
      <code {...rest} className={className}>
        {children}
      </code>
    );
  },
};

function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  function handleClick(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <nav className="hidden md:block md:col-start-1 md:col-span-2 md:row-start-1 sticky top-20 self-start pr-4">
      <p className="text-caption uppercase tracking-widest text-white/30 mb-4">
        Contents
      </p>
      <ul className="space-y-2 list-none pl-0">
        {items.map(({ id, text, level }) => (
          <li key={id} className="!pl-0 !mb-0">
            <button
              onClick={() => handleClick(id)}
              className={clsx(
                'text-left text-caption transition-colors duration-200 leading-snug cursor-pointer',
                level === 3 && 'ml-3',
                activeId === id
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70',
              )}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface ProposalBodyProps {
  markdown: string;
}

export function ProposalBody({ markdown }: ProposalBodyProps) {
  const tocItems = extractToc(markdown);

  return (
    <div className={clsx(styles.postBody, 'grid text-white')}>
      <TableOfContents items={tocItems} />
      <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
