import Footer from './Footer';
import Header from './Header';
import { LayoutOuter } from './LayoutOuter';

export type GlobalLayoutProps = {
  children: React.ReactNode;
};

export function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <LayoutOuter>
      <Header />
      <main className="relative z-10 min-h-[100vh] pt-14">{children}</main>
      <Footer />
    </LayoutOuter>
  );
}
