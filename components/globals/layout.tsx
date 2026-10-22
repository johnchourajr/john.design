import Footer from './Footer';
import Header from './Header';
import { LayoutInner } from './LayoutInner';
import { LayoutOuter } from './LayoutOuter';
import { LayoutPushed } from './LayoutPushed';

export type GlobalLayoutProps = {
  children: React.ReactNode;
};

export function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <LayoutOuter>
      <Header />
      <LayoutPushed>
        <LayoutInner>{children}</LayoutInner>
        <Footer />
      </LayoutPushed>
    </LayoutOuter>
  );
}
