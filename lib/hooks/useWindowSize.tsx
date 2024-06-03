import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useWindowSize() {
  const isClient = typeof window === 'object';
  const router = useRouter();

  function getSize() {
    return {
      width: isClient ? window.innerWidth : 0,
      height: isClient ? window.innerHeight : 0,
      scrollHeight: isClient ? document.body.scrollHeight : 0,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return; // For SSR
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    // Add event listener for resizing
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Function to update the size when the route changes
    const handleRouteChange = () => {
      setWindowSize(getSize());
    };

    // Listen to router change events
    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup listener when component unmounts or dependencies change
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]); // eslint-disable-line react-hooks/exhaustive-deps

  return windowSize;
}
