/**
 * The `?shader-debug` panel: a small fixed readout of a shader's state,
 * refreshed four times a second, for diagnosing a machine we can't run
 * (#108). Nothing here loads or runs without the flag.
 */

/** `?shader-debug` turns the panel on. Client only, after mount. */
export function isShaderDebug(): boolean {
  return new URLSearchParams(window.location.search).has('shader-debug');
}

export type ShaderDebugPanel = {
  /** Records an error or warning to show as the last one seen. */
  record: (message: string) => void;
  dispose: () => void;
};

const fixed = (value: number, digits = 1) =>
  Number.isFinite(value) ? value.toFixed(digits) : String(value);

/** Rounds numbers in a readout so the panel stays narrow. */
export const debugNumber = fixed;

/**
 * Mounts the panel. `read` returns the lines to show; it runs on each
 * refresh, not every frame. Console warnings and errors that mention three
 * or WebGL are recorded too, while the panel is up.
 */
export function mountShaderDebug(read: () => string[]): ShaderDebugPanel {
  let lastError = 'none';
  const record = (message: string) => {
    lastError = `${new Date().toLocaleTimeString()} ${message}`.slice(0, 240);
  };

  const panel = document.createElement('pre');
  panel.setAttribute('aria-hidden', 'true');
  panel.dataset.shaderDebug = '';
  Object.assign(panel.style, {
    position: 'fixed',
    left: '8px',
    bottom: '8px',
    zIndex: '2147483647',
    maxWidth: 'calc(100vw - 16px)',
    margin: '0',
    padding: '8px 10px',
    font: '11px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace',
    color: '#9f9',
    background: 'rgba(0, 0, 0, 0.82)',
    border: '1px solid #3a3',
    whiteSpace: 'pre-wrap',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(panel);

  const original = { warn: console.warn, error: console.error };
  const watch =
    (level: 'warn' | 'error') =>
    (...args: unknown[]) => {
      const text = args.map(String).join(' ');
      if (/three|webgl|shader|gl_/i.test(text)) record(`${level}: ${text}`);
      original[level].apply(console, args);
    };
  console.warn = watch('warn');
  console.error = watch('error');
  const onError = (event: ErrorEvent) => record(`uncaught: ${event.message}`);
  window.addEventListener('error', onError);

  const refresh = () => {
    let lines: string[];
    try {
      lines = read();
    } catch (error) {
      lines = [`read failed: ${String(error)}`];
    }
    panel.textContent = [...lines, `last error: ${lastError}`].join('\n');
  };
  refresh();
  const timer = window.setInterval(refresh, 250);

  return {
    record,
    dispose: () => {
      window.clearInterval(timer);
      window.removeEventListener('error', onError);
      console.warn = original.warn;
      console.error = original.error;
      panel.remove();
    },
  };
}
