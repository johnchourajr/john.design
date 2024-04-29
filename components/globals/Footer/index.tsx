import clsx from 'clsx';
import { useRouter } from 'next/router';
import InlineLink from '../../fragments/InlineLink';
import Logo from '../../svg/logo';

export default function Footer() {
  const { pathname } = useRouter();

  return (
    <footer
      className={clsx(
        'w-full flex flex-col gap-4 relative p-4 bg-black pt-10 mt-24',
        'border-t border-root',
      )}
    >
      <p className="text-body text-left indent-[6em] group max-w-[50em] cursor-help z-50 relative pointer-events-none">
        John Choura is working on the inernet to rebuild his home on the ...
        internet. In other words, this site is being built in the open. Follow
        along by subscribing.
      </p>
      <p className="text-body text-left group max-w-[50em] cursor-help z-50 relative pointer-events-none">
        The internet is a wild place, stay safe out here.
      </p>

      <div className="inline-flex row gap-6 items-center pt-10">
        <InlineLink href="/" className={clsx('z-50 relative')}>
          <Logo />
        </InlineLink>

        <InlineLink
          href="/"
          className={clsx(
            'z-50 headline-display-xs relative font-bold uppercase tracking-wider pointer-events-none',
            'md:inline-flex hidden',
            'no-underline',
          )}
        >
          John.Design™
        </InlineLink>
      </div>

      <div className="z-50 flex flex-row fixed bottom-4 right-4 font-bold pointer-events-none">
        <InlineLink
          href={`https://github.com/johnchourajr/john.design/tree/new-new/pages${
            pathname === '/' ? '/index' : pathname
          }.tsx`}
          target="_blank"
          aria-label="Link to source code"
          className={clsx(
            'text-title z-50 relative pointer-events-none',
            'no-underline',
          )}
        >
          {'</>'}
        </InlineLink>
      </div>
    </footer>
  );
}
