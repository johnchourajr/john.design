(() => {
  try {
    const href = 'https://use.typekit.net/wqj3mof.css';
    const link = document.querySelector(`link[href="${href}"]`);

    if (link) {
      link.media = 'all';
      return;
    }

    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = href;
    document.head.appendChild(newLink);
  } catch {
    // ignore
  }
})();
