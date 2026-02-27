'use client';

import { useDrawing } from '@/components/experimental/Drawing';
import { formatDate } from '@/lib/utils/formatDate';
import { ProposalData } from '@/types/content-types';
import clsx from 'clsx';
import { useEffect } from 'react';

import { ProposalBody } from './ProposalBody';

interface ProposalPageProps {
  proposal: ProposalData;
}

export function ProposalPage({
  proposal: {
    markdown,
    frontmatter: { title, client, date },
  },
}: ProposalPageProps) {
  const { setEnableDrawing } = useDrawing();

  useEffect(() => {
    setEnableDrawing(false);
    return () => {
      setEnableDrawing(true);
    };
  }, [setEnableDrawing]);

  if (!markdown) {
    return <div>Proposal not found</div>;
  }

  return (
    <article className="p-4 text-white pb-40">
      <div className="flex flex-col gap-3 py-20 mt-10">
        <p className="headline-display-xs text-white">{client}</p>
        <h1
          className={clsx(
            'headline-display-xl !normal-case !font-pixel !font-normal text-pretty max-w-[10em] text-white',
          )}
        >
          {title}
        </h1>
        <p className="text-body text-white">{formatDate(date)}</p>
      </div>
      <ProposalBody markdown={markdown} />
    </article>
  );
}
