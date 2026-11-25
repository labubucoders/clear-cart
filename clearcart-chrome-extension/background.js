(function () {
  "use strict";

  var tabReports = new Map();

  var GRADE_COLORS = {
    A: "#2E8B57",
    B: "#3B82F6",
    C: "#D97706",
    D: "#F42929",
    F: "#780606"
  };

  function updateBadgeForTab(tabId, report) {
    if (typeof tabId !== "number" || !report || !chrome.action) return;
    var grade = report.grade || "-";
    var color = GRADE_COLORS[grade] || "#3A3531";
    chrome.action.setBadgeText({ tabId: tabId, text: String(grade) });
    chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: color });
  }

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (!msg) return;
    var action = msg.action || msg.type;
    var tabId = sender && sender.tab ? sender.tab.id : msg.tabId;

    if ((action === "SCAN_COMPLETED" || action === "UPDATE_BADGE") && msg.report) {
      if (typeof tabId === "number") {
        tabReports.set(tabId, msg.report);
        updateBadgeForTab(tabId, msg.report);
      }
      if (sendResponse) sendResponse({ ok: true });
    } else if (action === "GET_CACHED_REPORT" && typeof tabId === "number") {
      if (sendResponse) sendResponse({ report: tabReports.get(tabId) || null });
    }
  });

  if (chrome.tabs && chrome.tabs.onRemoved) {
    chrome.tabs.onRemoved.addListener(function (tabId) {
      tabReports.delete(tabId);
    });
  }
})();