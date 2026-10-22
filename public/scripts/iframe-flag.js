// Flags embedded pages (?iframe) before first paint so CSS can hide the site
// chrome in the static HTML, ahead of React reading the same flag.
(() => {
  try {
    if (new URLSearchParams(window.location.search).has('iframe')) {
      document.documentElement.setAttribute('data-iframe', '');
    }
  } catch {
    // ignore
  }
})();
