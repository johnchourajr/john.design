import InlineLink from '@/components/fragments/InlineLink';
import { CoverMedia } from '@/components/journal/CoverMedia';
import { PostBody } from '@/components/journal/PostBody';
import { formatDate } from '@/lib/utils/formatDate';
import { PostData } from '@/types/content-types';
import clsx from 'clsx';
import { PostPageOuter } from './PostPageOuter';

interface PostPageProps {
  post: PostData;
}

export const PostPage = ({
  post: {
    markdown,
    frontmatter: { template, title, date, author, cover, videoCover },
  },
}: PostPageProps) => {
  if (!markdown) {
    return <div>Post not found</div>;
  }

  return (
    <PostPageOuter>
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
      <CoverMedia videoCover={videoCover} cover={cover} template={template} />
      <div className="mb-10">
        <p className="text-pretty text-body">
          Published {formatDate(date)} by {author || 'John Choura'}
        </p>
      </div>
      <PostBody markdown={markdown} />
    </PostPageOuter>
  );
};
