import React from 'react';

/**
 * Headline component
 *
 * @component
 * @param {Object} props
 * @param {any} props.children react children
 * @param {Boolean} props.display
 * @param {String} props.size
 * @param {Boolean} props.funky
 *
 */
export function Headline({ children, display, size, funky, ...rest }) {
  return (
    <p className={size} data-display={display} data-funky={funky} {...rest}>
      {children}
    </p>
  );
}

/**
 * Paragraph component
 *
 * @component
 * @param {Object} props
 * @param {any} props.children react children
 */
export function Paragraph({ children, ...rest }) {
  return <p {...rest}>{children}</p>;
}

/**
 * Caption component
 *
 * @component
 * @param {Object} props
 * @param {any} props.children react children
 */
export function Caption({ children, ...rest }) {
  return (
    <p className="caption" {...rest}>
      {children}
    </p>
  );
}
