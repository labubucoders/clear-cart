# 🛡️ Dark Pattern Detector & Website Grader (Chrome Extension)

An AI & heuristic-powered Chrome Extension (Manifest V3) that inspects e-commerce websites in real-time, detects deceptive psychological manipulation (dark patterns), and calculates an **A to F** consumer transparency grade.

---

## 🌟 Key Features

1. **Automated On-Device Scanning**: Runs 100% locally on your computer with zero external server dependencies, zero cost, and total privacy.
2. **Dynamic A–F Grading System**:
   - **Grade A (90–100%)**: Safe, transparent, and consumer-friendly.
   - **Grade B (80–89%)**: Low concern, minor urgency cues.
   - **Grade C (70–79%)**: Moderate risk, questionable marketing tactics.
   - **Grade D (60–69%)**: High risk, frequent manipulation.
   - **Grade F (< 60%)**: Severe / predatory psychological traps.
3. **Detected Dark Pattern Categories**:
   - ⏱️ **Urgency & Fake Countdown**: Countdown timers, ticking clocks, *"Deal expires in..."*, *"Hurry before it's gone!"*
   - 👥 **Social Proof Manipulation**: Fake viewer counters (*"42 people viewing right now"*), inflated demand notifications.
   - 😒 **Confirmshaming**: Manipulative decline buttons (*"No thanks, I hate saving money and prefer paying full price"*).
   - 🛒 **Sneak into Basket & Pre-Selection**: Default-checked add-on checkboxes for warranties, insurance, subscriptions, or donations.
   - 🕵️ **Obstruction & Hidden Costs**: Hidden auto-renewal clauses buried in fine print, disguised faint cancel links, and low-contrast opt-outs.
4. **Interactive In-Page Highlighter**: Turn on the highlight switch to view glowing animated borders and badges directly over manipulative elements on the webpage.
5. **Jump & Locate**: Click any detected item in the popup to smoothly scroll directly to that element on the shopping page and pulse it.
6. **Live Toolbar Badge**: Displays the current website's letter grade (A, B, C, D, or F) and color-coded background on your browser toolbar at a glance.

---

## 🚀 How to Install in Google Chrome

1. Open Google Chrome and type `chrome://extensions` in the address bar.
2. Toggle on **Developer mode** in the top right corner.
3. Click the **Load unpacked** button in the top left corner.
4. Select the project directory:
   ```
   ~/Documents/chrome_extension
   ```
5. Click **Select / Open**. The extension **"Dark Pattern Detector & Site Grader"** is now installed and active!
6. Pin the extension to your Chrome toolbar for easy access.

---

## ⚙️ Settings (gear icon in the popup)

- **Theme**: Light, Dark or System. Light uses the blue pastel palette. The choice is remembered.
- **Language**: English, Español, हिन्दी. Translates the whole popup, including category names, trap titles, advice and the score summary. The choice is remembered.
- **Auto-scan pages**: saved to `chrome.storage.local` as `autoScan`. The scanner in `scripts/` does not read it yet, so pages are still scanned on load.
- **Highlight traps on page**: same switch as the Highlight toggle in the header.
- **Test demo site**: opens the ShadyMart test store.
- **Clear scan history**: clears stored scan data.

---

## 🧪 How to Test with the Built-In Playground

A mock e-commerce store (`ShadyMart`) is included in `test-store/index.html` featuring real-world examples of all dark pattern types.

### Option 1: Serve Locally (Recommended)
Run a local test server from terminal:
```bash
cd ~/Documents/chrome_extension
python3 -m http.server 8080
```
Then open:
[http://localhost:8080/test-store/index.html](http://localhost:8080/test-store/index.html)

### Option 2: Open File Directly
Open `test-store/index.html` directly in Chrome. *(Note: If testing via `file://`, enable "Allow access to file URLs" in `chrome://extensions` -> Details for this extension).*

### Testing the Features:
- Watch the toolbar badge show **F** (Severe Manipulation).
- Click the extension icon to see the Transparency Score (~35/100) and full breakdown.
- Click **"Highlight on Page"** to see glowing outlines on the timers, pre-checked boxes, and alerts.
- Click **"🧹 Clean Site (Turn Patterns Off -> Grade A)"** on the test store to watch the score instantly rise to **Grade A**!
- Click **"⚠️ Trigger Confirmshaming Popup"** to test dynamic detection of exit-intent modals via `MutationObserver`.

---

## 📁 Project Architecture

```
chrome_extension/
├── manifest.json              # Chrome Manifest V3 configuration
├── icons/                     # Generated 16x16, 48x48, 128x128 icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── scripts/
│   ├── rules.js               # Taxonomy, regex rules, severity weights, and grading logic
│   ├── detector.js            # DOM scanner, visibility checker, and score calculator
│   ├── highlighter.js         # In-page element outlines, tooltips, and smooth scroller
│   ├── highlighter.css        # Visual styles for in-page overlays (.dp- namespaces)
│   ├── content.js             # Content script coordinator & debounced MutationObserver
│   └── background.js          # Service worker for dynamic toolbar badge updates
├── popup/
│   ├── popup.html             # Popup UI: score card, pattern breakdown, trap list, Settings screen
│   ├── popup.css              # Dark + light (blue pastel) themes
│   └── popup.js               # UI logic, EN/ES/HI translations, adapter for scripts/detector.js reports
└── test-store/
    ├── index.html             # ShadyMart mock test store
    ├── test-store.css         # Styles for test store
    └── test-store.js          # Interactive scripts (ticking timer, toggles, modal)
```

---

## 🛡️ Privacy & Compliance
- **Zero Data Collection**: No browsing data, HTML, or personal information is ever transmitted off the device.
- **Manifest V3 Compliant**: Built strictly adhering to Chrome's latest extension security guidelines.
