import { NavLeft } from './NavLeft';
import { NavRight } from './NavRight';
import { NavWrapper } from './NavWrapper';

export default function Header() {
  return (
    <NavWrapper>
      <NavLeft />
      <NavRight />
    </NavWrapper>
  );
}
