'use client';

import { useSyncExternalStore } from 'react';

const SEPARATOR = '|';

function subscribe(onChange: () => void) {
  const interval = setInterval(onChange, 1000);
  return () => clearInterval(interval);
}

// Snapshots are strings so React can compare them by value between ticks.
function getSnapshot() {
  const { time, dateStr } = getTime();
  return `${dateStr}${SEPARATOR}${time}`;
}

// The server (and static HTML) has no meaningful "now", so render empty and
// let the client fill in the real time after hydration.
function getServerSnapshot() {
  return '';
}

export function useTime() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [dateStr, time] = snapshot ? snapshot.split(SEPARATOR) : [];

  return { time, dateStr };
}

function getTime() {
  const date = new Date();

  // Get clock time
  const hours = date.getHours();
  // Format hours to 12-hour time
  const hours12 = hours % 12 || 12;
  // Get minutes
  const minutes = date.getMinutes();
  // Format minutes to always have 2 digits
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  // PM or AM
  const ampm = hours >= 12 ? 'pm' : 'am';
  // Format time as XX:XX AM/PM
  const time = `${hours12}:${minutesStr} ${ampm}`;

  // Get day of week, month, and date
  const day = date.getDate(); // Corrected from getDay to getDate
  // Get month name from month number
  const monthName = date.toLocaleString('default', { month: 'short' });
  // Get day of week name from day of week number
  const dayName = date.toLocaleString('default', { weekday: 'short' });
  // Format date as SUN, JAN 1
  const dateStr = `${dayName}, ${monthName} ${day}`;

  return { time, dateStr };
}
