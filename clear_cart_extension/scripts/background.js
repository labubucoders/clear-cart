/**
 * Background Service Worker
 * Updates the extension toolbar badge with the website grade (A-F) and handles tab lifecycle.
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'UPDATE_BADGE' && sender.tab) {
    const tabId = sender.tab.id;
    const grade = message.grade || '';
    const color = message.color || '#10b981';

    // Set badge text to the grade letter (A, B, C, D, F)
    chrome.action.setBadgeText({
      tabId: tabId,
      text: grade
    });

    // Set badge background color matching the severity
    chrome.action.setBadgeBackgroundColor({
      tabId: tabId,
      color: color
    });

    // Set badge text color to white for contrast
    if (chrome.action.setBadgeTextColor) {
      chrome.action.setBadgeTextColor({
        tabId: tabId,
        color: '#FFFFFF'
      });
    }

    sendResponse({ status: 'badge_updated' });
  }
  return true;
});

// Clear badge when tab navigates to a new URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({
      tabId: tabId,
      text: '...'
    });
    chrome.action.setBadgeBackgroundColor({
      tabId: tabId,
      color: '#64748b'
    });
  }
});
