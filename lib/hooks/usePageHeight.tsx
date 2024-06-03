import { useEffect, useState } from 'react';

export function usePageHeight() {
  const isClient = typeof window === 'object';

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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return pageHeight;
}
