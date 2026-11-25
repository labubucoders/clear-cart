/**
 * Content Script Orchestrator
 * Connects detector, highlighter, MutationObserver, and browser message listeners.
 */

(function () {
  let latestReport = null;
  let observerTimer = null;
  let highlightsActive = false;

  /**
   * Run scan and notify background service worker and active popup
   */
  function executeScan() {
    if (!window.DarkPatternDetector) return;

    latestReport = window.DarkPatternDetector.scanPage();

    // Re-apply highlights if user previously enabled them
    if (highlightsActive && window.DarkPatternHighlighter) {
      window.DarkPatternHighlighter.applyHighlights(latestReport.detections);
    }

    // Send update to background to set the icon badge (Grade A-F)
    try {
      chrome.runtime.sendMessage({
        action: 'UPDATE_BADGE',
        grade: latestReport.grade,
        score: latestReport.score,
        color: latestReport.gradeDetails.color,
        patternsCount: latestReport.patternsCount
      });

      // Broadcast to popup if open
      chrome.runtime.sendMessage({
        action: 'SCAN_COMPLETED',
        report: latestReport,
        highlightsActive
      });
    } catch (e) {
      // Context might be invalidated during navigation or reload
    }
  }

  /**
   * Observe DOM mutations for dynamically injected modals, countdowns, and carts
   */
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      // Filter out mutations that originate purely from our own highlighter
      const hasExternalMutations = mutations.some(m => {
        const target = m.target;
        if (target === document.documentElement) {
          const nodes = [...m.addedNodes, ...m.removedNodes];
          if (nodes.length > 0 && nodes.every(n => n.id === 'dp-overlay-layer')) {
            return false;
          }
        }
        if (!target || !target.classList) return true;
        return !target.classList.contains('dp-highlighted-element') &&
               !target.classList.contains('dp-element-badge') &&
               !target.classList.contains('dp-overlay-layer') &&
               !target.closest?.('.dp-overlay-layer') &&
               !target.closest?.('.dp-element-badge');
      });

      if (!hasExternalMutations) return;

      // Debounce re-scanning
      clearTimeout(observerTimer);
      observerTimer = setTimeout(() => {
        executeScan();
      }, 600);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'checked']
    });
  }

  // Listen for requests from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'GET_SCAN_REPORT':
        if (!latestReport) {
          executeScan();
        }
        sendResponse({ success: true, report: latestReport, highlightsActive });
        break;

      case 'TRIGGER_RESCAN':
        executeScan();
        sendResponse({ success: true, report: latestReport, highlightsActive });
        break;

      case 'TOGGLE_HIGHLIGHTS':
        highlightsActive = !highlightsActive;
        if (highlightsActive && latestReport) {
          window.DarkPatternHighlighter.applyHighlights(latestReport.detections);
        } else {
          window.DarkPatternHighlighter.removeHighlights();
        }
        sendResponse({ success: true, highlightsActive });
        break;

      case 'SCROLL_TO_PATTERN':
        if (window.DarkPatternHighlighter) {
          const ok = window.DarkPatternHighlighter.scrollToPattern(request.patternId);
          sendResponse({ success: ok });
        }
        break;

      default:
        break;
    }
    return true; // Keep channel open for async response
  });

  // Initial scan on load
  function init() {
    executeScan();
    setupMutationObserver();

    // Secondary scans for single-page dynamic carts (Amazon, Shopify, Blinkit, etc.)
    setTimeout(executeScan, 1200);
    setTimeout(executeScan, 2800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
