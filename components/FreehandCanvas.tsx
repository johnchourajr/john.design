import * as React from "react";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils";
import clsx from "clsx";
import { usePageHeight } from "../utils/hooks";

const options = {
  size: 3,
  thinning: 0.4,
  smoothing: 1,
  streamline: 0.25,
  easing: (t: any) => t,
  start: {
    taper: 0,
    easing: (t: any) => t,
    cap: true,
  },
  end: {
    taper: 0,
    easing: (t: any) => t,
    cap: true,
  },
};

export default function FreehandCanvas({ className }: { className?: string }) {
  const [storedPoints, setStoredPoints] = React.useState<any[]>([]);
  const [points, setPoints] = React.useState<any[]>([]);
  const pageHeight = usePageHeight() as any;

  function handlePointerDown(e: any) {
    e.target.setPointerCapture(e.pointerId);
    setPoints([[e.pageX, e.pageY, e.pressure]]);
  }

  const handlePointerMove = React.useCallback((e: any) => {
    if (e.buttons !== 1) return;
    setPoints((current) => [...current, [e.pageX, e.pageY, e.pressure]]);
  }, []);

  const handlePointerUp = React.useCallback(
    (e: any) => {
      e.target.releasePointerCapture(e.pointerId);
      setPoints([]);
      setStoredPoints((current) => [...current, ...points]);
    },
    [points]
  );

  const stroke = getStroke([...storedPoints, ...points], options);
  const pathData = getSvgPathFromStroke(stroke as any);

  return (
    <svg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        touchAction: "none",
        cursor: "url('/pencil.svg') 6 18, auto",
        height: pageHeight.height,
      }}
      className={clsx(
        "absolute pointer-events-none inset-0 w-full h-full z-0",
        className
      )}
    >
      {points && <path d={pathData} fill="var(--root-color)" />}
    </svg>
  );
}
