/**
 * The pointer, as both shader cores see it (#125): useShaderRenderer on
 * WebGL and gpuShader on WebGPU. It tracks where the pointer or finger is,
 * eases `mouse` and `hover` towards it, and hears clicks on the canvas.
 */

/** Seconds for `hover` to cover most of the way to its target. */
const HOVER_EASE = 0.18;

export type ShaderPointerOptions = {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  /** `pixels` from the frame's top left, or `ndc` (-1 to 1, y up). */
  mouseSpace?: 'pixels' | 'ndc';
  /** Where pointer moves are heard. See ShaderRendererOptions. */
  pointerTarget?: 'container' | 'window';
  /** Jump `mouse` to the pointer when it arrives, instead of gliding in. */
  jumpOnEnter?: boolean;
  /** The `mouse` value until the pointer first moves. */
  restingMouse?: { x: number; y: number };
  /** Fraction of the way `mouse` moves per 60th of a second. 1 is undamped. */
  mouseDamping?: number;
  /** The frame's top left in the container, in CSS px. Read on every move. */
  offset: () => { x: number; y: number };
  /** Read when a click lands, so a new callback needs no rebuild. */
  onClick: () => (() => void) | undefined;
};

export type ShaderPointer = {
  /** Where the pointer is, and the damped value the shader sees. */
  pointer: { x: number; y: number };
  mouse: { x: number; y: number };
  /** 0 to 1, eased; and what it eases to. */
  hover: () => number;
  hoverTarget: () => number;
  /** Eases `mouse` and `hover` by `elapsed` seconds. */
  step: (elapsed: number) => void;
  /** The last click on the canvas, in client px, for a reveal to grow from. */
  lastClick: () => { x: number; y: number; time: number } | null;
  dispose: () => void;
};

export function trackShaderPointer({
  container,
  canvas,
  mouseSpace = 'pixels',
  pointerTarget = 'container',
  jumpOnEnter = false,
  restingMouse,
  mouseDamping = 1,
  offset,
  onClick,
}: ShaderPointerOptions): ShaderPointer {
  const pointer = { x: restingMouse?.x ?? 0, y: restingMouse?.y ?? 0 };
  const mouse = { ...pointer };
  let hover = 0;
  let hoverTarget = 0;
  let lastClick: { x: number; y: number; time: number } | null = null;

  const setPointer = (clientX: number, clientY: number) => {
    const bounds = container.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    if (mouseSpace === 'ndc') {
      pointer.x = (x / bounds.width) * 2 - 1;
      pointer.y = -(y / bounds.height) * 2 + 1;
    } else {
      const from = offset();
      pointer.x = x - from.x;
      pointer.y = y - from.y;
    }
  };

  const isOverCanvas = (clientX: number, clientY: number) => {
    const area = canvas.getBoundingClientRect();
    return (
      clientX >= area.left &&
      clientX <= area.right &&
      clientY >= area.top &&
      clientY <= area.bottom
    );
  };

  // Mirrored on the canvas as data-hover, for tests and devtools. Only
  // written when it changes.
  const setHoverTarget = (next: number) => {
    if (hoverTarget === next) return;
    hoverTarget = next;
    canvas.dataset.hover = String(next);
  };

  // The effect eases in the first time a pointer arrives, then stays:
  // when the pointer leaves or a finger lifts, the lens holds its last
  // place, like an object left on the page.
  const arrive = (clientX: number, clientY: number, jump: boolean) => {
    setPointer(clientX, clientY);
    // Arriving from rest: start where the pointer is, not where it was.
    if (jump && hover < 0.05) {
      mouse.x = pointer.x;
      mouse.y = pointer.y;
    }
    setHoverTarget(1);
  };

  // A mouse or pen. Touch has its own handler below.
  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    // Heard on the container, the pointer is over it. Heard on the
    // window, it only counts over the canvas.
    if (
      pointerTarget === 'container' ||
      isOverCanvas(event.clientX, event.clientY)
    ) {
      arrive(event.clientX, event.clientY, jumpOnEnter);
    }
  };

  // A finger drives the effect while it's down on the canvas, scrolling
  // included (touch events keep coming while the page scrolls). Listeners
  // are passive, so scrolling is never held up.
  const handleTouch = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (touch && isOverCanvas(touch.clientX, touch.clientY)) {
      arrive(touch.clientX, touch.clientY, true);
    }
  };

  const pointerSource: HTMLElement | Window =
    pointerTarget === 'window' ? window : container;
  // A click on the canvas: not a drag, not a link or control over it, and
  // not the end of a text selection.
  let downAt: { x: number; y: number } | null = null;
  const handlePointerDown = (event: PointerEvent) => {
    downAt = { x: event.clientX, y: event.clientY };
  };
  const handleClick = (event: MouseEvent) => {
    const callback = onClick();
    if (!callback) return;
    if (!isOverCanvas(event.clientX, event.clientY)) return;
    if (downAt && Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y) > 8) {
      return;
    }
    const target = event.target as Element | null;
    if (target?.closest?.('a, button, input, select, textarea, label, [role="button"]')) {
      return;
    }
    if (window.getSelection()?.toString()) return;
    lastClick = { x: event.clientX, y: event.clientY, time: performance.now() };
    callback();
  };

  const listen = { passive: true };
  pointerSource.addEventListener('pointerdown', handlePointerDown as EventListener, listen);
  pointerSource.addEventListener('click', handleClick as EventListener);
  pointerSource.addEventListener('pointermove', handlePointerMove as EventListener, listen);
  window.addEventListener('touchstart', handleTouch, listen);
  window.addEventListener('touchmove', handleTouch, listen);

  return {
    pointer,
    mouse,
    hover: () => hover,
    hoverTarget: () => hoverTarget,
    step: (elapsed) => {
      // Both ease by elapsed time, so they move as fast at 30, 60 or 120
      // frames a second. mouseDamping is the share per 60th of a second.
      hover += (hoverTarget - hover) * (1 - Math.exp(-elapsed / HOVER_EASE));
      if (Math.abs(hoverTarget - hover) < 0.001) hover = hoverTarget;
      const follow = 1 - Math.pow(1 - mouseDamping, elapsed * 60);
      mouse.x += (pointer.x - mouse.x) * follow;
      mouse.y += (pointer.y - mouse.y) * follow;
    },
    lastClick: () => lastClick,
    dispose: () => {
      pointerSource.removeEventListener('pointermove', handlePointerMove as EventListener);
      pointerSource.removeEventListener('pointerdown', handlePointerDown as EventListener);
      pointerSource.removeEventListener('click', handleClick as EventListener);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
    },
  };
}
