import clsx from 'clsx';
import Image from 'next/image';
import { Children, ReactElement, isValidElement } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import {
  getMediaSize,
  getVideoSources,
  isVideoSrc,
} from '@/lib/pages/journal-media';
import { mediaUrl } from '@/lib/media/hosted';

import { CodeBlock } from './CodeBlock';
import { LoopingVideo } from './LoopingVideo';
import styles from './journal.module.css';

export type PostBodyProps = {
  markdown: string;
};

const isImageNode = (node: ReactElement<any>): boolean => {
  return node.props.src && typeof node.props.src === 'string';
};

/**
 * The rendered width of a post image, from its layout hint in the alt text
 * (see `.postImage` in journal.module.css): xs and aside take two of the four
 * columns, sm three, everything else the full width.
 */
const imageSizes = (alt?: string): string => {
  if (alt === 'xs' || alt === 'aside') return '50vw';
  if (alt === 'sm') return '75vw';
  return '100vw';
};

const CustomParagraph: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const imageChildren = Children.toArray(children).filter(
    (child) => isValidElement(child) && isImageNode(child as ReactElement<any>),
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
    const imageSrc = mediaUrl(typeof src === 'string' ? src : '');
    const size = getMediaSize(imageSrc);

    // Animated GIFs are shipped as looping video, see #87.
    if (isVideoSrc(imageSrc)) {
      return (
        <LoopingVideo
          sources={getVideoSources(imageSrc)}
          width={size?.width}
          height={size?.height}
          size={alt || undefined}
          className={styles.postImage}
        />
      );
    }

    if (!size || /\.(gif|svg)(\?.*)?$/i.test(imageSrc)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt || ''}
          width={size?.width}
          height={size?.height}
          className={styles.postImage}
          loading="lazy"
          decoding="async"
        />
      );
    }

    return (
      <Image
        src={imageSrc}
        alt={alt || ''}
        width={size.width}
        height={size.height}
        sizes={imageSizes(alt)}
        className={styles.postImage}
      />
    );
  },
  iframe(props) {
    const { node, ...rest } = props;
    // Embeds sit far down long posts; don't fetch them with the page.
    return <iframe {...rest} loading={rest.loading ?? 'lazy'} />;
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
