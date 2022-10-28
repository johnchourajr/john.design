import React from "react";
import debounce from "./utils/debounce";
import guidGenerator from "./utils/guidGenerator";
import getHighest from "./utils/getHighest";
import TickerElement from "./element";
import getDefaultState from "./utils/getDefaultState";
import { motion, useMotionValue } from "framer-motion";

interface TickerProps {
  children: (props: any) => React.ReactNode;
  direction?: string;
  speed?: number;
  mode?: string;
  move?: boolean;
  onNext?: () => void;
  onFinish?: () => void;
  offset?: number | string;
  height?: number | string;
  containerClassName?: string;
}

export default function Ticker({
  offset = 0,
  speed = 5,
  direction = "toLeft",
  mode = "chain",
  move = true,
  height = 0,
  onNext = () => {},
  onFinish = () => {},
  children,
  containerClassName,
}: TickerProps) {
  const defaultState = getDefaultState(offset, 0);
  const tickerRef = React.createRef<HTMLDivElement>();
  const [state, setState] = React.useState<any>(defaultState);
  const [stateWidth, setStateWidth] = React.useState<string | number>(0);
  const stateHeight = useMotionValue<number | string>(0);

  React.useEffect(() => {
    if (tickerRef.current) {
      setStateWidth(tickerRef.current.offsetWidth);
      stateHeight.set(height);
    }
  }, [state.elements]);

  const dOnResize = debounce(() => onResize(), 150);

  React.useEffect(() => {
    window.addEventListener("resize", dOnResize);
    return () => {
      window.removeEventListener("resize", dOnResize);
    };
  }, []);

  const handleSetRect = ({ index, rect, nextOffset }) => {
    // console.log({ label: "handleSetRect", index, rect, nextOffset });
    setState((prevState) => {
      const elements = prevState.elements.map((el) => {
        const newEl = el;
        if (el.index === index) newEl.rect = rect;
        // next element
        if (el.index === index + 1) {
          newEl.prevRect = rect;
          if (newEl.offset) {
            newEl.offset = nextOffset;
          }
        }
        return newEl;
      });
      return {
        ...prevState,
        elements,
        height: height ? prevState.height : getHighest(elements),
      };
    });
    if (height) {
      stateHeight.getPrevious();
    } else {
      stateHeight.set(getHighest(state.elements));
    }
  };

  const onResize = () => {
    if (tickerRef.current && tickerRef.current.offsetWidth !== stateWidth) {
      setState({ ...getDefaultState(offset, tickerRef.current.offsetWidth) });
      setStateWidth(tickerRef.current.offsetWidth);
    }
  };

  const handleOnFinish = (id) => {
    onFinish();
    setState((prevState) => {
      const elements = prevState.elements.filter((el) => el.id !== id);
      return { ...prevState, elements };
    });
  };

  const handleOnNext = ({ id, index, rect, nextOffset }) => {
    onNext();

    setState((prevState: any) => {
      const elements = prevState.elements.map((el) => {
        const newEl = el;
        if (el.index === index) newEl.rect = rect;
        if (el.index === 0 || el.offset || newEl.index === index + 1) {
          newEl.start = true;
        }
        return newEl;
      });

      const nextElement = {
        id: guidGenerator(),
        index: prevState.elements[prevState.elements.length - 1].index + 1,
        height: 0,
        start: false,
        offset: nextOffset,
        rect: null,
        prevRect: rect,
      };

      return { elements: [...elements, nextElement] };
    });
  };

  return (
    <motion.div
      ref={tickerRef}
      style={{
        position: "relative",
        overflow: "hidden",
        height: stateHeight && stateHeight,
      }}
      className={`ticker ${containerClassName}`}
    >
      {stateWidth &&
        state.elements.map((el) => {
          return (
            <TickerElement
              key={el.id}
              id={el.id}
              index={el.index}
              start={el.start}
              offset={el.offset}
              prevRect={el.prevRect}
              direction={direction}
              mode={mode}
              move={move}
              speed={speed}
              onFinish={handleOnFinish}
              onNext={handleOnNext}
              setRect={handleSetRect}
              width={stateWidth}
            >
              {children}
            </TickerElement>
          );
        })}
    </motion.div>
  );
}
