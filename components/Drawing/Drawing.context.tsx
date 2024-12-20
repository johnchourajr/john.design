'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  DocSizeType,
  DrawingContextType,
  StoredPoint,
  StoredPointObj,
} from './Drawing.types';

export const DynamicFreehandCanvas = dynamic(
  () => import('@/components/experimental/FreehandCanvas'),
);

const MAX_STORED_POINTS = 60;
const MIN_POINTS_COUNT = 5;
const MIN_DISTANCE = 10;

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};

export function DrawingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [enableDrawing, setEnableDrawing] = useState<boolean>(true);
  const [points, setPoints] = useState<StoredPoint>([]);
  const [storedPoints, setStoredPoints] = useState<StoredPointObj>({});
  const [docSize, setDocSize] = useState<DocSizeType>({
    width: 100,
    height: 100,
  });

  const isClient = typeof window !== 'undefined';

  const serializePoints = useCallback(
    (points: StoredPointObj): string => JSON.stringify(points),
    [],
  );

  const clearStoredPoints = () => {
    const newPathPoints = { ...storedPoints, [pathname]: [] };
    if (isClient) {
      localStorage.setItem('storedPoints', serializePoints(newPathPoints));
    }
    setStoredPoints(newPathPoints);
  };

  const storeCurrentDrawing = useCallback(() => {
    if (points.length > MIN_POINTS_COUNT) {
      const startPoint = points[0];
      const endPoint = points[points.length - 1];
      const distance = Math.sqrt(
        Math.pow(endPoint[0] - startPoint[0], 2) +
          Math.pow(endPoint[1] - startPoint[1], 2),
      );

      if (distance > MIN_DISTANCE) {
        const newStoredPoints = {
          ...storedPoints,
          [pathname]: [...(storedPoints[pathname] || []), points].slice(
            -MAX_STORED_POINTS,
          ),
        };
        if (isClient) {
          localStorage.setItem(
            'storedPoints',
            serializePoints(newStoredPoints),
          );
        }
        setStoredPoints(newStoredPoints);
      }
    }
  }, [points, storedPoints, pathname, isClient, serializePoints]);

  const undo = useCallback(() => {
    const updateStoredPoints = (
      newPoints: StoredPoint[],
      currentStoredPoints: StoredPointObj,
    ) => {
      const updatedStoredPoints = {
        ...currentStoredPoints,
        [pathname]: newPoints,
      };
      if (isClient) {
        localStorage.setItem(
          'storedPoints',
          serializePoints(updatedStoredPoints),
        );
      }
      return updatedStoredPoints;
    };

    setStoredPoints((currentStoredPoints) => {
      const currentPathPoints = currentStoredPoints[pathname];
      if (currentPathPoints && currentPathPoints.length > 0) {
        const lastPoints =
          currentPathPoints.length > 1
            ? currentPathPoints[currentPathPoints.length - 2]
            : [];
        const newPointsForPath = currentPathPoints.slice(0, -1);
        setPoints(lastPoints);

        return updateStoredPoints(newPointsForPath, currentStoredPoints);
      } else {
        setPoints([]);
        return updateStoredPoints([], currentStoredPoints);
      }
    });
  }, [pathname, isClient, serializePoints]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo]);

  useEffect(() => {
    if (isClient) {
      const savedPoints = localStorage.getItem('storedPoints');
      if (savedPoints) {
        const allPoints = JSON.parse(savedPoints);
        setStoredPoints(allPoints);
      }
    }
  }, [isClient, pathname]);

  useEffect(() => {
    if (!enableDrawing) return;

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

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [points, pathname, enableDrawing, storeCurrentDrawing]);

  useEffect(() => {
    const handleResize = () => {
      if (isClient) {
        const width = window.innerWidth;
        const height = document.body.scrollHeight;

        setDocSize({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isClient, pathname]);

  return (
    <DrawingContext.Provider
      value={{
        enableDrawing,
        setEnableDrawing,
        points,
        storedPoints: storedPoints[pathname] || [],
        setPoints,
        setStoredPoints,
        storeCurrentDrawing,
        clearStoredPoints,
        undo,
        docSize,
        setDocSize,
      }}
    >
      {children}
      <DynamicFreehandCanvas />
    </DrawingContext.Provider>
  );
}
