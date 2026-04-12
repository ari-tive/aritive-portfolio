(function () {
  if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
    return;
  }
  /* ─── Inject styles ─────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#cc-ring {',
    '  position: fixed;',
    '  width: 68px; height: 68px;',
    '  background: #2d3a2e;',
    '  border-radius: 50%;',
    '  border: none;',
    '  pointer-events: none;',
    '  z-index: 9999;',
    '  transform: translate(-50%, -50%) scale(0);',
    '  transition: transform 0.25s ease;',
    '  will-change: left, top, transform;',
    '}',
    '#cc-ring.visible {',
    '  transform: translate(-50%, -50%) scale(1);',
    '}',

    /* ── Copied toast ── */
    '#cc-toast {',
    '  position: fixed;',
    '  bottom: 32px;',
    '  left: 50%;',
    '  transform: translateX(-50%) translateY(12px);',
    '  background: #2d3a2e;',
    '  color: #ffffff;',
    '  font-family: Manrope, sans-serif;',
    '  font-size: 12px;',
    '  font-weight: 500;',
    '  letter-spacing: 0.08em;',
    '  padding: 8px 20px;',
    '  border-radius: 100px;',
    '  pointer-events: none;',
    '  z-index: 9999;',
    '  opacity: 0;',
    '  transition: opacity 0.2s ease, transform 0.2s ease;',
    '}',
    '#cc-toast.show {',
    '  opacity: 1;',
    '  transform: translateX(-50%) translateY(0);',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  /* ─── Build the ring element (no inner text) ─────────────────────────── */
  var ring = document.createElement('div');
  ring.id  = 'cc-ring';
  document.body.appendChild(ring);

  /* ─── Build the toast element ────────────────────────────────────────── */
  var toast = document.createElement('div');
  toast.id  = 'cc-toast';
  toast.textContent = 'Copied!';
  document.body.appendChild(toast);

  var toastTimer = null;
  function showToast() {
    clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 1500);
  }

  /* ─── Cursor position tracking ───────────────────────────────────────── */
  document.addEventListener('mousemove', function (e) {
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  });

  /* ─── Clickable detection ────────────────────────────────────────────── */
  function isClickable(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    var tag = el.tagName ? el.tagName.toLowerCase() : '';
    if (tag === 'a' || tag === 'button') return true;
    var cls = (el.className || '').toString();
    if (cls.indexOf('card') !== -1) return true;
    try {
      if (window.getComputedStyle(el).cursor === 'pointer') return true;
    } catch (e) {}
    return false;
  }

  function findClickableAncestor(el) {
    var current = el;
    while (current && current !== document.body) {
      if (isClickable(current)) return current;
      current = current.parentElement;
    }
    return null;
  }

  /* ─── Show / hide ring on hover ──────────────────────────────────────── */
  document.addEventListener('mouseover', function (e) {
    if (findClickableAncestor(e.target)) {
      ring.classList.add('visible');
    }
  });

  document.addEventListener('mouseout', function (e) {
    var relatedTarget = e.relatedTarget;
    if (!relatedTarget || !findClickableAncestor(relatedTarget)) {
      ring.classList.remove('visible');
    }
  });

  document.addEventListener('mouseleave', function () {
    ring.classList.remove('visible');
  });

  /* ─── Detect copy button clicks → show toast ─────────────────────────── */
  document.addEventListener('click', function (e) {
    var target = findClickableAncestor(e.target);
    if (!target) return;
    var isCopyBtn =
      target.getAttribute('data-cursor') === 'copy' ||
      (target.textContent || '').trim().indexOf('Copy') !== -1;
    if (isCopyBtn) {
      showToast();
    }
  });
})();
