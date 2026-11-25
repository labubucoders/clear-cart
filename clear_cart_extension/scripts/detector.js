/**
 * Dark Pattern Detection Engine
 * Scans the current DOM, detects psychological manipulation, finds innermost
 * elements, deduplicates findings, calculates penalties, and assigns an A-F letter grade.
 */

const DarkPatternDetector = {
  scanCounter: 0,

  /**
   * Run a complete scan of the current page.
   * @returns {Object} Full scan report
   */
  scanPage() {
    this.scanCounter++;
    const rules = window.DarkPatternRules.RULES;
    const detections = [];
    const matchedElements = new Set();

    // 1. Evaluate custom checker rules (timers, pre-checked checkboxes, low contrast opt-outs)
    const customRules = rules.filter(r => typeof r.customChecker === 'function');
    for (const rule of customRules) {
      let candidateElements = [];
      if (rule.id === 'prechecked_addon') {
        candidateElements = Array.from(document.querySelectorAll('input[type="checkbox"], input[type="radio"]'));
      } else if (rule.id === 'countdown_timer') {
        candidateElements = Array.from(document.querySelectorAll('[class*="timer"], [class*="countdown"], [id*="timer"], [id*="countdown"], [class*="clock"], [class*="badge"], [class*="deal"], [class*="tag"]'));
      } else if (rule.id === 'low_contrast_optout') {
        candidateElements = Array.from(document.querySelectorAll('a, button, span'));
      } else {
        candidateElements = Array.from(document.querySelectorAll('*'));
      }

      for (const el of candidateElements) {
        if (!this.isVisible(el) || this.isOverlapping(el, matchedElements)) continue;

        try {
          if (rule.customChecker(el)) {
            const targetEl = rule.regex ? this.findInnermostMatch(el, rule.regex) : el;
            if (!this.isOverlapping(targetEl, matchedElements)) {
              const detection = this.createDetectionRecord(targetEl, rule);
              detections.push(detection);
              matchedElements.add(targetEl);
            }
          }
        } catch (e) {
          console.warn('DarkPatternDetector custom rule check error:', e);
        }
      }
    }

    // 2. Evaluate Regex-based text rules with Recursive Innermost Match Resolution
    const textRules = rules.filter(r => r.regex);
    const searchSelectors = [
      'DIV', 'SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
      'BUTTON', 'A', 'LABEL', 'LI', 'SECTION', 'ARTICLE', 'ASIDE',
      'HEADER', 'B', 'STRONG', 'EM', 'SMALL'
    ].join(', ');

    for (const rule of textRules) {
      const candidates = Array.from(document.querySelectorAll(searchSelectors));

      for (const el of candidates) {
        if (!this.isVisible(el) || matchedElements.has(el)) continue;

        // Skip root bodies, script/style wrappers, or elements with extreme text length
        const rawText = el.innerText || '';
        if (!rawText || rawText.length > 500) continue;

        const normalizedText = this.normalizeText(rawText);
        if (!normalizedText) continue;

        if (rule.regex.test(normalizedText)) {
          // Find the most specific, innermost child element that matches the regex
          const targetEl = this.findInnermostMatch(el, rule.regex);

          if (!this.isOverlapping(targetEl, matchedElements)) {
            const targetText = this.normalizeText(targetEl.innerText || targetEl.textContent || '');
            const snippet = targetText.slice(0, 140);
            const detection = this.createDetectionRecord(targetEl, rule, snippet);
            detections.push(detection);
            matchedElements.add(targetEl);
          }
        }
      }
    }

    // 3. Compute score and penalties
    let totalDeductions = 0;
    detections.forEach(d => {
      const severityInfo = window.DarkPatternRules.SEVERITIES[d.severity];
      totalDeductions += severityInfo ? severityInfo.weight : 10;
    });

    const finalScore = Math.max(0, 100 - totalDeductions);
    const gradeDetails = window.DarkPatternRules.calculateGrade(finalScore);

    // 4. Group findings by category
    const categoriesMap = {};
    Object.keys(window.DarkPatternRules.CATEGORIES).forEach(k => {
      const cat = window.DarkPatternRules.CATEGORIES[k];
      categoriesMap[cat.id] = {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        count: 0,
        items: []
      };
    });

    detections.forEach(d => {
      if (categoriesMap[d.category]) {
        categoriesMap[d.category].count++;
        categoriesMap[d.category].items.push(d);
      }
    });

    return {
      timestamp: Date.now(),
      url: window.location.href,
      domain: window.location.hostname || 'Local Page',
      score: finalScore,
      grade: gradeDetails.grade,
      gradeDetails,
      totalDeductions,
      patternsCount: detections.length,
      categories: categoriesMap,
      detections
    };
  },

  /**
   * Checks whether an element is identical to or nested with an already-matched element
   */
  isOverlapping(el, matchedElements) {
    if (matchedElements.has(el)) return true;
    for (const seen of matchedElements) {
      if (seen.contains(el) || el.contains(seen)) {
        return true;
      }
    }
    return false;
  },

  /**
   * Recursively drill down to find the tightest descendant that satisfies the regex
   */
  findInnermostMatch(element, regex) {
    if (!element || !element.children || element.children.length === 0) {
      return element;
    }

    for (const child of element.children) {
      if (!this.isVisible(child)) continue;
      // Exclude script, style, svg
      if (['SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT'].includes(child.tagName)) continue;

      const childText = this.normalizeText(child.innerText || child.textContent || '');
      if (childText && regex.test(childText)) {
        return this.findInnermostMatch(child, regex);
      }
    }

    return element;
  },

  /**
   * Normalizes whitespace, non-breaking spaces (\u00A0), tabs, and newlines
   */
  normalizeText(str) {
    if (!str) return '';
    return str
      .replace(/[\u00A0\u200B\u202F\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  },

  /**
   * Formats a detection item and tags the element with a tracking ID
   */
  createDetectionRecord(el, rule, matchedSnippet) {
    const id = `dp-${this.scanCounter}-${Math.random().toString(36).substr(2, 9)}`;
    el.setAttribute('data-dp-id', id);

    const snippet = matchedSnippet || this.normalizeText(el.innerText || el.value || '').slice(0, 120);

    return {
      id,
      ruleId: rule.id,
      category: rule.category,
      name: rule.name,
      severity: rule.severity,
      description: rule.description,
      advice: rule.advice,
      snippet: snippet || '(Visual / Structural Pattern)',
      tagName: el.tagName
    };
  },

  /**
   * Checks if an element is visibly rendered in the viewport
   */
  isVisible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }
};

if (typeof window !== 'undefined') {
  window.DarkPatternDetector = DarkPatternDetector;
}
