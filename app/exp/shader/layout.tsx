import { expMetadata } from '@/lib/pages/exp';

export const metadata = expMetadata('/exp/shader');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
