import { useDrawing } from '@/context/DrawingContext';
import { getSvgPathFromStroke } from '@/utils/getSvgPathFromStroke';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { getStroke } from 'perfect-freehand';

const options = {
  size: 3,
  thinning: 1,
  smoothing: 3,
  streamline: 0.25,
  easing: (t: any) => t,
  start: {
    taper: 100,
    easing: (t: any) => t,
    cap: true,
  },
  end: {
    taper: 100,
    easing: (t: any) => t,
    cap: true,
  },
};

export default function FreehandCanvas({ className }: { className?: string }) {
  const { points, storedPoints, docSize } = useDrawing();
  const strokeWidth = Math.max(1, docSize.width / 1000); // Adjust base value and scaling factor as needed

  const getStoredPaths = () => {
    return storedPoints.map((pathPoints) => {
      const stroke = getStroke(pathPoints, options);
      return getSvgPathFromStroke(stroke);
    });
  };

  const getCurrentPath = () => {
    const stroke = getStroke(points, options);
    return getSvgPathFromStroke(stroke);
  };

  return (
    <svg
      className={clsx(
        'absolute inset-0 w-full h-full z-50',
        'pointer-events-none',
        className,
      )}
      style={{
        width: `${docSize.width}px`,
        height: `${docSize.height}px`,
      }}
      viewBox={`0 0 ${docSize.width} ${docSize.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {getStoredPaths().map((path, index) => (
        <motion.path
          key={index}
          d={path}
          fill="var(--root-color)"
          stroke="var(--root-color)"
          strokeWidth={strokeWidth}
          initial={{
            pathLength: 0,
            pathOffset: 0,
          }}
          whileInView={{
            pathLength: 1,
            pathOffset: 0,
          }}
          transition={{
            duration: 2,
          }}
        />
      ))}

      {/* Render the current drawing path */}
      {points && (
        <motion.path
          d={getCurrentPath()}
          fill="var(--root-color)"
          stroke="var(--root-color)"
          strokeWidth={strokeWidth}
          initial={{
            pathLength: 0,
            pathOffset: 0,
          }}
          whileInView={{
            pathLength: 1,
            pathOffset: 0,
          }}
          transition={{
            duration: 2,
          }}
        />
      )}
    </svg>
  );
}
