import clsx from 'clsx';

import { DynamicNavLeft } from './NavLeft';
import { DynamicNavRight } from './NavRight';

export default function Header() {
  return (
    <>
      <nav
        className={clsx(
          'w-full inline-flex row justify-between items-center fixed top-0 p-4',
          'after:content after:absolute after:inset-0 after:z-0 after:h-[5rem] after:pointer-events-none',
          'after:bg-gradient-to-b after:from-black after:to-transparent',
          'z-50',
        )}
      >
        <DynamicNavLeft />
        <DynamicNavRight />
      </nav>
    </>
  );
}
