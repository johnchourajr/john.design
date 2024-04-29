import { useDomPurify } from '@/lib/hooks/useDomPurify';
import clsx from 'clsx';
import styles from './journal.module.css';

export type PostBodyProps = {
  html: string;
};

export function PostBody({ html }: PostBodyProps) {
  const safeHtml = useDomPurify(html);

  return (
    <div
      className={clsx(styles.postBody, 'grid')}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
