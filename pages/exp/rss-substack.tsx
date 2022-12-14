import Link from "next/link";
import InlineLink from "../../components/InlineLink";
import { getFeed } from "../../lib/rss";
import { format } from "date-fns";

/**
 * To Do
 * [ ] Add RSS feed from https://johnchoura.substack.com/feed using method on https://andreaskeller.name/blog/nextjs-rss-reader
 */

export default function SeeScroll({ feed, items }: any) {
  console.log(items);

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      {items.map((item: any) => (
        <a
          key={item.link}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="my-8">{item.title}</div>
        </a>
      ))}
    </>
  );
}

export async function getStaticProps({}) {
  const feed = "https://johnchoura.substack.com/feed";
  const detailedFeed = await getFeed(feed);

  return {
    props: {
      feed,
      items: detailedFeed.items,
    },
    revalidate: 1,
  };
}
