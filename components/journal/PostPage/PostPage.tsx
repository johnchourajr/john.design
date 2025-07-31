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
    filePath,
    frontmatter: {
      template,
      title,
      date,
      author,
      cover,
      videoCover,
      description,
      slug,
    },
  },
}: PostPageProps) => {
  if (!markdown) {
    return <div>Post not found</div>;
  }

  const schemaOrgJSONLD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: date,
    dateModified: date, // Add if you track modifications
    image: cover || videoCover,
    description: description,
    url: `https://john.design/journal/${slug}`,
    author: {
      '@type': 'Person',
      name: author || 'John Choura',
      url: 'https://john.design',
    },
    publisher: {
      '@type': 'Person',
      '@id': 'https://john.design/#person',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://john.design/journal/${slug}`,
    },
  };

  return (
    <PostPageOuter data-sb-object-id={filePath}>
      <InlineLink href="/journal" className="no-underline" underline={false}>
        <p className="my-4">
          &larr; <span>Back</span>
        </p>
      </InlineLink>
      <h1
        className={clsx(
          'headline-display-xl !normal-case !font-pixel !font-normal text-pretty max-w-[10em]',
        )}
        data-sb-field-path="title"
      >
        {title}
      </h1>
      <CoverMedia
        videoCover={videoCover}
        cover={cover}
        template={template}
        data-sb-field-path="cover"
      />
      <div className="mb-10">
        <p className="text-pretty text-body">
          Published <span data-sb-field-path="date">{formatDate(date)}</span> by{' '}
          {author || 'John Choura'}
        </p>
      </div>
      <div data-sb-field-path="markdown_content">
        <PostBody markdown={markdown} />
      </div>
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </PostPageOuter>
  );
};
