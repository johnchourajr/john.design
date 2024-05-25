import InlineLink from '@/components/fragments/InlineLink';
import { PostBody } from '@/components/journal/PostBody';
import { getAllPosts, getPostBySlug } from '@/lib/pages/posts';
import { formatDate } from '@/lib/utils/formatDate';
import { PostData } from '@/types/content-types';
import clsx from 'clsx';
import Image from 'next/image';

const PostPage = ({
  post: {
    markdown,
    frontmatter: { title, date, author, cover, videoCover },
  },
}: {
  post: PostData;
}) => {
  return (
    <article className="p-4">
      <InlineLink href="/journal" className="no-underline">
        <p className="my-4">
          &larr; <span>Back</span>
        </p>
      </InlineLink>
      <h1
        className={clsx(
          'headline-display-xl !normal-case !font-pixel !font-normal text-pretty',
        )}
      >
        {title}
      </h1>
      {videoCover ? (
        <div className="w-full my-6">
          <video
            src={videoCover}
            controls={false}
            muted={true}
            autoPlay={true}
            playsInline={true}
            loop={true}
            className="w-full overflow-hidden rounded border-[0.5px] border-[#ffffff30] select-none pointer-events-none"
          />
        </div>
      ) : (
        (cover && (
          <div className="w-full my-6">
            <Image
              src={cover}
              alt=""
              width={1200}
              height={600}
              sizes="(max-width: 640px) 100vw, 640px"
              className="w-full overflow-hidden rounded border-[0.5px] border-[#ffffff30] select-none pointer-events-none"
            />
          </div>
        )) ||
        null
      )}
      <div className="mb-10">
        <p className="text-pretty text-body">
          Published {formatDate(date)} by {author || 'John Choura'}
        </p>
      </div>
      <PostBody markdown={markdown} />
    </article>
  );
};

export async function getStaticPaths() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  const post = getPostBySlug(params.slug);
  return { props: { post } };
}

export default PostPage;
