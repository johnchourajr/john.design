import { m } from 'motion/react';
const SvgIconUndo = ({ className }: { className?: string }) => (
  <m.svg
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    variants={{
      initial: { opacity: 1 },
      hover: { opacity: 1 },
      disabled: { opacity: 0.5 },
    }}
  >
    <m.path
      opacity={0.2}
      variants={{
        initial: { opacity: 0 },
        hover: { opacity: 0.2 },
        disabled: { opacity: 0 },
      }}
      d="M22 0H4V2H2V4H0V22H2V24H4V26H22V24H24V22H26V4H24V2H22V0Z"
    />
    <path d="M14 7H17V8H14V7Z" />
    <path d="M12 9V8H14V9H12Z" />
    <path d="M11 10V9H12V10H11Z" />
    <path d="M10 12V10H11V12H10Z" />
    <path d="M11 18H10V12H9V18H8V17H7V16H6V15H5V16H6V17H7V18H8V19H9V20H10V19H11V18Z" />
    <path d="M12 17V18H11V17H12Z" />
    <path d="M13 16V17H12V16H13Z" />
    <path d="M13 16V15H14V16H13Z" />
    <path d="M19 9H17V8H19V9Z" />
    <path d="M20 10H19V9H20V10Z" />
    <path d="M21 11H20V10H21V11Z" />
    <path d="M22 11H21V14H22V11Z" />
  </m.svg>
);
export default SvgIconUndo;
