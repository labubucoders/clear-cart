(function () {
  "use strict";

  var CATEGORY_MAP = {
    urgency: { key: "urgency-scarcity", label: "Urgency & Scarcity" },
    social_proof: { key: "social-proof", label: "Social Proof Manipulation" },
    confirmshaming: { key: "confirmshaming", label: "Confirmshaming" },
    sneak_basket: { key: "sneak-into-basket", label: "Sneak into Basket / Pre-selection" },
    threshold_trap: { key: "threshold-trap", label: "Threshold Trap / Basket Padding" },
    upsell_nagging: { key: "checkout-upsell", label: "Checkout Upsell & Nagging" },
    hidden_details: { key: "hidden-details", label: "Hidden Details & Deceptive Opt-Outs" }
  };

  var SEVERITY_WEIGHTS = {
    LOW: 5,
    MEDIUM: 15,
    HIGH: 30
  };

  var TEXT_CANDIDATE_SELECTOR =
    "div, span, p, h1, h2, h3, h4, h5, h6, button, a, label, li, section, article, aside, header, b, strong, em, small";

  var EXCLUDED_TAGS = {
    SCRIPT: true,
    STYLE: true,
    SVG: true,
    NOSCRIPT: true
  };

  function normalizeText(raw) {
    return (raw || "")
      .replace(/[\u00A0\u200B\u202F\r\n\t]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function isVisible(element) {
    if (!element || element.nodeType !== 1) return false;
    if (EXCLUDED_TAGS[element.tagName]) return false;
    if (element.closest && element.closest("[data-dp-extension-ui='true'], [hidden], [aria-hidden='true']")) {
      return false;
    }
    var style = window.getComputedStyle(element);
    if (!style || style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) {
      return false;
    }
    var rect = element.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return false;
    }
    return true;
  }

  function getContainerForInput(input) {
    if (!input) return null;
    if (input.closest) {
      var lbl = input.closest("label");
      if (lbl) return lbl;
    }
    if (input.id) {
      try {
        var forLbl = document.querySelector('label[for="' + CSS.escape(input.id) + '"]');
        if (forLbl) return forLbl;
      } catch (_e) {
        // Ignore invalid ID escape
      }
    }
    if (input.closest) {
      return input.closest("div, li, tr, p, section, fieldset") || input.parentElement;
    }
    return input.parentElement;
  }

  var RULES = [
    // Category 1: Urgency & Scarcity
    {
      id: "countdown_timer",
      category: "urgency",
      categoryKey: CATEGORY_MAP.urgency.key,
      categoryLabel: CATEGORY_MAP.urgency.label,
      name: "Countdown Timer Pressure",
      severity: "HIGH",
      description: "Displays a countdown timer or short deadline that may create time pressure during checkout.",
      advice: "Check whether the timer resets upon page reload or represents a verified promotion deadline before purchasing.",
      pattern: /(offer\s+expires\s+in|deal\s+ends\s+in|sale\s+ends\s+in|expires?\s+in\s+\d|closing\s+in\s+\d|time\s+left\s*:?\s*\d|ends\s+in\s+\d+\s*(h|hr|hrs|hour|hours|m|min|mins|s|sec|d|day)|order\s+within\s+\d+|complete\s+(checkout|order|payment)\s+now|\b\d{1,2}\s*:\s*\d{2}\s*:\s*\d{2}\b|\b\d{1,2}\s*h\s+\d{1,2}\s*m\b)/i,
      customChecker: function (doc) {
        var matches = [];
        var selector =
          '[class*="timer"], [id*="timer"], [class*="countdown"], [id*="countdown"], [class*="clock"], [id*="clock"], [class*="sale-ends"], [id*="sale-ends"], [class*="time-left"], [id*="time-left"], [class*="badge"], [id*="badge"], [class*="deal"], [id*="deal"], [class*="tag"], [id*="tag"]';
        var formatRe = /(\b\d{1,2}:\d{2}(:\d{2})?\b|\b\d+\s*h\s*\d+\s*m\b)/i;
        var labelRe = /(ends\s+in|time\s+left|expires\s+in|closing\s+in)/i;
        doc.querySelectorAll(selector).forEach(function (el) {
          if (!isVisible(el)) return;
          var txt = normalizeText(el.innerText || "");
          if (!txt || txt.length > 500) return;
          if (formatRe.test(txt) || labelRe.test(txt)) {
            matches.push({ element: el, snippet: txt });
          }
        });
        return matches;
      }
    },
    {
      id: "urgency_banner",
      category: "urgency",
      categoryKey: CATEGORY_MAP.urgency.key,
      categoryLabel: CATEGORY_MAP.urgency.label,
      name: "High-Pressure Urgency Banner",
      severity: "MEDIUM",
      description: "Uses high-urgency promotional wording that may nudge faster purchasing decisions.",
      advice: "Take time to compare prices across other retailers even when an offer is labeled as urgent.",
      pattern: /(limited[\s-]+time\s+(offer|deal|only|promo|sale)|flash\s+sale|lightning\s+deal|act\s+now|don't\s+miss\s+out|last\s+chance|final\s+hours|ending\s+soon|grab\s+it\s+before|\bhurry\b)/i
    },
    {
      id: "scarcity_pressure",
      category: "urgency",
      categoryKey: CATEGORY_MAP.urgency.key,
      categoryLabel: CATEGORY_MAP.urgency.label,
      name: "Artificial Scarcity Alert",
      severity: "LOW",
      description: "Displays a low-stock notification claiming minimal inventory remains.",
      advice: "Verify whether the stock claim reflects actual inventory before rushing your purchase.",
      pattern: /(only\s+\d+\s+(left|remaining)(\s+in\s+stock)?|just\s+\d+\s+left|hurry,?\s+only\s+\d+|almost\s+(gone|sold\s+out)|low\s+stock|limited\s+(stock|quantity|availability)|few\s+left\s+in\s+stock|selling\s+fast)/i
    },
    {
      id: "price_anchoring",
      category: "urgency",
      categoryKey: CATEGORY_MAP.urgency.key,
      categoryLabel: CATEGORY_MAP.urgency.label,
      name: "Exaggerated Savings / Price Anchoring",
      severity: "LOW",
      description: "Highlights a steep discount or crossed-out reference price to anchor perceived value.",
      advice: "Check independent price history to verify whether the reference price is a typical selling price.",
      pattern: /(was\s+[$₹€£]\s*\d[\d,.]*\s*(now|only)|save\s+up\s+to\s+\d+%|save\s+(7\d|8\d|9\d)%|\b(7\d|8\d|9\d)%\s+off\b|compare\s+at\s+[$₹€£]\s*\d|you\s+save\s+[$₹€£]?\s*\d)/i
    },

    // Category 2: Social Proof Manipulation
    {
      id: "social_proof_pressure",
      category: "social_proof",
      categoryKey: CATEGORY_MAP.social_proof.key,
      categoryLabel: CATEGORY_MAP.social_proof.label,
      name: "High-Demand / Viewer Pressure",
      severity: "MEDIUM",
      description: "Shows live viewer, buyer, or cart activity counters that cannot be independently verified.",
      advice: "Evaluate the product on its specs and price rather than unverified crowd activity figures.",
      pattern: /(\d+[k+]?\s+(people|shoppers|users|customers|visitors)\s+(are\s+)?(viewing|looking|watching|currently\s+viewing|bought|purchased|added)|\d+[k+]?\+?\s+(bought|sold)\s+(in\s+(the\s+)?past|recently|today|this\s+week|in\s+last)|in\s+\d+\+?\s+(people's\s+)?carts?|\d+\s+viewed\s+(in\s+past|today))/i
    },

    // Category 3: Confirmshaming
    {
      id: "confirmshaming_optout",
      category: "confirmshaming",
      categoryKey: CATEGORY_MAP.confirmshaming.key,
      categoryLabel: CATEGORY_MAP.confirmshaming.label,
      name: "Confirmshaming Opt-Out",
      severity: "HIGH",
      description: "Uses guilt-inducing or self-deprecating wording on a button or link to decline an offer.",
      advice: "Treat emotional decline wording neutrally and opt out if you do not want the offer.",
      pattern: /(no\s+thanks,?\s+i\s+(hate|prefer|don't|do\s+not|love\s+paying|want\s+to\s+pay)|no,?\s+i\s+(don't\s+want|prefer\s+paying|hate\s+saving)|i\s+hate\s+saving|i'?ll\s+pass\s+on\s+(saving|the\s+discount)|skip\s+(the\s+)?savings|i\s+prefer\s+full\s+price)/i
    },

    // Category 4: Sneak into Basket / Pre-selection
    {
      id: "prechecked_addon",
      category: "sneak_basket",
      categoryKey: CATEGORY_MAP.sneak_basket.key,
      categoryLabel: CATEGORY_MAP.sneak_basket.label,
      name: "Pre-Checked Add-on or Subscription",
      severity: "HIGH",
      description: "A paid add-on, protection plan, or recurring option appears pre-selected by default.",
      advice: "Review checked boxes and radio options carefully and uncheck any add-ons you do not want.",
      pattern: null,
      customChecker: function (doc) {
        var matches = [];
        var triggerRe = /(warranty|protection\s*plan|insurance|care\s*plan|vip\s*membership|vip\s*club|subscribe\s*&\s*save|auto-?renew|recurring|carbon\s*offset|tip\s*the\s*team|donate|priority\s*processing|expedited\s*processing|protection|membership|\+\s*[$₹€£]\d+)/i;
        var inputs = doc.querySelectorAll('input[type="checkbox"], input[type="radio"], [role="checkbox"]');
        inputs.forEach(function (inp) {
          var isSelected = inp.matches && inp.matches('[role="checkbox"]')
            ? inp.getAttribute("aria-checked") === "true"
            : Boolean(inp.checked);
          if (!isSelected) return;

          var container = getContainerForInput(inp);
          var visibleTarget = isVisible(container) ? container : (isVisible(inp) ? inp : null);
          if (!visibleTarget) return;

          var spanTarget = container ? container.querySelector("span") : null;
          var targetEl = (spanTarget && isVisible(spanTarget)) ? spanTarget : visibleTarget;

          var labelText = container ? normalizeText(container.innerText || "") : "";
          var outerBox = inp.closest ? inp.closest("div, li, tr, section, fieldset") : null;
          var surroundingText = outerBox ? normalizeText(outerBox.innerText || "") : "";
          var combined = (labelText || surroundingText).slice(0, 500);

          if (combined && triggerRe.test(combined)) {
            matches.push({ element: targetEl, snippet: labelText || combined });
          }
        });
        return matches;
      }
    },

    // Category 5: Threshold Trap / Basket Padding
    {
      id: "threshold_trap",
      category: "threshold_trap",
      categoryKey: CATEGORY_MAP.threshold_trap.key,
      categoryLabel: CATEGORY_MAP.threshold_trap.label,
      name: "Spending Threshold Trap (Basket Padding)",
      severity: "MEDIUM",
      description: "Prompts adding more items to reach a free shipping, discount, or cashback threshold.",
      advice: "Compare whether the added items cost more than the shipping fee or reward you would unlock.",
      pattern: /(add\s+[$₹€£]?\s*\d[\d,.]*\s+more\s+(to\s+(receive|unlock|get|qualify)|for\s+free)|spend\s+[$₹€£]?\s*\d[\d,.]*\s+more\s+(to|for)|you(?:'re|\s+are)\s+[$₹€£]?\s*\d[\d,.]*\s+away\s+from\s+(free|unlocking)|free\s+(shipping|delivery)\s+(on\s+orders\s+over|above)\s+[$₹€£]?\s*\d)/i
    },

    // Category 6: Checkout Upsell & Nagging
    {
      id: "subscription_push",
      category: "upsell_nagging",
      categoryKey: CATEGORY_MAP.upsell_nagging.key,
      categoryLabel: CATEGORY_MAP.upsell_nagging.label,
      name: "Intrusive Subscription / Co-Brand Push",
      severity: "MEDIUM",
      description: "Promotes a recurring membership or co-branded card offer alongside standard checkout actions.",
      advice: "Check recurring fees and membership terms before selecting a subscription or card offer.",
      pattern: /(save\s+(more|extra|\d+%)\s+with\s+(prime|plus|vip|pro|club|pass|membership|auto-?ship)|join\s+[\w\s]{1,24}(plus|prime|vip|club)\s+(to\s+save|for\s+free|today)|unlock\s+vip\s+.*(bundle|membership|savings)|apply\s+for\s+.*(store\s+card|credit\s+card))/i
    },
    {
      id: "checkout_upsell",
      category: "upsell_nagging",
      categoryKey: CATEGORY_MAP.upsell_nagging.key,
      categoryLabel: CATEGORY_MAP.upsell_nagging.label,
      name: "Checkout Nagging / Impulse Add-On",
      severity: "MEDIUM",
      description: "Presents optional add-on services, fees, or last-minute impulse items during checkout.",
      advice: "Verify whether expedited handling, protection fees, or add-on items are optional before paying.",
      pattern: /(priority\s+(courier|handling|shipping|packaging|delivery)|express\s+processing\s+fee|shipping\s+protection|package\s+protection|order\s+protection|delivery\s+insurance|add\s+gift\s+wrap|convenience\s+fee|platform\s+fee|handling\s+fee|frequently\s+bought\s+together|customers\s+also\s+added|don't\s+forget\s+to\s+add|upgrade\s+your\s+order)/i
    },

    // Category 7: Hidden Details & Deceptive Opt-Outs
    {
      id: "hidden_renewal",
      category: "hidden_details",
      categoryKey: CATEGORY_MAP.hidden_details.key,
      categoryLabel: CATEGORY_MAP.hidden_details.label,
      name: "Obscured Auto-Renewal Terms",
      severity: "HIGH",
      description: "Places automatic renewal charges or restrictive refund conditions inside brief fine-print text.",
      advice: "Read the renewal frequency, cancellation window, and return policy carefully before submitting payment.",
      pattern: /(auto-?renews?|renews?\s+automatically|recurring\s+(billing|charge|payment|subscription)|billed\s+(monthly|annually|yearly)|unless\s+cancell?ed|store\s+credit\s+only|non-?returnable|non-?refundable|final\s+sale|no\s+(returns|refunds)\s+allowed|restocking\s+fee)/i
    },
    {
      id: "low_contrast_optout",
      category: "hidden_details",
      categoryKey: CATEGORY_MAP.hidden_details.key,
      categoryLabel: CATEGORY_MAP.hidden_details.label,
      name: "Disguised / Low-Contrast Opt-Out",
      severity: "MEDIUM",
      description: "Renders a decline or dismissal option in very small text or reduced opacity compared to primary actions.",
      advice: "Look closely for small or faded dismissal links when declining promotional popups or offers.",
      pattern: null,
      customChecker: function (doc) {
        var matches = [];
        var dismissRe = /^(?:no\s+thanks|skip(?:\s+(?:offer|this|for\s+now))?|close|dismiss|continue\s+without(?:\s+.{1,40})?|maybe\s+later|not\s+now|x|×|✕)$/i;
        var closeOnlyRe = /^(?:x|×|✕)$/i;
        doc.querySelectorAll("a, button, span").forEach(function (el) {
          if (!isVisible(el)) return;
          var txt = normalizeText(el.innerText || "");
          if (!txt || txt.length > 80) return;
          if (!dismissRe.test(txt)) return;

          var style = window.getComputedStyle(el);
          if (!style) return;
          if (closeOnlyRe.test(txt)) {
            var interactive = el.tagName === "A" || el.tagName === "BUTTON" || el.getAttribute("role") === "button" || style.cursor === "pointer";
            if (!interactive) return;
          }

          var fontSize = parseFloat(style.fontSize);
          var opacity = parseFloat(style.opacity);
          if ((!isNaN(fontSize) && fontSize <= 11) || (!isNaN(opacity) && opacity <= 0.45)) {
            matches.push({ element: el, snippet: txt });
          }
        });
        return matches;
      }
    }
  ];

  window.__DPG_RULES__ = {
    CATEGORY_MAP: CATEGORY_MAP,
    SEVERITY_WEIGHTS: SEVERITY_WEIGHTS,
    TEXT_CANDIDATE_SELECTOR: TEXT_CANDIDATE_SELECTOR,
    EXCLUDED_TAGS: EXCLUDED_TAGS,
    RULES: RULES,
    normalizeText: normalizeText,
    isVisible: isVisible
  };
})();