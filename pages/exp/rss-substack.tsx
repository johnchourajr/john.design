import Link from 'next/link';
import InlineLink from '../../components/InlineLink';

/**
 * To Do
 * [ ] Add RSS feed from https://johnchoura.substack.com/feed using method on https://andreaskeller.name/blog/nextjs-rss-reader
 */

export default function SeeScroll() {
  return (
    <>
      <InlineLink href='/exp/' className='no-underline'>
        <h2 className='my-8'>
          &larr; <span className='underline'>Back</span>
        </h2>
      </InlineLink>
      Nothing to see here yet.
    </>
  );
}
