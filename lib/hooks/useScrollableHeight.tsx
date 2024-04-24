import { useEffect, useState } from "react";

// useScrollableHeight hook from https://usehooks.com/useScrollableHeight/

export function useScrollableHeight() {
  const [scrollableHeight, setScrollableHeight] = useState<number>(0);

  useEffect(() => {
    // Calculate the scrollable height
    const calculateScrollableHeight = () => {
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const viewportHeight = window.innerHeight;
      setScrollableHeight(docHeight - viewportHeight);
    };

    // Calculate on mount and when the window is resized
    calculateScrollableHeight();
    window.addEventListener("resize", calculateScrollableHeight);

    // Cleanup listener on unmount
    return () =>
      window.removeEventListener("resize", calculateScrollableHeight);
  }, []);

  return scrollableHeight;
}
