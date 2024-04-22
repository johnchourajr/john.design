import * as React from "react";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils";
import clsx from "clsx";
import { useDrawing } from "../context/DrawingContext";

type Point = {
  x: number;
  y: number;
  pressure: number;
};

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
  const { points, storedPoints, isDrawing } = useDrawing();

  const getStoredPaths = () => {
    return storedPoints.map((pathPoints) => {
      const stroke = getStroke(
        pathPoints.map((p) => [p.x, p.y, p.pressure]),
        options
      );
      return getSvgPathFromStroke(stroke);
    });
  };

  // Function to get the SVG path for the current drawing path
  const getCurrentPath = () => {
    const stroke = getStroke(
      points.map((p) => [p.x, p.y, p.pressure]),
      options
    );
    return getSvgPathFromStroke(stroke);
  };

  React.useEffect(() => {
    console.log({ isDrawing });
  }, [isDrawing]);

  return (
    <svg
      className={clsx(
        "absolute inset-0 w-full h-full z-0",
        isDrawing ? "drawing" : "", // Apply 'drawing' class only while drawing
        className
      )}
    >
      {getStoredPaths().map((path, index) => (
        <path key={index} d={path} fill="red" stroke="red" strokeWidth="2" />
      ))}

      {/* Render the current drawing path */}
      {points.length > 0 && (
        <path d={getCurrentPath()} fill="red" stroke="red" strokeWidth="2" />
      )}
    </svg>
  );
}
