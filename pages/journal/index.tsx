import LinkGridItem from '@/components/fragments/LinkGridItem';
import { JustifiedHeadlineInner } from '@/components/justified-headline/JustifiedHeadlineInner';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { getAllPosts } from '@/lib/pages/posts';
import { formatDate } from '@/lib/utils/formatDate';
import { PostData } from '@/types/content-types';
import clsx from 'clsx';

type JournalPageProps = {
  posts: PostData[];
};

export default function JournalPage({ posts }: JournalPageProps) {
  return (
    <>
      <section className="my-[4vw] max-w-[100vw] overflow-hidden">
        <JustifiedHeadlineInner
          className={clsx('leading-[1] w-full font-black pointer-events-none')}
          headline={[
            {
              text: 'Journal',
              motionObject: getRandomParentAndChildClassesArray(8),
            },
          ]}
          iterations={8}
          letters={true}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-[10vw] px-4">
        {posts.map((item, i) => (
          <LinkGridItem
            key={item.slug}
            href={`/journal/${item.slug}`}
            title={item.frontmatter.title}
            description={formatDate(item.frontmatter.date)}
          />
        ))}
      </section>
    </>
  );
}

export function getStaticProps() {
  const posts = getAllPosts();

  return { props: { posts } };
}
