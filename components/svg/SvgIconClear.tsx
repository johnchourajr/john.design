import { m } from 'motion/react';
const SvgIconClear = ({ className }: { className?: string }) => (
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
    <path d="M10 8H20V19H10V18H19V9H10V8Z" />
    <path d="M9 10V9H10V10H9Z" />
    <path d="M8 11V10H9V11H8Z" />
    <path d="M7 12V11H8V12H7Z" />
    <path d="M6 13V12H7V13H6Z" />
    <path d="M6 14H5V13H6V14Z" />
    <path d="M7 15H6V14H7V15Z" />
    <path d="M8 16H7V15H8V16Z" />
    <path d="M9 17H8V16H9V17Z" />
    <path d="M9 17V18H10V17H9Z" />
    <path d="M15 14V15H16V16H17V15H16V14H15Z" />
    <path d="M14 14H15V13H16V12H17V11H16V12H15V13H14V12H13V11H12V12H13V13H14V14Z" />
    <path d="M14 14H13V15H12V16H13V15H14V14Z" />
  </m.svg>
);
export default SvgIconClear;
