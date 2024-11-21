import { useEffect, useState } from 'react';

const useLCP = () => {
  const [lcpOccurred, setLcpOccurred] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        setLcpOccurred(true);
        observer.disconnect();
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    return () => observer.disconnect();
  }, []);

  return lcpOccurred;
};

export default useLCP;
