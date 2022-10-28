// /* eslint-disable */

// import React from "react";
// import {
//   bool,
//   func,
//   node,
//   number,
//   object,
//   oneOfType,
//   string,
// } from "prop-types";

// import shouldNextTriggerOnMount from "./utils/shouldNextTriggerOnMount";
// import getPosition from "./utils/getPosition";
// import getNextOffset from "./utils/getNextOffset";
// import getStartOffset from "./utils/getStartOffset";

// interface TickerElementProps {
//   children: React.ReactNode | ((props: { index: number }) => React.ReactNode);
//   direction: string;
//   speed: number;
//   id: string;
//   index: number;
//   mode: string;
//   move: boolean;
//   onNext: () => void;
//   onFinish: () => void;
//   setRect: () => void;
//   start: boolean;
//   offset?: number | string;
//   prevRect?: object;
//   width?: number;
// }

// export default function TickerElement({
//   children,
//   direction,
//   speed,
//   id,
//   index,
//   mode,
//   move,
//   onNext,
//   onFinish,
//   setRect,
//   start,
//   offset,
//   prevRect,
//   width,
// }: TickerElementProps) {
//   const [childrenState, setChildrenState] = React.useState(children({ index }));
//   const [moveState, setMoveState] = React.useState(move);
//   const [positionState, setPositionState] = React.useState({
//     from: undefined,
//     to: undefined,
//     next: undefined,
//   });
//   const [offsetState, setOffsetState] = React.useState(offset);
//   const [rectState, setRectState] = React.useState(null);
//   let x = 0;
//   let isMoving = false;
//   let nextTriggered = false;
//   const elementRef = React.createRef();
//   let raf = null;

//   React.useEffect(() => {
//     setPosition(true);
//     const observer = new MutationObserver(onMutation);
//     if (elementRef.current) {
//       observer.observe(elementRef.current, {
//         attributes: true,
//         childList: true,
//         characterData: true,
//         subtree: true,
//       });
//     }

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   const onMutation = () => {
//     if (isMoving) {
//       return;
//     }
//     this.setPosition();
//   };

//   const setPosition = (onMount = false) => {
//     const rect = elementRef.current.getBoundingClientRect();
//     if (rect.width === 0) return;

//     const offset =
//       index === 0 ? getStartOffset({ offset, rect, direction, width }) : offset;

//     const position = getPosition({
//       mode,
//       rect,
//       index,
//       offset,
//       width,
//       direction,
//     });

//     if (move) {
//       this.start();
//     }

//     if (onMount) {
//       this.setRect();
//     }
//   };

//   return (
//     <div
//       className="ticker__element"
//       style={{
//         willChange: "transform",
//         position: "absolute",
//         left: 0,
//         top: 0,
//         transform: `translate3d(${this.x}px, 0, 0)`,
//       }}
//       ref={elementRef}
//     >
//       {childrenState}
//     </div>
//   );
// }
