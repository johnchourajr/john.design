import clsx from 'clsx';

export function NavSlash() {
  return (
    <p
      className={clsx(
        'text-string relative',
        'z-50 opacity-50',
        'md:inline-flex hidden',
      )}
    >
      /
    </p>
  );
}
