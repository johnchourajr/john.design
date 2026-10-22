'use client';

import clsx from 'clsx';

import InlineLink from '@/components/fragments/InlineLink';
import Logo from '@/components/svg/logo';
import navData from '@/data/navData';
import { useIsProposalDetail } from '@/hooks/useIsProposalDetail';
import { NavSlash } from './NavSlash';

export function NavLeft() {
  const isProposalDetail = useIsProposalDetail();

  return (
    <div className="inline-flex row gap-6 items-center">
      <InlineLink
        href="/"
        className={clsx('z-50 relative')}
        title="Home link"
        aria-label="Home link"
      >
        <Logo />
      </InlineLink>

      <InlineLink
        href="/"
        className={clsx(
          'text-string relative',
          'z-50',
          'md:inline-flex hidden',
        )}
        underline={false}
      >
        John.Design™
      </InlineLink>

      {!isProposalDetail && <NavSlash />}
      {!isProposalDetail &&
        navData.map(({ href, title }: any, i: number) => (
          <InlineLink
            key={title}
            href={href}
            className={clsx(
              'text-string relative',
              'z-50',
              'inline-flex ',
            )}
            underline={false}
          >
            {title}
          </InlineLink>
        ))}
    </div>
  );
}
