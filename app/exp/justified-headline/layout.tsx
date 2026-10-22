import { expMetadata } from '@/lib/pages/exp';

export const metadata = expMetadata('/exp/justified-headline');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
