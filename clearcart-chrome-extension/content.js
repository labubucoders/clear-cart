(function () {
  "use strict";

  var RulesEngine = window.__DPG_RULES__;
  var Highlighter = window.__DPG_HIGHLIGHTER__;
  if (!RulesEngine || !Highlighter) return;

  var RULES = RulesEngine.RULES;
  var CATEGORY_MAP = RulesEngine.CATEGORY_MAP;
  var SEVERITY_WEIGHTS = RulesEngine.SEVERITY_WEIGHTS;
  var TEXT_CANDIDATE_SELECTOR = RulesEngine.TEXT_CANDIDATE_SELECTOR;
  var EXCLUDED_TAGS = RulesEngine.EXCLUDED_TAGS;
  var normalizeText = RulesEngine.normalizeText;
  var isVisible = RulesEngine.isVisible;

  var scanCounter = 0;
  var highlightEnabled = false;
  var lastReport = null;
  var debounceTimer = null;

  function clearTrapAttributes() {
    window.__DPG_MUTATING__ = true;
    try {
      document.querySelectorAll("[data-dp-id], [data-dp-ids], [data-dp-rules]").forEach(function (el) {
        el.removeAttribute("data-dp-id");
        el.removeAttribute("data-dp-ids");
        el.removeAttribute("data-dp-rules");
      });
    } finally {
      window.__DPG_MUTATING__ = false;
    }
  }

  function attachDetectionId(targetEl, detId, ruleId) {
    if (!targetEl || targetEl.nodeType !== 1) return;
    window.__DPG_MUTATING__ = true;
    try {
      if (!targetEl.getAttribute("data-dp-id")) {
        targetEl.setAttribute("data-dp-id", detId);
      }
      var existingIds = (targetEl.getAttribute("data-dp-ids") || "").trim();
      targetEl.setAttribute("data-dp-ids", existingIds ? existingIds + " " + detId : detId);

      var existingRules = (targetEl.getAttribute("data-dp-rules") || "").trim();
      targetEl.setAttribute("data-dp-rules", existingRules ? existingRules + " " + ruleId : ruleId);
    } finally {
      window.__DPG_MUTATING__ = false;
    }
  }

  function findInnermostMatch(rootEl, matcherFn) {
    if (!rootEl || !isVisible(rootEl)) return null;
    var children = rootEl.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (!child || EXCLUDED_TAGS[child.tagName]) continue;
      if (child.closest && child.closest("[data-dp-extension-ui='true']")) continue;
      if (!isVisible(child)) continue;

      var childText = normalizeText(child.innerText || "");
      if (childText && childText.length <= 500 && matcherFn(childText, child)) {
        var deeper = findInnermostMatch(child, matcherFn);
        if (deeper) return deeper;
      }
    }
    var rootText = normalizeText(rootEl.innerText || "");
    if (rootText && rootText.length <= 500 && matcherFn(rootText, rootEl)) {
      return rootEl;
    }
    return null;
  }

  function emptyCategoryCounts() {
    return {
      "urgency-scarcity": 0,
      "social-proof": 0,
      "confirmshaming": 0,
      "sneak-into-basket": 0,
      "threshold-trap": 0,
      "checkout-upsell": 0,
      "hidden-details": 0
    };
  }

  function runScan() {
    // 1. Increment the scan counter
    scanCounter += 1;

    clearTrapAttributes();

    // 2. Initialise an empty detections array
    var detections = [];

    // 3. Initialise the matchedElements Set + per-element rule deduplication map
    var matchedElements = new Set();
    var elementRuleMap = new WeakMap();
    var detSeq = 1;

    function isRuleAlreadyMatchedOn(el, ruleId) {
      var set = elementRuleMap.get(el);
      return Boolean(set && set.has(ruleId));
    }

    function markRuleMatchedOn(el, ruleId) {
      matchedElements.add(el);
      var set = elementRuleMap.get(el);
      if (!set) {
        set = new Set();
        elementRuleMap.set(el, set);
      }
      set.add(ruleId);
    }

    function hasDescendantWithRule(containerEl, ruleId) {
      var children = containerEl.querySelectorAll("[data-dp-rules]");
      for (var i = 0; i < children.length; i++) {
        var rulesAttr = children[i].getAttribute("data-dp-rules") || "";
        if ((" " + rulesAttr + " ").indexOf(" " + ruleId + " ") !== -1) {
          return true;
        }
      }
      return false;
    }

    // 7. Create individual detection records
    function recordDetection(rule, targetEl, snippetText) {
      if (!targetEl || isRuleAlreadyMatchedOn(targetEl, rule.id)) return;
      if (hasDescendantWithRule(targetEl, rule.id)) return;

      markRuleMatchedOn(targetEl, rule.id);

      var detId = "dp-" + scanCounter + "-" + detSeq++;
      attachDetectionId(targetEl, detId, rule.id);

      var cleanSnippet = normalizeText(snippetText || targetEl.innerText || "").slice(0, 160);

      detections.push({
        id: detId,
        uid: detId,
        elementId: detId,
        ruleId: rule.id,
        category: rule.category,
        categoryKey: rule.categoryKey,
        name: rule.name,
        severity: rule.severity,
        description: rule.description,
        advice: rule.advice,
        action: rule.advice,
        snippet: cleanSnippet,
        tagName: targetEl.tagName
      });
    }

    // 4. Execute all custom DOM-based rules
    RULES.forEach(function (rule) {
      if (typeof rule.customChecker !== "function") return;
      try {
        var customHits = rule.customChecker(document) || [];
        customHits.forEach(function (hit) {
          if (!hit || !hit.element) return;
          var targetEl = hit.element;
          if (rule.id === "countdown_timer" && rule.pattern) {
            var innermost = findInnermostMatch(hit.element, function (txt) {
              return rule.pattern.test(txt);
            });
            if (innermost) {
              targetEl = innermost;
            }
          }
          recordDetection(rule, targetEl, hit.snippet);
        });
      } catch (_err) {
        // Resilient rule isolation
      }
    });

    // 5. Execute all regex-based rules across visible webpage text
    var rawCandidates = Array.from(document.querySelectorAll(TEXT_CANDIDATE_SELECTOR));

    rawCandidates.forEach(function (candidate) {
      if (!candidate || EXCLUDED_TAGS[candidate.tagName]) return;
      if (candidate.closest && candidate.closest("[data-dp-extension-ui='true']")) return;

      var quickText = candidate.textContent || "";
      if (!quickText || quickText.length > 2500) {
        if (candidate.children && candidate.children.length > 35) return;
      }

      if (!isVisible(candidate)) return;

      var normText = normalizeText(candidate.innerText || "");
      if (!normText || normText.length > 500) return;

      // Skip text inside unchecked checkboxes/radios unless explicit opt-out
      var parentLabel = candidate.closest ? candidate.closest("label") : null;
      if (parentLabel) {
        var ctrl = parentLabel.querySelector('input[type="checkbox"], input[type="radio"]');
        if (ctrl && !ctrl.checked) return;
      }

      RULES.forEach(function (rule) {
        if (!rule.pattern) return;
        if (!rule.pattern.test(normText)) return;

        // 6. Identify the innermost matching element
        var innermost = findInnermostMatch(candidate, function (txt) {
          return rule.pattern.test(txt);
        });
        var finalEl = innermost || candidate;

        // 8. Prevent duplicate records
        recordDetection(rule, finalEl, normalizeText(finalEl.innerText || normText));
      });
    });

    // 9. Calculate severity deductions
    var totalDeductions = 0;
    detections.forEach(function (d) {
      totalDeductions += SEVERITY_WEIGHTS[d.severity] || 5;
    });

    // 10. Calculate the Transparency Score
    var score = Math.max(0, 100 - totalDeductions);
    var grade =
      score >= 90 ? "A" :
      score >= 80 ? "B" :
      score >= 70 ? "C" :
      score >= 60 ? "D" : "F";
    var status =
      grade === "A" ? "Transparent" :
      grade === "B" ? "Low Risk" :
      grade === "C" ? "Moderate Risk" :
      grade === "D" ? "Deceptive Patterns" : "High Manipulation";
    var summary =
      detections.length === 0
        ? "No manipulative checkout flows, hidden charges, or urgency indicators detected on this page."
        : score < 60
          ? "Multiple potential dark patterns detected. Inspect every line item and opt-out before purchasing."
          : "Some persuasive or opt-out patterns detected. Verify optional add-ons and terms before checkout.";

    // 11. Group findings into their respective categories
    var categoryCounts = emptyCategoryCounts();
    var categoryIdCounts = {};
    Object.keys(CATEGORY_MAP).forEach(function (catId) {
      categoryIdCounts[catId] = 0;
    });

    detections.forEach(function (d) {
      categoryCounts[d.categoryKey] = (categoryCounts[d.categoryKey] || 0) + 1;
      categoryIdCounts[d.category] = (categoryIdCounts[d.category] || 0) + 1;
    });

    // 12. Build & return complete report
    lastReport = {
      scanId: scanCounter,
      domain: window.location.protocol === "chrome-extension:"
        ? "shadymart-demo.local"
        : (window.location.hostname || "local-page"),
      score: score,
      grade: grade,
      status: status,
      summary: summary,
      matchedElementsCount: matchedElements.size,
      categoryCounts: categoryCounts,
      categoryIdCounts: categoryIdCounts,
      detections: detections
    };

    // Keep simultaneous highlights synced dynamically
    Highlighter.applyHighlights(detections, highlightEnabled);

    try {
      chrome.runtime.sendMessage({
        action: "SCAN_COMPLETED",
        type: "SCAN_COMPLETED",
        report: lastReport,
        highlightEnabled: highlightEnabled
      });
    } catch (_e) {
      // Extension context may be reloading
    }

    return lastReport;
  }

  function scheduleDebouncedScan() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      runScan();
    }, 600);
  }

  function isCountdownTickMutation(mutation) {
    if (!mutation || !mutation.target) return false;
    var el = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
    if (!el || !el.closest) return false;
    var timerHost = el.closest('[data-dp-rules*="countdown_timer"]');
    if (!timerHost) return false;
    if (mutation.type === "characterData") return true;
    if (mutation.type === "childList") {
      var hasElementChange = false;
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        if (mutation.addedNodes[i].nodeType === 1) {
          hasElementChange = true;
          break;
        }
      }
      if (!hasElementChange) {
        for (var j = 0; j < mutation.removedNodes.length; j++) {
          if (mutation.removedNodes[j].nodeType === 1) {
            hasElementChange = true;
            break;
          }
        }
      }
      return !hasElementChange;
    }
    return false;
  }

  function setupObserver() {
    var root = document.body || document.documentElement;
    if (!root || typeof MutationObserver !== "function") return;

    var observer = new MutationObserver(function (mutations) {
      if (window.__DPG_MUTATING__) return;

      var hasRelevantChange = false;
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        var targetEl = m.target && m.target.nodeType === 1 ? m.target : (m.target && m.target.parentElement);
        if (targetEl && targetEl.closest && targetEl.closest("[data-dp-extension-ui='true']")) {
          continue;
        }
        if (isCountdownTickMutation(m)) {
          continue;
        }
        hasRelevantChange = true;
        break;
      }

      if (hasRelevantChange) {
        scheduleDebouncedScan();
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "checked"]
    });

    document.addEventListener("change", function (ev) {
      var t = ev && ev.target;
      if (t && t.tagName === "INPUT" && (t.type === "checkbox" || t.type === "radio")) {
        scheduleDebouncedScan();
      }
    }, true);
  }

  chrome.runtime.onMessage.addListener(function (msg, _sender, sendResponse) {
    if (!msg) return;
    var action = msg.action || msg.type;

    if (action === "GET_SCAN_REPORT" || action === "DPG_GET_STATE") {
      var report = lastReport || runScan();
      sendResponse({ report: report, result: report, highlightEnabled: highlightEnabled });
    } else if (action === "TRIGGER_RESCAN" || action === "DPG_RESCAN") {
      var freshReport = runScan();
      sendResponse({ report: freshReport, result: freshReport, highlightEnabled: highlightEnabled });
    } else if (action === "TOGGLE_HIGHLIGHTS" || action === "DPG_TOGGLE_HIGHLIGHT") {
      highlightEnabled = Boolean(msg.enabled);
      var current = lastReport || runScan();
      Highlighter.applyHighlights(current.detections, highlightEnabled);
      sendResponse({ highlightEnabled: highlightEnabled });
    } else if (action === "SCROLL_TO_PATTERN" || action === "DPG_LOCATE_ELEMENT") {
      highlightEnabled = true;
      var activeReport = lastReport || runScan();
      var targetId = msg.patternId || msg.elementId;
      Highlighter.scrollToPattern(targetId, activeReport.detections);
      sendResponse({ highlightEnabled: highlightEnabled });
    }
  });

  // Initial scan sequence: immediate, 1.2s, and 2.8s
  runScan();
  setupObserver();
  setTimeout(runScan, 1200);
  setTimeout(runScan, 2800);
})();