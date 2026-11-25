/**
 * Dark Pattern Detection Rules & Taxonomy
 * Defines heuristics, patterns, severity penalties, and categories.
 */

const DarkPatternRules = {
  // Severity point deductions
  SEVERITIES: {
    LOW: { weight: 5, label: 'Low', badgeClass: 'severity-low' },
    MEDIUM: { weight: 15, label: 'Medium', badgeClass: 'severity-medium' },
    HIGH: { weight: 30, label: 'High', badgeClass: 'severity-high' }
  },

  // Categories
  CATEGORIES: {
    URGENCY: {
      id: 'urgency',
      name: 'Urgency & Scarcity',
      icon: '⏱️',
      description: 'Manufactured time pressure and artificial scarcity to rush purchase decisions.'
    },
    SOCIAL_PROOF: {
      id: 'social_proof',
      name: 'Social Proof Manipulation',
      icon: '👥',
      description: 'Activity counters or fake notifications showing who else is supposedly viewing or buying.'
    },
    CONFIRMSHAMING: {
      id: 'confirmshaming',
      name: 'Confirmshaming',
      icon: '😒',
      description: 'Emotionally manipulative decline options designed to guilt users into complying.'
    },
    PRESELECTION: {
      id: 'preselection',
      name: 'Sneak into Basket / Pre-selection',
      icon: '🛒',
      description: 'Pre-checked checkboxes or default add-ons for warranties, subscriptions, or extra charges.'
    },
    BASKET_PADDING: {
      id: 'basket_padding',
      name: 'Threshold Trap / Basket Padding',
      icon: '💸',
      description: 'Pressuring you to add extra unneeded items to hit arbitrary cashback, discount, or delivery tiers.'
    },
    UPSELL_NAG: {
      id: 'upsell_nag',
      name: 'Checkout Upsell & Nagging',
      icon: '📢',
      description: 'Intrusive subscription pushes (Prime, VIP) and "You might have missed" impulse carousels.'
    },
    OBSTRUCTION: {
      id: 'obstruction',
      name: 'Hidden Details & Deceptive Opt-Outs',
      icon: '🕵️',
      description: 'Subtle fine-print auto-renewals, tiny obscure cancel links, or low-contrast disclosures.'
    }
  },

  // Rules list
  RULES: [
    // 1. COUNTDOWN TIMERS
    {
      id: 'countdown_timer',
      category: 'urgency',
      name: 'Countdown Timer Pressure',
      severity: 'MEDIUM',
      description: 'A ticking or simulated countdown timer designed to pressure you into checking out.',
      advice: 'Most e-commerce timers reset on page reload or clearing cookies. Don\'t rush.',
      regex: /\b(?:ends?\s+in\s+\d{1,2}:\d{2}(?::\d{2})?|ends?\s+in\s+\d+\s*(?:h|hr|hours?|m|min|mins?|days?)(?:\s*,?\s*\d+\s*(?:m|min|mins?|s|sec|secs?))?|time\s+left\s*[:\-]?\s*\d{1,2}:\d{2}(?::\d{2})?)\b/i,
      customChecker: (element) => {
        const text = (element.innerText || '').trim();
        if (!text || text.length > 120) return false;

        // Check for countdown timer digits like 00:14:59 or 12h 34m
        const matchesDigits = /\b\d{1,2}\s*:\s*\d{2}(?:\s*:\s*\d{2})?\b/.test(text) ||
                              /\b\d{1,2}\s*(?:h|hr|hours?)\s*\d{1,2}\s*(?:m|min|mins?)\b/i.test(text);

        // Explicit countdown labels like "Ends in 05:52:21"
        const hasTimeLabel = /\b(?:ends?\s+in|time\s+left|expires?\s+in|closing\s+in)\b/i.test(text);
        if (hasTimeLabel && matchesDigits) return true;

        // Common countdown classes
        const isTimerClass = /timer|countdown|clock|sale-ends|time-left/i.test(element.className + ' ' + element.id);
        return isTimerClass && matchesDigits;
      }
    },

    // 2. ARTIFICIAL URGENCY COPY
    {
      id: 'urgency_copy',
      category: 'urgency',
      name: 'High-Pressure Urgency Banner',
      severity: 'MEDIUM',
      description: 'Statements warning that time is running out or a deal is abruptly disappearing.',
      advice: 'Retailers frequently run evergreen "deals" that reappear or never truly expire.',
      regex: /\b(?:limited[\s-]time\s+(?:deal|offer|discount|price|savings?|event)|deal\s+of\s+the\s+day|lightning\s+deals?|deal\s+selling\s+fast|deal\s+expires\s+in|sale\s+ends\s+in|offer\s+expires\s+soon|hurry,\s+sale\s+ends|time\s+is\s+running\s+out|order\s+within\s+the\s+next|before\s+it'?s\s+gone)\b/i
    },

    // 3. SCARCITY & LOW STOCK ALERTS
    {
      id: 'scarcity_pressure',
      category: 'urgency',
      name: 'Artificial Scarcity Alert',
      severity: 'LOW',
      description: 'Claims of minimal stock remaining or impending sell-outs.',
      advice: 'Often randomized or triggered regardless of actual warehouse inventory.',
      regex: /\b(only\s+\d+\s+left\s+in\s+stock|almost\s+sold\s+out|limited\s+supply|only\s+\d+\s+remaining|low\s+inventory|almost\s+gone|selling\s+fast)\b/i
    },

    // 4. FAKE OR MANIPULATED SOCIAL PROOF
    {
      id: 'fake_viewers',
      category: 'social_proof',
      name: 'High-Demand / Viewer Pressure',
      severity: 'MEDIUM',
      description: 'Counters indicating numerous other people are currently viewing or buying this exact item.',
      advice: 'Many online shops generate viewer numbers dynamically from random number scripts.',
      regex: /\b(\d+\s*(?:people|shoppers|customers|others)\s*(?:are\s*)?(?:looking\s*at|viewing|watching|browsing|have\s*this\s*in\s*their\s*cart)|bought\s*\d+\s*times\s*in\s*(?:the\s*last)?\s*\d+\s*(?:hours?|minutes?)|high\s*demand\s*item|someone\s*just\s*bought|recently\s*purchased\s*by)\b/i
    },

    // 5. THRESHOLD SPENDING TRAP / BASKET PADDING (e.g. "Add ₹82 more for ₹100 Cashback")
    {
      id: 'threshold_spending_nudge',
      category: 'basket_padding',
      name: 'Spending Threshold Trap (Basket Padding)',
      severity: 'MEDIUM',
      description: 'Nudges you to buy extra unneeded items to hit an arbitrary cashback, reward, or free delivery tier.',
      advice: 'Spending ₹82 to earn a ₹100 cashback or save on delivery still inflates your out-of-pocket expenses. Stick to what you actually need.',
      regex: /\b(?:add|shop\s+for|spend)\s+(?:[₹$€£]|rs\.?|inr\s*)?\s*\d+(?:[.,]\d+)?\s*(?:[₹$€£]|rs\.?|inr)?\s*more(?:\s+(?:for|to\s+(?:get|unlock|avail|qualify|save)))?|\b(?:add|shop\s+for|spend)\s+items\s+worth\s+(?:[₹$€£]|rs\.?|inr\s*)?\s*\d+|\b(?:[₹$€£]|rs\.?|inr\s*)?\s*\d+(?:[.,]\d+)?\s*away\s+from\s+(?:free\s+delivery|cashback|unlocking|discount)\b/i
    },

    // 6. INTRUSIVE SUBSCRIPTION & CO-BRAND UPSELL (e.g. "Save more with Prime", "Join Prime")
    {
      id: 'subscription_upsell_interstitial',
      category: 'upsell_nag',
      name: 'Intrusive Subscription / Co-Brand Push',
      severity: 'HIGH',
      description: 'Promoting a paid recurring subscription (e.g., Prime, VIP, Plus) or store credit card directly inside the checkout flow.',
      advice: 'Retailers disrupt checkout with subscription perks to convert one-off shoppers into recurring monthly payers.',
      regex: /\b(?:save\s+more\s+with\s+(?:prime|vip|plus|membership|walmart\+|redcard|target\s+circle|[a-z\s]+member\w*)|join\s+(?:prime|vip|membership|club)\b|extra\s+[\d%.\s]+\s*back\s+on\s+(?:amazon\s+pay|credit\s+card|[a-z\s]+card)|unlock\s+free\s+delivery\s+with\s+prime|upgrade\s+to\s+prime\s+to\s+save|save\s+with\s+prime\b)/i
    },

    // 7. CHECKOUT NAGGING & IMPULSE UPSELL (e.g. "You might have missed", "Forgot something?")
    {
      id: 'checkout_nagging_upsell',
      category: 'upsell_nag',
      name: 'Checkout Nagging / Impulse Add-On',
      severity: 'MEDIUM',
      description: 'Impulse add-on shelves like "You might have missed" placed right before checkout to trigger FOMO and basket inflation.',
      advice: 'Just like candy at a supermarket checkout line, these items are placed to provoke impulsive last-second purchases.',
      regex: /\b(?:you\s+(?:might|may)\s+have\s+missed|items\s+you\s+(?:might|may)\s+have\s+missed|(?:did\s+you\s+)?forg[eo]t(?:ten)?\s+something\??|don'?t\s+forget\s+(?:to\s+add|these)?|before\s+you\s+(?:checkout|pay|place\s+order)|last\s+minute\s+(?:deals?|additions?)|customers?\s+also\s+(?:bought|added)\s+with\s+this|frequently\s+bought\s+together|complete\s+your\s+order\s+with)\b/i
    },

    // 8. EXAGGERATED SAVINGS & STAGED ANCHORING (e.g. "You're saving ₹772", "MRP savings")
    {
      id: 'staged_savings_anchoring',
      category: 'urgency',
      name: 'Exaggerated Savings / Price Anchoring',
      severity: 'LOW',
      description: 'Highlighting inflated reference prices, crossed-out list prices, or staged "MRP savings" to artificially magnify perceived deals.',
      advice: 'Stated "MRP savings" are often anchored against inflated manufacturer suggested prices that items rarely sell for.',
      regex: /\b(?:you'?re\s+saving\s+(?:[₹$€£]|rs\.?|inr\s*)?\s*\d+|mrp\s+savings|total\s+savings\s+(?:[₹$€£]|rs\.?|inr\s*)?\s*\d+|save\s+\d+%\s+on\s+mrp)\b/i
    },

    // 9. CONFIRMSHAMING
    {
      id: 'confirmshaming_optout',
      category: 'confirmshaming',
      name: 'Confirmshaming Opt-Out',
      severity: 'HIGH',
      description: 'Manipulative wording on decline buttons designed to make you feel guilty or foolish for saying no.',
      advice: 'You have every right to decline without feeling shame. Click decline with confidence.',
      regex: /\b(no,?\s*(?:thanks,?\s*)?(?:I\s*(?:hate|don'?t\s*want|prefer\s*not)\s*(?:saving|to\s*save|discounts?|deals?|money|to\s*look\s*good)|I'?ll\s*pay\s*full\s*price|I\s*prefer\s*(?:paying\s*)?full\s*price|I\s*don'?t\s*care\s*about|I'?d\s*rather\s*pay\s*more|no\s*thanks,?\s*I\s*hate\s*free\s*shipping))\b/i
    },

    // 10. PRE-CHECKED ADD-ONS & SNEAK INTO BASKET
    {
      id: 'prechecked_addon',
      category: 'preselection',
      name: 'Pre-Checked Add-on or Subscription',
      severity: 'HIGH',
      description: 'An optional paid item, warranty, protection plan, or recurring donation pre-selected by default.',
      advice: 'Always double-check your cart subtotal to verify no unauthorized extras were added.',
      customChecker: (element) => {
        if (element.tagName !== 'INPUT' || (element.type !== 'checkbox' && element.type !== 'radio')) {
          return false;
        }
        if (!element.checked) return false;

        const label = element.labels?.[0]?.innerText || '';
        const parentText = element.closest('label, div, li, tr')?.innerText || '';
        const combined = (label + ' ' + parentText).toLowerCase();

        const triggerKeywords = [
          'warranty', 'protection plan', 'insurance', 'care plan',
          'vip membership', 'vip club', 'subscribe & save', 'auto-renew',
          'recurring', 'carbon offset', 'tip the team', 'donate',
          'priority processing', 'expedited processing'
        ];

        return triggerKeywords.some(kw => combined.includes(kw));
      }
    },

    // 11. HIDDEN AUTO-RENEWAL / FORCED CONTINUITY
    {
      id: 'hidden_renewal',
      category: 'obstruction',
      name: 'Obscured Auto-Renewal Terms',
      severity: 'HIGH',
      description: 'Fine-print recurring charges or subscriptions buried under one-time purchase promises.',
      advice: 'Ensure you understand whether you are making a one-time purchase or committing to a recurring charge.',
      regex: /\b(renews\s*automatically\s*at|billed\s*monthly\s*after\s*trial|recurring\s*charge\s*of|auto-renewal\s*applies|until\s*cancelled\s*at\s*regular\s*price|billed\s*\$\d+.*every\s*(?:month|year))\b/i
    },

    // 12. DECEPTIVE OR LOW-CONTRAST OPT-OUT
    {
      id: 'low_contrast_optout',
      category: 'obstruction',
      name: 'Disguised / Low-Contrast Opt-Out',
      severity: 'MEDIUM',
      description: 'The opt-out or close link has been made deliberately tiny or hard to read compared to the accept button.',
      advice: 'Look closely at the bottom edges of modals for faint or tiny dismiss links.',
      customChecker: (element) => {
        if (element.tagName !== 'A' && element.tagName !== 'BUTTON' && element.tagName !== 'SPAN') return false;
        const text = (element.innerText || '').trim();
        if (!text || text.length > 50) return false;
        
        const isDismiss = /^(no thanks|skip|close|dismiss|continue without|maybe later|not now|x)$/i.test(text);
        if (!isDismiss) return false;

        const style = window.getComputedStyle(element);
        const fontSize = parseFloat(style.fontSize) || 16;
        const opacity = parseFloat(style.opacity) || 1;
        
        return fontSize <= 11 || opacity <= 0.45;
      }
    }
  ],

  /**
   * Calculate Grade (A to F) based on a 100-point weighted score.
   */
  calculateGrade(score) {
    if (score >= 90) return { grade: 'A', status: 'Excellent', color: '#059669', message: 'Transparent & Respectful' };
    if (score >= 80) return { grade: 'B', status: 'Good', color: '#0284c7', message: 'Minor urgency cues detected' };
    if (score >= 70) return { grade: 'C', status: 'Fair', color: '#d97706', message: 'Moderate manipulation present' };
    if (score >= 60) return { grade: 'D', status: 'Poor', color: '#ea580c', message: 'High pressure & deceptive tactics' };
    return { grade: 'F', status: 'Severe', color: '#dc2626', message: 'Predatory psychological manipulation' };
  }
};

if (typeof window !== 'undefined') {
  window.DarkPatternRules = DarkPatternRules;
}
