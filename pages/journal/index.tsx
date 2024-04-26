import { JustifiedHeadlineInner } from '@/components/justified-headline/JustifiedHeadlineInner';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { getAllPosts } from '@/lib/pages/posts';
import clsx from 'clsx';

export default function JournalPage({ posts }: any) {
  // console.log('JournalPage', posts);

  return (
    <>
      <section className="my-[4vw]">
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
        <JustifiedHeadlineInner
          className={clsx('leading-[1] w-full font-black pointer-events-none')}
          headline={[
            {
              text: 'Coming Soon',
              motionObject: getRandomParentAndChildClassesArray(8),
              className:
                '!text-[1rem] lg:!text-[1vw] !tracking-wider uppercase',
            },
          ]}
        />
      </section>
    </>
  );
}

export function getStaticProps() {
  const posts = getAllPosts();

  return { props: { posts } };
}
