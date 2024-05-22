import clsx from 'clsx';
import { Children, ReactElement, isValidElement } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import rehypeRaw from 'rehype-raw';

import codestyle from './codestyle';
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
  p({ children }) {
    return <CustomParagraph>{children}</CustomParagraph>;
  },
  img({ src, alt }) {
    return (
      <img
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
      <SyntaxHighlighter
        PreTag="div"
        children={String(children).replace(/\n$/, '')}
        language={match[1]}
        style={codestyle}
      />
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
