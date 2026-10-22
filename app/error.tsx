'use client';

import { ErrorView } from '@/components/globals/ErrorView';

// Errors thrown while rendering a page. The root layout (header, footer,
// theme) stays mounted around this.
export default function Error(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorView {...props} />;
}
