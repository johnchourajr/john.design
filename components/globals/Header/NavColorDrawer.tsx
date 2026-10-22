'use client';

import { useAppContext } from '@/context/AppProvider';
import clsx from 'clsx';
import { useEffect } from 'react';

// Bars are 100px each; the drawer height must match COLOR_DRAWER_PUSH_CLASS.
export const COLOR_DRAWER_PUSH_CLASS = 'translate-y-[400px]';
export const COLOR_DRAWER_TRANSITION_CLASS =
  'transition-transform duration-700 ease-out-expo motion-reduce:transition-none';

// Matches the swatches in ColorWheelSvg. Classes are literal so Tailwind picks them up.
const COLOR_BARS = [
  { color: '#FF0000', className: 'bg-[#FF0000]' },
  { color: '#FF00E5', className: 'bg-[#FF00E5]' },
  { color: '#14FF00', className: 'bg-[#14FF00]' },
  { color: '#CCFF00', className: 'bg-[#CCFF00]' },
];

export function NavColorDrawer() {
  const { rootColor, setRootColor, toggleColorActive, handleActive } =
    useAppContext();

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
        inert={!toggleColorActive}
        aria-hidden={!toggleColorActive}
        data-testid="color-drawer"
        className={clsx(
          'fixed inset-x-0 top-0 z-[60] flex flex-col',
          COLOR_DRAWER_TRANSITION_CLASS,
          !toggleColorActive && '-translate-y-full',
        )}
      >
        {COLOR_BARS.map(({ color, className }) => {
          const selected = color.toLowerCase() === rootColor.toLowerCase();

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
                'group h-[100px] w-full flex items-center justify-between px-4',
                'font-mono text-sm uppercase text-black',
                className,
              )}
            >
              <span>{color}</span>
              <span
                className={clsx(
                  'transition-opacity duration-300',
                  selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50',
                )}
              >
                Selected
              </span>
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
          className="fixed inset-x-0 top-[400px] bottom-0 z-[60] cursor-default"
        />
      )}
    </>
  );
}
