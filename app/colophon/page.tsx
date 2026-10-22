import ColophonPage from '@/app-pages/colophon-page';
import { colophonData } from '@/data/colophonContent';
import { pageMetadata } from '@/data/metadata';

export const metadata = pageMetadata({
  title: colophonData.title,
  description: colophonData.summary,
  path: '/colophon',
});

export default function Page() {
  const {
    title,
    description,
    summary,
    dependencies,
    devDependencies,
    fontsCss,
  } = colophonData;

  return (
    <ColophonPage
      title={title}
      description={description}
      summary={summary}
      dependencies={dependencies}
      devDependencies={devDependencies}
      fontsCss={fontsCss}
    />
  );
}
