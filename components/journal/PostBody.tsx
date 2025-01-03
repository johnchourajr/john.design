import clsx from 'clsx';
import Image from 'next/image';
import { Children, ReactElement, isValidElement } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { CodeBlock } from './CodeBlock';
import styles from './journal.module.css';

export type PostBodyProps = {
  markdown: string;
};

const isImageNode = (node: ReactElement): boolean => {
  return node.props.src && typeof node.props.src === 'string';
};

const CustomParagraph: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const imageChildren = Children.toArray(children).filter(
    (child) => isValidElement(child) && isImageNode(child as ReactElement),
  );

  if (imageChildren.length > 0) {
    return <>{imageChildren}</>;
  }

  return <p>{children}</p>;
};

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
  img({ src, alt }) {
    return (
      <Image
        src={src || ''}
        alt={alt || ''}
        sizes="(max-width: 640px) 100vw, 640px"
        className={styles.postImage}
        width={1200}
        height={1200}
      />
    );
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

export function PostBody({ markdown }: PostBodyProps) {
  return (
    <div className={clsx(styles.postBody, 'grid')}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
