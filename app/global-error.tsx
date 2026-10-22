'use client';

import { ErrorView } from '@/components/globals/ErrorView';
import {
  DEFAULT_ROOT_BACKGROUND,
  DEFAULT_ROOT_COLOR,
} from '@/lib/theme/theme-config';
import type { CSSProperties } from 'react';

import '../styles/globals.css';

// Errors in the root layout itself. This replaces the whole document, so it
// renders its own <html> and <body> without the site's providers.
export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      style={
        {
          '--root-color': DEFAULT_ROOT_COLOR,
          '--root-background': DEFAULT_ROOT_BACKGROUND,
        } as CSSProperties
      }
    >
      <head>
        <title>Something went wrong | John.Design</title>
        <link rel="stylesheet" href="https://use.typekit.net/wqj3mof.css" />
      </head>
      <body className="bg-(--root-background)">
        <ErrorView {...props} />
      </body>
    </html>
  );
}
