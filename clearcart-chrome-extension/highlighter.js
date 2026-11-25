(function () {
  "use strict";

  var ROOT_ID = "dp-highlighter-root";
  var STYLE_ID = "dpg-highlight-style";
  var lastDetections = [];
  var isEnabled = false;
  var rafPending = false;
  var pulseTimer = null;

  function setMutating(val) {
    window.__DPG_MUTATING__ = Boolean(val);
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    setMutating(true);
    try {
      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.setAttribute("data-dp-extension-ui", "true");
      style.textContent =
        ".dpg-highlighted-el {" +
        "  outline: 2px dotted #EF4444 !important;" +
        "  outline-offset: 2px !important;" +
        "  border-radius: 3px !important;" +
        "}" +
        ".dpg-located-el {" +
        "  outline: 2px dotted #EF4444 !important;" +
        "  outline-offset: 3px !important;" +
        "  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.28) !important;" +
        "  border-radius: 3px !important;" +
        "}" +
        "#" + ROOT_ID + " {" +
        "  position: absolute;" +
        "  top: 0;" +
        "  left: 0;" +
        "  width: 0;" +
        "  height: 0;" +
        "  z-index: 2147483646;" +
        "  pointer-events: none;" +
        "}" +
        ".dpg-overlay-badge {" +
        "  position: absolute;" +
        "  display: inline-flex;" +
        "  align-items: center;" +
        "  gap: 5px;" +
        "  padding: 2px 6px;" +
        "  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;" +
        "  font-size: 10px;" +
        "  font-weight: 600;" +
        "  line-height: 1.35;" +
        "  letter-spacing: 0.03em;" +
        "  border-radius: 4px;" +
        "  background-color: #780606;" +
        "  color: #FFFFFF;" +
        "  border: 1px solid #EF4444;" +
        "  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);" +
        "  white-space: nowrap;" +
        "  pointer-events: none;" +
        "  max-width: 280px;" +
        "  overflow: hidden;" +
        "  text-overflow: ellipsis;" +
        "}" +
        ".dpg-overlay-badge[data-severity='MEDIUM'] {" +
        "  background-color: #451A03;" +
        "  border-color: #F59E0B;" +
        "  color: #FEF3C7;" +
        "}" +
        ".dpg-overlay-badge[data-severity='LOW'] {" +
        "  background-color: #1E293B;" +
        "  border-color: #94A3B8;" +
        "  color: #F8FAFC;" +
        "}" +
        ".dpg-overlay-badge.is-located {" +
        "  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5), 0 4px 12px rgba(0, 0, 0, 0.45);" +
        "  z-index: 2147483647;" +
        "}";
      (document.head || document.documentElement).appendChild(style);
    } finally {
      setMutating(false);
    }
  }

  function getOrCreateRoot() {
    var existing = document.getElementById(ROOT_ID);
    if (existing) return existing;
    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.setAttribute("data-dp-extension-ui", "true");
    (document.body || document.documentElement).appendChild(root);
    return root;
  }

  function findElementForDetection(detId) {
    if (!detId) return null;
    try {
      return document.querySelector('[data-dp-id="' + detId + '"], [data-dp-ids~="' + detId + '"]');
    } catch (_e) {
      return null;
    }
  }

  function rectsOverlap(a, b) {
    return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
  }

  function renderOverlayLabels() {
    if (!isEnabled) return;
    setMutating(true);
    try {
      var root = getOrCreateRoot();
      root.innerHTML = "";
      var scrollX = window.scrollX || window.pageXOffset || 0;
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var docWidth = Math.max(document.documentElement.scrollWidth || 0, window.innerWidth || 0);
      var placedRects = [];

      lastDetections.forEach(function (det) {
        var detId = det.id || det.elementId;
        var target = findElementForDetection(detId);
        if (!target) return;
        var rect = target.getBoundingClientRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) return;

        target.classList.add("dpg-highlighted-el");

        var badge = document.createElement("div");
        badge.className = "dpg-overlay-badge";
        badge.setAttribute("data-dp-extension-ui", "true");
        badge.setAttribute("data-dp-badge-for", detId);
        badge.setAttribute("data-severity", det.severity || "LOW");
        badge.textContent = (det.severity || "LOW") + " · " + det.name;

        var left = Math.max(4, Math.min(rect.left + scrollX, docWidth - 240));
        var top = Math.max(4, rect.top + scrollY - 22);
        badge.style.left = left + "px";
        badge.style.top = top + "px";
        root.appendChild(badge);

        var bw = badge.offsetWidth || 160;
        var bh = badge.offsetHeight || 18;
        var candidateRect = { left: left, top: top, right: left + bw + 4, bottom: top + bh + 2 };

        var attempts = 0;
        while (attempts < 8 && placedRects.some(function (p) { return rectsOverlap(candidateRect, p); })) {
          top = Math.max(4, top - (bh + 4));
          if (top <= 4) {
            top = rect.bottom + scrollY + 4 + (attempts * (bh + 3));
          }
          candidateRect = { left: left, top: top, right: left + bw + 4, bottom: top + bh + 2 };
          attempts++;
        }

        badge.style.top = top + "px";
        placedRects.push(candidateRect);
      });
    } finally {
      setMutating(false);
    }
  }

  function clearAllHighlights() {
    setMutating(true);
    try {
      document.querySelectorAll(".dpg-highlighted-el, .dpg-located-el").forEach(function (el) {
        el.classList.remove("dpg-highlighted-el", "dpg-located-el");
      });
      var root = document.getElementById(ROOT_ID);
      if (root) {
        root.innerHTML = "";
      }
    } finally {
      setMutating(false);
    }
  }

  function applyHighlights(detections, enabled) {
    ensureStyles();
    lastDetections = Array.isArray(detections) ? detections.slice() : [];
    isEnabled = Boolean(enabled);

    clearAllHighlights();
    if (!isEnabled || lastDetections.length === 0) return;
    renderOverlayLabels();
  }

  function scrollToPattern(patternId, detections) {
    if (Array.isArray(detections)) {
      lastDetections = detections.slice();
    }
    applyHighlights(lastDetections, true);

    var target = findElementForDetection(patternId);
    if (!target) return false;

    setMutating(true);
    try {
      document.querySelectorAll(".dpg-located-el").forEach(function (el) {
        el.classList.remove("dpg-located-el");
      });
      target.classList.add("dpg-located-el");
    } finally {
      setMutating(false);
    }

    target.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(function () {
      renderOverlayLabels();
      var badge = document.querySelector('[data-dp-badge-for="' + patternId + '"]');
      if (badge) {
        setMutating(true);
        badge.classList.add("is-located");
        setMutating(false);
      }
    }, 320);

    if (pulseTimer) clearTimeout(pulseTimer);
    pulseTimer = setTimeout(function () {
      setMutating(true);
      try {
        target.classList.remove("dpg-located-el");
        var badge = document.querySelector('[data-dp-badge-for="' + patternId + '"]');
        if (badge) badge.classList.remove("is-located");
      } finally {
        setMutating(false);
      }
    }, 2400);

    return true;
  }

  function scheduleReposition() {
    if (!isEnabled || rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(function () {
      rafPending = false;
      renderOverlayLabels();
    });
  }

  window.addEventListener("scroll", scheduleReposition, { passive: true });
  window.addEventListener("resize", scheduleReposition, { passive: true });

  window.__DPG_HIGHLIGHTER__ = {
    applyHighlights: applyHighlights,
    clearAllHighlights: clearAllHighlights,
    scrollToPattern: scrollToPattern
  };
})();