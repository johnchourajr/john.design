'use client';

import { useDisableDrawing } from '@/components/experimental/Drawing';

export type PostPageOuterProps = {
  children: React.ReactNode;
};

export function PostPageOuter({ children }: PostPageOuterProps) {
  useDisableDrawing();

  return <article className="p-4">{children}</article>;
}
