import React, { createContext, useContext, useEffect, useState } from "react";
import FreehandCanvas from "@/components/FreehandCanvas";
import { useRouter } from "next/router";

type Point = [number, number, number];
type StoredPoint = Point[];
type SetPoint = React.Dispatch<React.SetStateAction<StoredPoint>>;
type StoredPointObj = { [x: string]: never[] | StoredPoint[] };
type SetStoredPoints = React.Dispatch<React.SetStateAction<StoredPointObj>>;
type DocSizeType = { width: number; height: number };

type DrawingContextType = {
  points: Point[]; // Array of Points
  storedPoints: StoredPoint[]; // Array of arrays of Points
  setPoints: SetPoint;
  setStoredPoints: SetStoredPoints;
  storeCurrentDrawing: () => void;
  clearStoredPoints: () => void;
  docSize: DocSizeType;
  setDocSize: React.Dispatch<React.SetStateAction<DocSizeType>>;
};

const MAX_STORED_POINTS = 10; // You can adjust this value as needed

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
};

export function DrawingProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  const [points, setPoints] = useState<StoredPoint>([]);
  const [storedPoints, setStoredPoints] = useState<StoredPointObj>({});
  const [docSize, setDocSize] = useState<DocSizeType>({
    width: 100,
    height: 100,
  });

  // Check if running on client-side
  const isClient = typeof window !== "undefined";

  // Function to serialize and store points
  const serializePoints = (points: StoredPointObj): string =>
    JSON.stringify(points);

  const clearStoredPoints = () => {
    const newPathPoints = { ...storedPoints, [pathname]: [] };
    if (isClient) {
      localStorage.setItem("storedPoints", serializePoints(newPathPoints));
    }
    setStoredPoints(newPathPoints);
  };

  const storeCurrentDrawing = () => {
    if (points.length > 0) {
      const newStoredPoints = {
        ...storedPoints,
        [pathname]: [...(storedPoints[pathname] || []), points].slice(
          -MAX_STORED_POINTS
        ),
      };
      if (isClient) {
        localStorage.setItem("storedPoints", serializePoints(newStoredPoints));
      }
      setStoredPoints(newStoredPoints);
    }
  };

  useEffect(() => {
    if (isClient) {
      const savedPoints = localStorage.getItem("storedPoints");
      console.log("Loaded from localStorage:", savedPoints);
      if (savedPoints) {
        const allPoints = JSON.parse(savedPoints);
        setStoredPoints(allPoints); // Load all points, not just for the current path.
      }
    }
  }, [isClient, pathname]); // Added router.pathname to dependencies

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      setPoints([[e.pageX, e.pageY, e.pressure]]);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.buttons !== 1) return;
      setPoints((current) => [...current, [e.pageX, e.pageY, e.pressure]]);
    };

    const handlePointerUp = (e: PointerEvent) => {
      storeCurrentDrawing();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [points, pathname]); // Removed storedPoints from dependencies

  useEffect(() => {
    const handleResize = () => {
      if (isClient) {
        const width = document.documentElement.scrollWidth;
        const height = document.documentElement.scrollHeight;

        setDocSize({ width, height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isClient]);

  return (
    <DrawingContext.Provider
      value={{
        points,
        storedPoints: storedPoints[pathname] || [],
        setPoints,
        setStoredPoints,
        storeCurrentDrawing,
        clearStoredPoints,
        docSize,
        setDocSize,
      }}
    >
      {children}
      <FreehandCanvas />
    </DrawingContext.Provider>
  );
}