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
    <article className="p-4 text-white">
      <div className="mb-10 pt-8">
        <p className="text-body text-white/50 mb-2">{client}</p>
        <h1
          className={clsx(
            'headline-display-xl !normal-case !font-pixel !font-normal text-pretty max-w-[10em] text-white',
          )}
        >
          {title}
        </h1>
        <p className="text-body text-white/50 mt-4">{formatDate(date)}</p>
      </div>
      <div>
        <ProposalBody markdown={markdown} />
      </div>
    </article>
  );
}
