import { useEffect, useState } from "react";

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
