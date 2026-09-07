(function () {
  if (window.matchMedia('print').matches) return;

  const source = document.querySelector('.cv-print-source');
  const preview = document.querySelector('.cv-screen-preview');
  if (!source || !preview) return;

  let resizeTimer;

  function getPageHeightPx() {
    const probe = document.createElement('div');
    probe.className = 'cv-sheet';
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
    document.body.appendChild(probe);
    const px = probe.offsetHeight;
    probe.remove();
    return px;
  }

  function buildPreview() {
    preview.replaceChildren();
    document.body.classList.remove('has-screen-preview');

    source.style.height = 'auto';
    source.style.minHeight = '0';
    source.style.maxHeight = 'none';
    source.style.overflow = 'visible';

    const pageHeightPx = getPageHeightPx();
    const contentHeight = source.scrollHeight;
    const pageCount = Math.max(1, Math.ceil(contentHeight / pageHeightPx));

    document.body.classList.add('has-screen-preview');
    document.body.classList.remove('cv-preview-pending');

    for (let i = 0; i < pageCount; i++) {
      const sheet = document.createElement('div');
      sheet.className = 'cv-sheet';
      if (source.classList.contains('cv--two-col')) {
        sheet.classList.add('cv-sheet--two-col');
      }

      const inner = document.createElement('div');
      inner.className = 'cv-sheet__inner';
      inner.style.marginTop = String(-i * pageHeightPx) + 'px';

    const page = source.cloneNode(true);
    page.classList.remove('cv-print-source');
    page.removeAttribute('id');
    page.querySelectorAll('[id]').forEach(function (el) {
      el.removeAttribute('id');
    });

      inner.appendChild(page);
      sheet.appendChild(inner);
      preview.appendChild(sheet);
    }
  }

  function scheduleBuild() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildPreview, 120);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(buildPreview);
  } else {
    buildPreview();
  }

  window.addEventListener('resize', scheduleBuild);
  window.addEventListener('beforeprint', function () {
    document.body.classList.remove('has-screen-preview');
  });
  window.addEventListener('afterprint', function () {
    buildPreview();
  });
})();
