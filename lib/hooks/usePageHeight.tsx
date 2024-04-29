import { useEffect, useState } from "react";

// hook to get page height

export function usePageHeight() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      height: isClient ? document.body.scrollHeight : undefined,
    };
  }

  const [pageHeight, setPageHeight] = useState(getSize);

  useEffect(() => {
    function handleResize() {
      setPageHeight(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return pageHeight;
}
