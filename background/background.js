/**
 * French Science Dictionary - Background Service Worker (Manifest V3)
 * Handles context menus, online fallback translation, and local cache synchronization.
 */

// Install / Startup listener
chrome.runtime.onInstalled.addListener(() => {
  // Initialize default settings if not already present
  chrome.storage.local.get(['settings', 'favorites', 'history', 'translationCache'], (res) => {
    const defaults = {
      autoTranslate: true,
      triggerMode: 'button', // 'button' (default: click button to translate) | 'instant' | 'alt'
      theme: 'dark',
      autoPronounce: false,
      enableOnlineFallback: true
    };

    chrome.storage.local.set({
      settings: Object.assign(defaults, res.settings || {}),
      favorites: res.favorites || [],
      history: res.history || [],
      translationCache: res.translationCache || {}
    });
  });

  // Create Context Menu for highlighted selection
  chrome.contextMenus.create({
    id: 'translate-scientific-french',
    title: 'Translate French Science: "%s"',
    contexts: ['selection']
  });
});

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-scientific-french' && info.selectionText && tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'translate_selection',
      text: info.selectionText.trim()
    });
  }
});

// Online fallback translation helper
async function fetchOnlineFallback(text) {
  const clean = text.trim();
  if (!clean) return null;

  // Enforce online fallback preference in shared service worker logic
  const settingsData = await chrome.storage.local.get(['settings']);
  const currentSettings = settingsData.settings || {};
  if (currentSettings.enableOnlineFallback === false) {
    return null;
  }

  // Check cache first
  const cacheKey = clean.toLowerCase();
  const cacheData = await chrome.storage.local.get(['translationCache']);
  const cache = cacheData.translationCache || {};
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    // 1. Query MyMemory translation API
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=fr|en`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API network response error');

    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      let translated = data.responseData.translatedText;
      // Filter out duplicate or junk responses
      if (translated.toLowerCase() !== clean.toLowerCase()) {
        const result = {
          fr: clean,
          en: translated,
          category: 'general',
          pos: '',
          definition: `Online translation for « ${clean} ».`,
          note: 'Online translation fallback. For standard terms, check precision against domain literature.',
          examples: []
        };

        // Cache the result
        cache[cacheKey] = result;
        chrome.storage.local.set({ translationCache: cache });
        return result;
      }
    }
  } catch (err) {
    console.warn('Fallback translation failed:', err);
  }

  return null;
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate_fallback' && request.text) {
    fetchOnlineFallback(request.text).then((result) => {
      if (result) {
        sendResponse({ success: true, result });
      } else {
        sendResponse({ success: false });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'clear_history') {
    chrome.storage.local.set({ history: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'clear_favorites') {
    chrome.storage.local.set({ favorites: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
