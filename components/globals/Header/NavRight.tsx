import { ColorWheelControl } from '@/components/experimental/ColorWheel';
import { NavDateTime } from '@/components/globals/Header/NavDateTime';
import { NavDrawingControls } from '@/components/globals/Header/NavDrawingControls';

export function NavRight() {
  return (
    <div className="hidden md:inline-flex row gap-6 items-center h-5">
      <NavDrawingControls />
      <ColorWheelControl />
      <NavDateTime />
    </div>
  );
}
