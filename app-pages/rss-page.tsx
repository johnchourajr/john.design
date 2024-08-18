'use client';

import InlineLink from '@/components/fragments/InlineLink';
import { format } from 'date-fns';
import parse from 'html-react-parser';

const RSSFeedStyle = () => (
  <style global jsx>{`
    .subscription-widget-wrap {
      display: none;
    }
  `}</style>
);

export default function RSSFeed({ feed }: any) {
  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      {feed.map((item: any) => (
        <div key={item.link}>
          <a
            className="my-8"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>{item.title}</p>
          </a>
          <p className="my-8">{format(new Date(item.pubDate), 'PP')}</p>
          <div className="my-8 max-w-[500px]">
            {parse(item['content:encoded'])}
          </div>
        </div>
      ))}
      <RSSFeedStyle />
    </>
  );
}
