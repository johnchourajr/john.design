'use client';

import InlineLink from '@/components/fragments/InlineLink';
import { useDrawing } from '@/components/experimental/Drawing';
import { formatDate } from '@/lib/utils/formatDate';
import { ProposalData } from '@/types/content-types';
import { useEffect } from 'react';

import { PasswordGate } from './PasswordGate';

interface ProposalsIndexProps {
  proposals: ProposalData[];
  hasAccess: boolean;
}

export function ProposalsIndex({
  proposals,
  hasAccess,
}: ProposalsIndexProps) {
  const { setEnableDrawing } = useDrawing();

  useEffect(() => {
    setEnableDrawing(false);
    return () => {
      setEnableDrawing(true);
    };
  }, [setEnableDrawing]);

  return (
    <div className="p-4">
      <h1 className="headline-display-xl !normal-case !font-pixel !font-normal text-pretty max-w-[10em] mb-10">
        Proposals
      </h1>
      <PasswordGate hasAccess={hasAccess}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proposals.map((proposal) => (
            <InlineLink
              key={proposal.slug}
              href={`/proposals/${proposal.slug}`}
              underline={false}
              showArrow={false}
              className="no-underline"
            >
              <div className="border border-white/10 rounded p-6 hover:border-white/30 transition-colors duration-200 group">
                <p className="text-caption uppercase tracking-widest text-white/40 mb-2">
                  {proposal.frontmatter.client}
                </p>
                <p className="text-paragraph font-bold group-hover:text-root transition-colors duration-200">
                  {proposal.frontmatter.title}
                </p>
                {proposal.frontmatter.description && (
                  <p className="text-caption text-white/50 mt-2">
                    {proposal.frontmatter.description}
                  </p>
                )}
                <p className="text-caption text-white/30 mt-4">
                  {formatDate(proposal.frontmatter.date)}
                </p>
              </div>
            </InlineLink>
          ))}
        </div>
      </PasswordGate>
    </div>
  );
}
