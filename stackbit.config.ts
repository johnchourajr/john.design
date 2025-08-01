import { GitContentSource } from '@stackbit/cms-git';
import { defineStackbitConfig } from '@stackbit/types';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '20',
  devCommand: 'npm run dev -- --port {PORT} --hostname 0.0.0.0',
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['data/posts'],
      models: [
        {
          name: 'post',
          type: 'page',
          urlPath: '/journal/{slug}',
          filePath: 'data/posts/{slug}.md',
          fields: [
            {
              name: 'title',
              type: 'string',
              required: true,
              default: 'New Post',
            },
            {
              name: 'slug',
              type: 'slug',
              required: true,
            },
            {
              name: 'date',
              type: 'date',
              required: true,
            },
            {
              name: 'template',
              type: 'enum',
              options: ['post', 'page'],
              default: 'post',
            },
            {
              name: 'cover',
              type: 'image',
              description: 'Cover image for the post',
            },
            {
              name: 'videoCover',
              type: 'string',
              description: 'Video cover for the post',
            },
            {
              name: 'thumb',
              type: 'image',
              description: 'Thumbnail image',
            },
            {
              name: 'ogImage',
              type: 'image',
              description: 'Open Graph image for social sharing',
            },
            {
              name: 'refer',
              type: 'text',
              description: 'Reference text or footnotes',
            },
            {
              name: 'tags',
              type: 'list',
              items: { type: 'string' },
              default: [],
            },
            {
              name: 'hidden',
              type: 'boolean',
              default: false,
              description: 'Hide post from public listing',
            },
            {
              name: 'description',
              type: 'text',
              description: 'Post description/excerpt',
            },
          ],
        },
      ],
      assetsConfig: {
        referenceType: 'static',
        staticDir: 'public',
        uploadDir: 'journal-images/images',
        publicPath: '/',
      },
    }),
  ],
});
