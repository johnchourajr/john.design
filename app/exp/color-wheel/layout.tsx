import { expMetadata } from '@/lib/pages/exp';

export const metadata = expMetadata('/exp/color-wheel');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
