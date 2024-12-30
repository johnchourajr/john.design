import Footer from './Footer';
import Header from './Header';
import { LayoutInner } from './LayoutInner';
import { LayoutOuter } from './LayoutOuter';

export type GlobalLayoutProps = {
  children: React.ReactNode;
};

export function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <LayoutOuter>
      <Header />
      <LayoutInner>{children}</LayoutInner>
      <Footer />
    </LayoutOuter>
  );
}
