import * as React from "react";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils";
import { faceDrawing } from "../data/sample/face-drawing";

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

export default function FreehandCanvas() {
  const [points, setPoints] = React.useState<any[]>(faceDrawing);

  function handlePointerDown(e: any) {
    e.target.setPointerCapture(e.pointerId);
    setPoints([[e.pageX, e.pageY, e.pressure]]);
  }

  function handlePointerMove(e: any) {
    if (e.buttons !== 1) return;
    setPoints([...points, [e.pageX, e.pageY, e.pressure]]);

    // console.log(points);

    // log points to json
    console.log(JSON.stringify(points));
  }

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke as any);

  // create new path element on each handlePointerDown

  return (
    <svg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={{ touchAction: "none", cursor: "url('/cursor.svg') 2 26, auto" }}
      className="absolute inset-0 w-full h-full z-10"
    >
      {points && <path d={pathData} fill="red" />}
    </svg>
  );
}
