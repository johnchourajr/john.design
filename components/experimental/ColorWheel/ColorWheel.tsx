import { ColorWheelSvg } from '@/components/experimental/ColorWheelSvg';
import clsx from 'clsx';
import { m } from 'motion/react';

export type ColorWheelProps = {
  className?: string;
  handleClick?: () => void;
  // When set, clicking a swatch picks its fill color.
  handleColorChange?: (e: React.MouseEvent<HTMLElement>) => void;
  // Set when the wheel toggles a disclosure such as the color drawer.
  expanded?: boolean;
  controls?: string;
};

export const ColorWheel = ({
  className,
  handleColorChange,
  handleClick,
  expanded,
  controls,
}: ColorWheelProps) => {
  return (
    <m.button
      type="button"
      aria-label="Change color"
      title="Change color"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={handleClick}
      onMouseUp={handleColorChange}
      className={clsx('h-[1em] inline-block', className)}
    >
      <ColorWheelSvg active={!!handleColorChange} />
    </m.button>
  );
};
