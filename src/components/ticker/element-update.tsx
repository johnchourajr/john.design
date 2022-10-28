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
//   onNext: (props: {
//     id: string;
//     index: number;
//     rect: any;
//     nextOffset: number;
//   }) => void;
//   onFinish: (props: { id: string }) => void;
//   setRect: (props: {
//     index: number;
//     id: string;
//     offset: number;
//     rect: any;
//     nextOffset: number;
//   }) => void;
//   // setRect: () => void;
//   start: boolean;
//   offset?: number | string;
//   prevRect?: object;
//   width?: number;
// }

// function TickerElement({
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
//   offset = undefined,
//   prevRect = null,
//   width = undefined,
// }: TickerElementProps) {
//   const [state, setState] = React.useState({
//     children: children({ index }),
//     move,
//     position: { from: undefined, to: undefined, next: undefined },
//     offset,
//     rect: null,
//   });

//   let x = 0;
//   let isMoving = false;
//   let nextTriggered = false;
//   let elementRef = React.createRef();
//   let raf = null;

//   React.useEffect(() => {
//     setPosition(true);
//     let observer = new MutationObserver(onMutation);

//     if (elementRef.current) {
//       observer.observe(elementRef.current, {
//         characterData: true,
//         childList: true,
//         subtree: true,
//       });
//     }

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   const onMutation = () => {
//     setPosition();
//   };

//   React.useEffect(() => {
//     if (!x) {
//       x = state.position.from;
//       elementRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
//     }
//     if (x !== state.position.from) {
//       if (offset) {
//         x = x + Number(offset);
//       } else {
//         x = x + width;
//       }
//       elementRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
//     }
//     if (move) {
//       animate();
//     }
//     if (start) {
//       animate();
//     }
//     if (!move) {
//       isMoving = false;
//       window.cancelAnimationFrame(raf);
//     }
//   }, [state]);

//   const setPosition = (isMount) => {
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

//     setRect({
//       index,
//       rect,
//       offset,
//       nextOffset: getNextOffset({ from: position.from, rect, direction }),
//     });

//     if (isMount) {
//       const nextTriggerOnMount = shouldNextTriggerOnMount({
//         mode,
//         rect,
//         position,
//         offset,
//         direction,
//         width,
//       });
//       if (nextTriggerOnMount) {
//         onNext({
//           id,
//           index,
//           rect,
//           nextOffset: getNextOffset({ from: position.from, rect, direction }),
//         });
//       }
//       if (!nextTriggerOnMount && (offset || index === 0)) {
//         onNext({ id, index, rect });
//       }
//       nextTriggered = nextTriggerOnMount;
//     }

//     setState({
//       rect: rect,
//       offset: offset,
//       position: position,
//     });
//   };

//   const shouldTriggerNext = () => {
//     if (nextTriggered) return false;
//     return direction === "toLeft"
//       ? x <= state.position.next
//       : x >= state.position.next;
//   };

//   const triggerNext = () => {
//     if (shouldTriggerNext()) {
//       // if (this.props.index === 5) console.log(this.x)
//       nextTriggered = true;
//       onNext({
//         id: id,
//         index: index,
//         rect: rect,
//       });
//     }
//   };

//   const shouldFinish = () => {
//     switch (direction) {
//       case "toRight":
//         return x >= state.position.to;
//       case "toLeft":
//       default:
//         return x <= state.position.to;
//     }
//   };

//   const animate = () => {
//     if (isMoving) return;
//     isMoving = true;

//     let prevTimestamp = null;

//     const step = (timestamp) => {
//       if (!isMoving) return;
//       if (!elementRef.current) return;

//       const progress = prevTimestamp ? timestamp - prevTimestamp : 0;

//       x =
//         direction === "toLeft"
//           ? x - (progress / 100) * speed
//           : x + (progress / 100) * speed;
//       elementRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
//       triggerNext();

//       if (shouldFinish()) {
//         isMoving = false;
//         prevTimestamp = null;
//         onFinish(id);
//       } else {
//         prevTimestamp = timestamp;
//         raf = window.requestAnimationFrame(step);
//       }
//     };
//     raf = window.requestAnimationFrame(step);
//   };

//   return (
//     <div
//       ref={elementRef}
//       className="ticker__element"
//       style={{
//         willChange: "transform",
//         position: "absolute",
//         left: 0,
//         top: 0,
//         transform: `translate3d(${x}px, 0, 0)`,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// export default TickerElement;
