'use client';

import { useAppContext } from '@/context/AppProvider';
import clsx from 'clsx';
import { useEffect, useRef, useSyncExternalStore } from 'react';

export const COLOR_DRAWER_ID = 'color-drawer';

// The drawer is 100px tall; must match COLOR_DRAWER_PUSH_CLASS.
export const COLOR_DRAWER_PUSH_CLASS = 'translate-y-[100px]';
export const COLOR_DRAWER_TRANSITION_CLASS =
  'transition-transform duration-700 ease-out-expo motion-reduce:transition-none';

// Matches the swatches in ColorWheelSvg. Classes are literal so Tailwind picks them up.
const COLOR_BARS = [
  { color: '#FF0000', className: 'bg-[#FF0000]' },
  { color: '#FF00E5', className: 'bg-[#FF00E5]' },
  { color: '#14FF00', className: 'bg-[#14FF00]' },
  { color: '#CCFF00', className: 'bg-[#CCFF00]' },
];

const subscribeNoop = () => () => {};

export function NavColorDrawer() {
  const { rootColor, setRootColor, toggleColorActive, handleActive } =
    useAppContext();
  // The server always renders the default color, while the client starts from
  // the saved cookie. Only mark a selection once hydrated so they agree.
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const drawerRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Move focus into the drawer on open, and hand it back to whatever opened
  // it on close (unless the user has already moved focus elsewhere).
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (toggleColorActive) {
      openerRef.current = document.activeElement as HTMLElement | null;
      const target =
        drawer.querySelector<HTMLButtonElement>('[aria-pressed="true"]') ??
        drawer.querySelector<HTMLButtonElement>('button');
      target?.focus({ preventScroll: true });
      return;
    }

    const active = document.activeElement;
    if (!active || active === document.body || drawer.contains(active)) {
      openerRef.current?.focus({ preventScroll: true });
    }
    openerRef.current = null;
  }, [toggleColorActive]);

  useEffect(() => {
    if (!toggleColorActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleActive(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleColorActive, handleActive]);

  return (
    <>
      <div
        ref={drawerRef}
        id={COLOR_DRAWER_ID}
        inert={!toggleColorActive}
        aria-hidden={!toggleColorActive}
        data-testid="color-drawer"
        className={clsx(
          'fixed inset-x-0 top-0 z-[60] flex h-[100px]',
          COLOR_DRAWER_TRANSITION_CLASS,
          !toggleColorActive && '-translate-y-full',
        )}
      >
        {COLOR_BARS.map(({ color, className }) => {
          const selected =
            hydrated && color.toLowerCase() === rootColor.toLowerCase();

          return (
            <button
              key={color}
              type="button"
              aria-label={`Set color to ${color}`}
              aria-pressed={selected}
              data-testid={`color-drawer-bar-${color.slice(1)}`}
              onClick={() => {
                setRootColor(color);
                handleActive(false);
              }}
              className={clsx(
                'group h-full flex-1 flex flex-col items-start justify-between p-4',
                // Only widen on devices that can hover, so taps don't leave a column stuck open.
                '[@media(hover:hover)]:hover:flex-[1.25] focus-visible:flex-[1.25]',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-black',
                'transition-[flex-grow] duration-500 ease-out-expo motion-reduce:transition-none',
                'font-mono text-xs uppercase text-black',
                className,
              )}
            >
              <span>{color}</span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className={clsx(
                  'h-6 w-6 fill-none stroke-current stroke-2 transition-opacity duration-300',
                  selected
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-50 group-focus-visible:opacity-50',
                )}
              >
                <path d="M4 12.5l5 5L20 6.5" />
              </svg>
            </button>
          );
        })}
      </div>
      {toggleColorActive && (
        <button
          type="button"
          aria-label="Close color picker"
          data-testid="color-drawer-dismiss"
          onClick={() => handleActive(false)}
          className="fixed inset-x-0 top-[100px] bottom-0 z-[60] cursor-default"
        />
      )}
    </>
  );
}
