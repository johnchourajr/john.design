import JournalArchiveGridItem from '@/components/fragments/JournalArchiveGridItem';
import JournalGridItem from '@/components/fragments/JournalGridItem';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { formatDate } from '@/lib/utils/formatDate';
import { PostData } from '@/types/content-types';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

const DynamicJustifiedHeadlineInner = dynamic(() =>
  import('@/components/justified-headline').then(
    (mod) => mod.JustifiedHeadlineInner,
  ),
);

type JournalPageProps = {
  posts: PostData[];
};

export default function JournalPage({ posts }: JournalPageProps) {
  const archivePosts = posts.filter(
    (post) => new Date(post.frontmatter.date) < new Date('2024-01-01'),
  );
  const recentPosts = posts.filter(
    (post) => new Date(post.frontmatter.date) >= new Date('2024-01-01'),
  );

  return (
    <>
      <section className="my-[4vw] max-w-[100vw] overflow-hidden">
        <DynamicJustifiedHeadlineInner
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

      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 my-[10vw] px-4">
        <h2 className="text-string col-span-full">The latest</h2>
        {recentPosts.map((item, i) => (
          <JournalGridItem
            key={item.slug}
            href={`/journal/${item.slug}`}
            title={item.frontmatter.title}
            description={formatDate(item.frontmatter.date)}
            tags={item.frontmatter.tags}
            {...item}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-[10vw] px-4">
        <div className="col-span-full grid grid-cols-subgrid border-b border-root">
          <h2 className="text-string col-span-1 mb-2">The archive</h2>
          <div className="grid grid-cols-subgrid md:col-span-2">
            <p className="col-span-1 text-body text-left indent-[6em] group max-w-[35em] cursor-help z-50 relative pointer-events-none mb-4">
              These are some of my older writings, reflections and musings along
              my journey and growth over the years. They represent important
              steps in my evolution as both a person and citizen of the
              internet.
            </p>
          </div>
        </div>
        {archivePosts.map((item, i) => (
          <JournalArchiveGridItem
            key={item.slug}
            href={`/journal/${item.slug}`}
            title={item.frontmatter.title}
            description={formatDate(item.frontmatter.date)}
            tags={item.frontmatter.tags}
            {...item}
          />
        ))}
      </section>
    </>
  );
}
