'use client';
import dynamic from 'next/dynamic';

const NavDrawingControls = dynamic(
  () =>
    import('@/components/globals/Header/NavDrawingControls').then(
      (mod) => mod.NavDrawingControls,
    ),
  {
    ssr: false,
    loading: () => <div className="h-8 w-8" />,
  },
);

const ColorWheelControl = dynamic(
  () =>
    import('@/components/experimental/ColorWheel').then(
      (mod) => mod.ColorWheelControl,
    ),
  {
    ssr: false,
    loading: () => <div className="h-8 w-8" />,
  },
);

const NavDateTime = dynamic(() =>
  import('@/components/globals/Header/NavDateTime').then(
    (mod) => mod.NavDateTime,
  ),
);

export function NavRight() {
  return (
    <div className="hidden lg:inline-flex row gap-6 items-center h-5">
      <NavDrawingControls />
      <ColorWheelControl />
      <NavDateTime />
    </div>
  );
}
