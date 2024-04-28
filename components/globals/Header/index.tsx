import clsx from 'clsx';

import { NavLeft } from './NavLeft';
import { NavRight } from './NavRight';

export default function Header() {
  return (
    <>
      <nav
        className={clsx(
          'w-full inline-flex row justify-between items-center sticky top-0 p-4',
          'after:content after:absolute after:inset-0 after:z-0 after:h-[10vw] after:pointer-events-none',
          'after:bg-gradient-to-b after:from-black after:via-transparent after:to-transparent',
          'z-50',
        )}
      >
        <NavLeft />
        <NavRight />
      </nav>
    </>
  );
}
