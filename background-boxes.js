(function () {
  /* ─── Inject styles ─────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#bg-boxes-canvas{',
    '  position:fixed;inset:0;width:100%;height:100%;',
    '  overflow:hidden;z-index:0;pointer-events:none;',
    '}',
    '.bg-box{',
    '  position:absolute;',
    '  background-color:#f5f0eb;',
    '  border:0.5px solid rgba(0,0,0,0.06);',
    '  box-sizing:border-box;',
    '  pointer-events:none;',
    '  transition:background-color 0.05s ease;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  /* ─── Hue state ──────────────────────────────────────────────────────── */
  var currentHue = 0;   // incremented by 15 on each new box entry

  function nextColor() {
    currentHue = (currentHue + 15) % 360;
    /* Convert HSL to a soft, muted rgba. Saturation 55%, lightness 65% */
    return 'hsl(' + currentHue + ', 55%, 65%)';
  }

  /* ─── Create canvas element ─────────────────────────────────────────── */
  var canvas = document.getElementById('bg-boxes-canvas');
  if (!canvas) {
    canvas = document.createElement('div');
    canvas.id = 'bg-boxes-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  /* ─── Grid state ─────────────────────────────────────────────────────── */
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var BOX_SIZE = isTouch ? 60 : 40;
  var boxes    = [];
  var cols     = 0;
  var rows     = 0;

  /* Last active box — null until first entry */
  var lastBox    = null;   // { row, col }
  var lastIndex  = -1;     // flat index of last lit box

  /* ─── Lift page content above canvas ────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    ['nav', 'main', 'section', 'footer', 'header'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.closest('#bg-boxes-canvas')) {
          if (!el.style.position || el.style.position === 'static') el.style.position = 'relative';
          if (!el.style.zIndex  || el.style.zIndex  === '0')        el.style.zIndex   = '1';
        }
      });
    });
    buildGrid();
  });

  /* ─── Grid builder ───────────────────────────────────────────────────── */
  function buildGrid() {
    canvas.innerHTML = '';
    boxes    = [];
    lastBox  = null;
    lastIndex = -1;

    cols = Math.ceil(window.innerWidth  / BOX_SIZE) + 1;
    rows = Math.ceil(window.innerHeight / BOX_SIZE) + 1;

    var frag = document.createDocumentFragment();
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cell = document.createElement('div');
        cell.className = 'bg-box';
        cell.style.width  = BOX_SIZE + 'px';
        cell.style.height = BOX_SIZE + 'px';
        cell.style.left   = (c * BOX_SIZE) + 'px';
        cell.style.top    = (r * BOX_SIZE) + 'px';
        frag.appendChild(cell);
        boxes.push(cell);
      }
    }
    canvas.appendChild(frag);
  }

  /* ─── Global cursor tracking ─────────────────────────────────────────── */
  if (!isTouch) {
    document.addEventListener('mousemove', function (e) {
    if (!boxes.length) return;

    /* Step 1 — calculate which box cell the cursor is in */
    var colIndex = Math.floor(e.clientX / BOX_SIZE);
    var rowIndex = Math.floor(e.clientY / BOX_SIZE);

    /* Clamp to grid */
    if (colIndex < 0) colIndex = 0; if (colIndex >= cols) colIndex = cols - 1;
    if (rowIndex < 0) rowIndex = 0; if (rowIndex >= rows) rowIndex = rows - 1;

    /* Step 2 — bail out immediately if we are still in the same box */
    if (lastBox !== null && lastBox.row === rowIndex && lastBox.col === colIndex) {
      return; // same cell — do absolutely nothing
    }

    /* Step 3 — new box: fade out the previous one */
    if (lastIndex >= 0 && lastIndex < boxes.length) {
      var prev = boxes[lastIndex];
      prev.style.transition      = 'background-color 0.9s ease';
      prev.style.backgroundColor = '#f5f0eb';
    }

    /* Step 4 — light up ONLY the current box */
    var newIndex = rowIndex * cols + colIndex;
    var current  = boxes[newIndex];
    if (current) {
      current.style.transition      = 'background-color 0.05s ease';
      current.style.backgroundColor = nextColor();
    }

    /* Step 5 — update tracking state */
    lastBox   = { row: rowIndex, col: colIndex };
    lastIndex = newIndex;
  });

  /* ─── Reset on cursor leaving window ────────────────────────────────── */
  document.addEventListener('mouseleave', function () {
    if (lastIndex >= 0 && lastIndex < boxes.length) {
      var prev = boxes[lastIndex];
      prev.style.transition      = 'background-color 0.9s ease';
      prev.style.backgroundColor = '#f5f0eb';
    }
    lastBox   = null;
    lastIndex = -1;
  });
  }

  /* ─── Responsive rebuild ─────────────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGrid, 200);
  });
})();
