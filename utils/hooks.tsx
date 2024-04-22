import { useEffect, useLayoutEffect, useState } from "react";

// useLocalStorage hook from https://usehooks.com/useLocalStorage/
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}

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

// useWindowSize hook from https://usehooks.com/useWindowSize/
export function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

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

export function useTime() {
  // write as hook
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

function getTime() {
  // get exact time
  const date = new Date();

  // get clock time
  const hours = date.getHours();
  // format hours to 12 hour time
  const hours12 = hours % 12 || 12;
  // get minutes
  const minutes = date.getMinutes();
  // format minutes to always have 2 digits
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  // pm or am
  const ampm = hours >= 12 ? "pm" : "am";
  // format time XX:XX am/pm
  const time = `${hours12}:${minutesStr} ${ampm}`;

  // get day of week, month, and date
  const day = date.getDay();
  // get month name from month number
  const monthName = date.toLocaleString("default", { month: "short" });
  // get day of week name from day of week number
  const dayName = date.toLocaleString("default", { weekday: "short" });
  // format data as SUN, JAN 1
  const dateStr = `${dayName}, ${monthName} ${day}`;

  return { time, dateStr };
}
