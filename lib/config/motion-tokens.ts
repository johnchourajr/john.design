/**
 * The motion scale, from transitions.dev, for motion's JS props (seconds and
 * cubic-bezier arrays). `styles/globals.css` declares the same scale as CSS
 * variables; keep the two in step.
 *
 * Pick a token by what the motion does, not by its number: surfaces open on
 * one step and close on a quicker one, so leaving never feels slower than
 * arriving.
 */
export const duration = {
  /** Per-item stagger offset. */
  stagger: 0.04,
  /** A delay, or a fade that should barely register. */
  micro: 0.08,
  /** Modal and dropdown close, text swap, tooltip appear. */
  quick: 0.15,
  /** Modal and dropdown open, icon swap, hover. */
  fast: 0.25,
  /** Panel close. */
  medium: 0.35,
  /** Panel open. */
  slow: 0.4,
  /** Emphasis moments, text reveal. */
  verySlow: 0.5,
} as const;

export const ease = {
  /** Opening and closing surfaces, position and size changes. */
  smoothOut: [0.22, 1, 0.36, 1],
  /** Swaps and reveals. */
  inOut: [0.42, 0, 0.58, 1],
  /** A small pop on arrival. */
  bounce: [0.34, 1.36, 0.64, 1],
} as const;

export const distance = {
  micro: 4,
  base: 8,
  /** Text reveal. */
  medium: 12,
} as const;

export const scale = {
  /** Modal open and close. */
  large: 0.96,
  /** Dropdown open. */
  medium: 0.97,
  /** Tooltip open. */
  small: 0.98,
  /** Dropdown close. */
  tiny: 0.99,
} as const;

export const blur = {
  small: 2,
  /** Text reveal. */
  medium: 3,
} as const;
