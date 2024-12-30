'use client';

import { useDrawing } from '@/components/experimental/Drawing';
import { useEffect } from 'react';

export type PostPageOuterProps = {
  children: React.ReactNode;
};

export function PostPageOuter({ children }: PostPageOuterProps) {
  const { setEnableDrawing } = useDrawing();

  useEffect(() => {
    setEnableDrawing(false);

    return () => {
      setEnableDrawing(true);
    };
  }, [setEnableDrawing]);

  return <article className="p-4">{children}</article>;
}
