import { ProgressiveBlur } from '../ProgressiveBlur';
import { NavLeft } from './NavLeft';
import { NavRight } from './NavRight';
import { NavWrapper } from './NavWrapper';

export default function Header() {
  return (
    <NavWrapper>
      <NavLeft />
      <NavRight />
      <ProgressiveBlur direction="top" className="h-28" />
    </NavWrapper>
  );
}
