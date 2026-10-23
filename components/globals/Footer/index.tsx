'use client';

import { useDrawing } from '@/components/experimental/Drawing';
import { useIsProposalDetail } from '@/hooks/useIsProposalDetail';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import InlineLink from '../../fragments/InlineLink';
import Logo from '../../svg/logo';

export default function Footer() {
  const pathname = usePathname();
  const { isIframe } = useDrawing();

  const isProposalDetail = useIsProposalDetail();
  // The type posters' wall is the whole screen, with no page under it.
  const isFullscreen = pathname === '/exp/type-posters';

  if (isIframe || isProposalDetail || isFullscreen) return null;

  return (
    <>
      <footer
        className={clsx(
          'w-full flex flex-col gap-4 relative p-4 bg-black pt-10 mt-24 z-0 in-data-iframe:hidden',
          'border-t border-root',
        )}
      >
        <p className="text-body text-left indent-[6em] group max-w-[50em] cursor-help z-50 relative pointer-events-none">
          John Choura is working on the internet to rebuild his home on the ...
          internet. In other words, this site is being built in the open. Follow
          along by subscribing.
        </p>
        <p className="text-body text-left group max-w-[50em] cursor-help z-50 relative pointer-events-none">
          The internet is a wild place, stay safe out here.
        </p>

        {/* Wraps on a narrow phone rather than running off the side. */}
        <div className="inline-flex flex-wrap row gap-x-6 gap-y-3 items-center pt-10">
          <InlineLink href="/" aria-label="Home" className="z-50 relative">
            <Logo />
          </InlineLink>

          <InlineLink
            href="/"
            className={clsx(
              'z-50 headline-display-xs relative font-bold uppercase tracking-wider',
              'md:inline-flex hidden',
              '*:no-underline',
            )}
          >
            John.Design™
          </InlineLink>

          <InlineLink href="/contact">Contact</InlineLink>
          <InlineLink href="/colophon">Colophon</InlineLink>

          <div className="inline-flex flex-wrap row gap-x-4 gap-y-2 items-center">
            <p>Previous Versions:</p>
            <InlineLink href="https://v4.archive.john.design/?ref=v5" target="_blank">
              v4
            </InlineLink>
            <InlineLink
              href="http://v3.objectsubject.com/?ref=v5"
              target="_blank"
            >
              v3
            </InlineLink>
            <InlineLink
              href="http://v2.objectsubject.com/?ref=v5"
              target="_blank"
            >
              v2
            </InlineLink>
            <InlineLink
              href="http://v1.objectsubject.com/?ref=v5"
              target="_blank"
            >
              v1
            </InlineLink>
          </div>
        </div>
      </footer>
      <div className="z-50 flex flex-row fixed bottom-4 right-4 font-bold pointer-events-none">
        <InlineLink
          href={`https://github.com/johnchourajr/john.design/tree/main/app${
            pathname === '/' ? '' : pathname
          }/page.tsx`}
          target="_blank"
          aria-label="Link to source code"
          className={clsx(
            'text-title z-50 relative',
            'no-underline',
          )}
          underline={false}
          showArrow={false}
        >
          {'</>'}
        </InlineLink>
      </div>
    </>
  );
}
