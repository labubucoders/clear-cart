/**
 * In-Page Dark Pattern Highlighter
 * Renders floating badges in a top-level portal layer above all host stacking contexts
 * so overlays are never clipped or hidden under webpage elements.
 */

const DarkPatternHighlighter = {
  isEnabled: false,
  badgeEntries: [],
  rafId: null,
  listenersAttached: false,

  /**
   * Ensure the top-level portal layer exists on <html>
   */
  getOrCreateOverlayLayer() {
    let layer = document.getElementById('dp-overlay-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'dp-overlay-layer';
      layer.className = 'dp-overlay-layer';
      document.documentElement.appendChild(layer);
    }
    return layer;
  },

  /**
   * Apply visual borders and top-level floating tags to all detected items
   * @param {Array} detections Array of detection objects
   */
  applyHighlights(detections) {
    this.removeHighlights();
    this.isEnabled = true;

    const layer = this.getOrCreateOverlayLayer();
    this.badgeEntries = [];

    detections.forEach(item => {
      const element = document.querySelector(`[data-dp-id="${item.id}"]`);
      if (!element) return;

      const severityClass = `dp-severity-${item.severity.toLowerCase()}`;
      element.classList.add('dp-highlighted-element', severityClass);

      const badge = document.createElement('div');
      badge.className = `dp-element-badge dp-badge-${item.severity.toLowerCase()}`;
      badge.textContent = `⚠️ ${item.name} (${item.severity})`;
      badge.title = `${item.description}\n\nTip: ${item.advice}`;

      layer.appendChild(badge);
      this.badgeEntries.push({ element, badge });
    });

    this.repositionBadges();
    this.attachViewportListeners();
  },

  /**
   * Reposition all portal badges to track their target elements accurately
   */
  repositionBadges() {
    if (!this.isEnabled || this.badgeEntries.length === 0) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (const entry of this.badgeEntries) {
      const { element, badge } = entry;
      if (!document.body.contains(element)) {
        badge.style.display = 'none';
        continue;
      }

      const rect = element.getBoundingClientRect();
      // Hide if target is completely outside viewport or collapsed
      if (
        rect.width === 0 ||
        rect.height === 0 ||
        rect.bottom < 0 ||
        rect.top > vh ||
        rect.right < 0 ||
        rect.left > vw
      ) {
        badge.style.setProperty('display', 'none', 'important');
        continue;
      }

      badge.style.setProperty('display', 'inline-flex', 'important');

      // Place badge just above the element, or just below if near top edge
      const badgeHeight = badge.offsetHeight || 22;
      const badgeWidth = badge.offsetWidth || 160;

      let top = rect.top - badgeHeight - 4;
      if (top < 6) {
        top = Math.min(vh - badgeHeight - 6, rect.bottom + 4);
      }

      let left = rect.left;
      if (left + badgeWidth > vw - 8) {
        left = Math.max(8, vw - badgeWidth - 8);
      }
      if (left < 8) {
        left = 8;
      }

      badge.style.top = `${Math.round(top)}px`;
      badge.style.left = `${Math.round(left)}px`;
    }
  },

  /**
   * Schedule badge repositioning on scroll/resize via requestAnimationFrame
   */
  scheduleReposition() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.repositionBadges();
    });
  },

  attachViewportListeners() {
    if (this.listenersAttached) return;
    this.listenersAttached = true;

    this._onScrollOrResize = () => this.scheduleReposition();
    window.addEventListener('scroll', this._onScrollOrResize, { capture: true, passive: true });
    window.addEventListener('resize', this._onScrollOrResize, { passive: true });
  },

  detachViewportListeners() {
    if (!this.listenersAttached) return;
    this.listenersAttached = false;

    window.removeEventListener('scroll', this._onScrollOrResize, { capture: true });
    window.removeEventListener('resize', this._onScrollOrResize);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  },

  /**
   * Remove all highlights and portal badges from the page
   */
  removeHighlights() {
    this.isEnabled = false;
    this.badgeEntries = [];
    this.detachViewportListeners();

    document.querySelectorAll('.dp-highlighted-element').forEach(el => {
      el.classList.remove(
        'dp-highlighted-element',
        'dp-severity-high',
        'dp-severity-medium',
        'dp-severity-low',
        'dp-pulse-target'
      );
    });

    const layer = document.getElementById('dp-overlay-layer');
    if (layer) {
      layer.remove();
    }
  },

  /**
   * Scroll smoothly to a specific dark pattern and flash it
   * @param {string} patternId The ID of the detected item
   */
  scrollToPattern(patternId) {
    const el = document.querySelector(`[data-dp-id="${patternId}"]`);
    if (!el) return false;

    el.classList.add('dp-highlighted-element');
    el.classList.add('dp-pulse-target');

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.scheduleReposition();

    setTimeout(() => {
      el.classList.remove('dp-pulse-target');
    }, 3500);

    return true;
  }
};

if (typeof window !== 'undefined') {
  window.DarkPatternHighlighter = DarkPatternHighlighter;
}
