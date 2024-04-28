import ColorWheelSvg from '@/components/color-wheel/ColorWheelSvg';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const RenderColorWheel = ({
  className,
  handleColorChange,
  handleClick,
}: any) => {
  const active = typeof handleColorChange === 'function' ? true : false;
  return (
    <motion.button
      layoutId="color-wheel"
      aria-label="Change color"
      title="Change color"
      onClick={handleClick}
      onMouseUp={handleColorChange}
      className={clsx('h-[1em] translate-y-[-0em] inline-block', className)}
    >
      <ColorWheelSvg active={active} />
    </motion.button>
  );
};
