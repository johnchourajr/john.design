import { posters } from '@/components/experimental/type-posters/posters';
import { TypePosterGallery } from '@/components/experimental/type-posters/TypePosterGallery';
import { ExpBackLink } from '@/components/experimental/ExpBackLink';

export default function Page() {
  return (
    <>
      <ExpBackLink />
      <h1 className="sr-only">Type Posters</h1>
      <TypePosterGallery
        posters={posters.map(({ slug, title, words, paper, concept }) => ({
          slug,
          title,
          words,
          paper,
          concept,
        }))}
      />
    </>
  );
}
