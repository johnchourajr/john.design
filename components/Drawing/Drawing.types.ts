export type Point = [number, number, number];
export type StoredPoint = Point[];
export type SetPoint = React.Dispatch<React.SetStateAction<StoredPoint>>;
export type StoredPointObj = { [x: string]: never[] | StoredPoint[] };
export type SetStoredPoints = React.Dispatch<
  React.SetStateAction<StoredPointObj>
>;
export type DocSizeType = { width: number; height: number };

export type DrawingContextType = {
  enableDrawing: boolean;
  setEnableDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  points: Point[];
  storedPoints: StoredPoint[];
  setPoints: SetPoint;
  setStoredPoints: SetStoredPoints;
  storeCurrentDrawing: () => void;
  clearStoredPoints: () => void;
  undo: () => void;
  docSize: DocSizeType;
  setDocSize: React.Dispatch<React.SetStateAction<DocSizeType>>;
};
