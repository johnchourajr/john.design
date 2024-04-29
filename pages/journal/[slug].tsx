import InlineLink from '@/components/InlineLink';
import { PostBody } from '@/components/journal/PostBody';
import { getAllPosts, getPostBySlug } from '@/lib/pages/posts';
import clsx from 'clsx';

const PostPage = ({
  post: {
    htmlContent,
    frontmatter: { title, date, ...frontmatter },
    ...post
  },
}: any) => {
  console.log({
    title,
    date,
    frontmatter,
    post,
  });

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
      <div className="w-full my-6">
        <img
          src={frontmatter.cover}
          className="w-full overflow-hidden rounded border-[0.5px] border-[#ffffff30] select-none pointer-events-none"
        />
      </div>
      <PostBody html={htmlContent} />
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
