import React, { createContext, useContext, useState } from "react";
import FreehandCanvas from "../components/FreehandCanvas";

type Point = {
  x: number;
  y: number;
  pressure: number;
};

type DrawingContextType = {
  points: Point[];
  storedPoints: Point[][];
  isDrawing: boolean;
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  setStoredPoints: React.Dispatch<React.SetStateAction<Point[][]>>;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
};

export function DrawingProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState<Point[]>([]);
  const [storedPoints, setStoredPoints] = useState<Point[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const serializePoints = (points: Point[][]): string => {
    return JSON.stringify(points);
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    setPoints: React.Dispatch<React.SetStateAction<Point[]>>
  ) => {
    setIsDrawing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setPoints([{ x: e.pageX, y: e.pageY, pressure: e.pressure }]);
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
    setPoints: React.Dispatch<React.SetStateAction<Point[]>>
  ) => {
    if (e.buttons !== 1) return;

    setPoints((current) => [
      ...current,
      { x: e.pageX, y: e.pageY, pressure: e.pressure },
    ]);

    console.log(e);
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    points: Point[],
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    setPoints: React.Dispatch<React.SetStateAction<Point[]>>,
    setStoredPoints: React.Dispatch<React.SetStateAction<Point[][]>>
  ) => {
    setIsDrawing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    setPoints([]);
    setStoredPoints((current) => {
      const newStoredPoints = [...current, points];
      localStorage.setItem(
        "freehandCanvasPoints",
        serializePoints(newStoredPoints)
      );
      return newStoredPoints;
    });
  };

  return (
    <DrawingContext.Provider
      value={{
        points,
        storedPoints,
        isDrawing,
        setPoints,
        setStoredPoints,
        setIsDrawing,
      }}
    >
      <div
        onPointerDown={(e) => handlePointerDown(e, setIsDrawing, setPoints)}
        onPointerMove={(e) => handlePointerMove(e, setPoints)}
        onPointerUp={(e) =>
          handlePointerUp(e, points, setIsDrawing, setPoints, setStoredPoints)
        }
        className="relative z-10"
        style={{
          touchAction: "none",
          cursor: "url('/pencil.svg') 6 18, auto",
          // height: `${pageHeight}px`,
        }}
      >
        {children}
      </div>
      <FreehandCanvas />
    </DrawingContext.Provider>
  );
}
