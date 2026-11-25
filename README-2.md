# ClearCart

**On-device e-commerce transparency inspector, deceptive pattern detector, and Manifest V3 Chrome Extension.**

ClearCart analyzes checkout pages, product listings, and cart drawers locally inside your browser to surface manipulative UI practices (dark patterns), outline every detected element simultaneously on the page, and compute a real-time **Transparency Score (0–100)** with a letter grade (**A–F**).

The repository includes both:
- An **interactive browser simulator & inspector web app** (featuring ShadyMart, LuxeDrops, PureGoods, and a Custom Text Lab)
- A **one-click Manifest V3 Chrome Extension packager** (`clearcart-chrome-extension.zip`) ready to load unpacked in Google Chrome

---

## Features

- **100% On-Device Detection**: All DOM inspection, text normalization, regex matching, and scoring run locally in the browser. No page data leaves your device.
- **12 Detection Rules Across 7 Categories**: Combines normalized visible-text regex rules with three custom DOM inspectors (countdown timers, pre-selected add-ons, and low-contrast opt-outs).
- **Innermost Element Targeting**: Recursively locates the exact visible element responsible for a trap (`findInnermostMatch()`) rather than highlighting broad wrapper containers.
- **Simultaneous Page Highlighting**: Outlines every detected pattern on the page at once with a dotted red border (`2px dotted #EF4444`) and non-overlapping floating `SEVERITY · Name` labels, plus smooth scroll-to-element emphasis (`Locate`).
- **Dynamic Content Monitoring**: A debounced `MutationObserver` (`600ms`) watches DOM additions, visibility/style changes, and checkbox/radio updates to automatically catch late-loading banners, modals, and dynamically injected upsells.
- **Transparency Score & Toolbar Grade**: Deducts points per finding (`HIGH: -30`, `MEDIUM: -15`, `LOW: -5`) and updates the Chrome toolbar extension badge with the page's letter grade (`A`–`F`).
- **Multilingual & Theme Support**: Supports **English**, **Spanish (Español)**, and **Hindi (हिन्दी)** UI localization along with **Dark**, **Light**, and **System** theme modes.
- **Bundled Test Sandbox (`ShadyMart`)**: Ships an interactive test storefront inside the web app and inside the extension (`test-store/index.html`) so you can verify detections, toggle traps on/off, and test live rescans.

---

## Detection Rules & Categories

| # | Rule ID | Rule Name | Category | Severity | Mechanism |
|---|---------|-----------|----------|----------|-----------|
| 1 | `countdown_timer` | Countdown Timer Pressure | Urgency & Scarcity | `HIGH` | Custom DOM + Regex |
| 2 | `urgency_banner` | High-Pressure Urgency Banner | Urgency & Scarcity | `MEDIUM` | Regex |
| 3 | `scarcity_pressure` | Artificial Scarcity Alert | Urgency & Scarcity | `LOW` | Regex |
| 4 | `price_anchoring` | Exaggerated Savings / Price Anchoring | Urgency & Scarcity | `LOW` | Regex |
| 5 | `social_proof_pressure` | High-Demand / Viewer Pressure | Social Proof Manipulation | `MEDIUM` | Regex |
| 6 | `confirmshaming_optout` | Confirmshaming Opt-Out | Confirmshaming | `HIGH` | Regex |
| 7 | `prechecked_addon` | Pre-Checked Add-on or Subscription | Sneak into Basket / Pre-selection | `HIGH` | Custom DOM |
| 8 | `threshold_trap` | Spending Threshold Trap (Basket Padding) | Threshold Trap / Basket Padding | `MEDIUM` | Regex |
| 9 | `subscription_push` | Intrusive Subscription / Co-Brand Push | Checkout Upsell & Nagging | `MEDIUM` | Regex |
| 10 | `checkout_upsell` | Checkout Nagging / Impulse Add-On | Checkout Upsell & Nagging | `MEDIUM` | Regex |
| 11 | `hidden_renewal` | Obscured Auto-Renewal Terms | Hidden Details & Deceptive Opt-Outs | `HIGH` | Regex |
| 12 | `low_contrast_optout` | Disguised / Low-Contrast Opt-Out | Hidden Details & Deceptive Opt-Outs | `MEDIUM` | Custom DOM |

---

## Transparency Score & Grading

Starting from **100**, each unique trap detection deducts points based on severity (floored at `0`):

- **HIGH**: `-30` points
- **MEDIUM**: `-15` points
- **LOW**: `-5` points

| Score Range | Grade | Status |
|-------------|-------|--------|
| `90 – 100` | **A** | Transparent |
| `80 – 89` | **B** | Low Risk |
| `70 – 79` | **C** | Moderate Risk |
| `60 – 69` | **D** | Deceptive Patterns |
| `< 60` | **F** | High Manipulation |

---

## Installing the Chrome Extension

You can generate a ready-to-load Chrome Extension directly from the web app:

1. Start or open the ClearCart web app and click **`Download Extension (.zip)`** in the top bar.
2. Extract `clearcart-chrome-extension.zip` to a permanent folder on your machine.
3. Open Google Chrome and navigate to `chrome://extensions`.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the extracted folder.
6. Pin **ClearCart** from the Extensions toolbar menu. Open any storefront—or launch the built-in **ShadyMart** test store from **Settings → Test demo site → Open**—to inspect detections.

### Packaged Extension Structure

```text
clearcart-chrome-extension/
├── manifest.json          # Manifest V3 configuration
├── background.js          # Service worker updating the A–F toolbar grade badge
├── rules.js               # 12 detection rules, text normalization & visibility filters
├── highlighter.js         # Simultaneous dotted red outlines & non-overlapping labels
├── content.js             # Multi-layer DOM scanner & debounced MutationObserver
├── popup.html             # Extension popup UI
├── popup.css              # Popup styling (dark & light themes)
├── popup.js               # Popup controller, localization & tab messaging
├── icons/                 # 16px, 48px, 128px PNG extension icons
└── test-store/            # Local ShadyMart interactive sandbox
```

---

## Local Development

### Prerequisites

- **Node.js** 18+ and **npm** (or **bun**)

### Commands

```bash
# Install dependencies
npm install

# Start the development server on port 3000
npm run dev

# Type-check with TypeScript
npm run lint

# Build the production bundle into dist/
npm run build
```

---

## Repository Structure

```text
├── index.html                        # App entry HTML
├── metadata.json                     # App metadata
├── package.json                      # Dependencies and npm scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite + Tailwind CSS configuration
└── src/
    ├── App.tsx                       # Simulated browser workspace & extension packager triggers
    ├── main.tsx                      # React entry point
    ├── index.css                     # Global styles & ClearCart theme variables
    ├── components/
    │   ├── ClearCartPopup.tsx        # Extension popup UI & settings view
    │   └── SimulatedStoreView.tsx    # Interactive store tabs & inline trap highlighter
    ├── data/
    │   └── stores.ts                 # Demo store metadata & custom text lab snippet
    ├── types/
    │   └── clearcart.ts              # Shared TypeScript interfaces & categories
    └── utils/
        ├── extensionZip.ts           # In-browser Manifest V3 Chrome extension ZIP generator
        ├── i18n.ts                   # English, Spanish, and Hindi translations
        └── scanner.ts                # Heuristic text & demo store scanner
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Extension Packaging**: JSZip + Canvas-rendered PNG icons generated client-side
- **Browser APIs**: Chrome Extensions Manifest V3 (`activeTab`, `storage`, `tabs`, `scripting`), `MutationObserver`, `window.getComputedStyle`

---

## Privacy

ClearCart operates entirely on-device. It does not collect browsing history, transmit page contents to external servers, or include third-party analytics or tracking.
