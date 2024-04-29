import { useEffect, useState } from "react";

export function useDevicePixelRatio() {
  const isClient = typeof window === "object";

  function getRatio() {
    return isClient ? window.devicePixelRatio : undefined;
  }

  const [devicePixelRatio, setDevicePixelRatio] = useState(getRatio);

  useEffect(() => {
    function handleResize() {
      setDevicePixelRatio(getRatio());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return devicePixelRatio;
}
