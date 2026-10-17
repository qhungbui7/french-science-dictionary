/**
 * French Science Dictionary - Options Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const optAutoTranslate = document.getElementById('optAutoTranslate');
  const optTriggerMode = document.getElementById('optTriggerMode');
  const optAutoPronounce = document.getElementById('optAutoPronounce');
  const optOnlineFallback = document.getElementById('optOnlineFallback');
  const optClearHistoryBtn = document.getElementById('optClearHistoryBtn');
  const optClearFavsBtn = document.getElementById('optClearFavsBtn');
  const saveToast = document.getElementById('saveToast');

  function showToast(msg = 'Settings saved') {
    saveToast.textContent = msg;
    saveToast.classList.add('visible');
    setTimeout(() => {
      saveToast.classList.remove('visible');
    }, 2000);
  }

  // Load existing settings
  chrome.storage.local.get(['settings'], (res) => {
    const s = res.settings || {};
    if (s.autoTranslate !== undefined) optAutoTranslate.checked = s.autoTranslate;
    if (s.triggerMode) optTriggerMode.value = s.triggerMode;
    if (s.autoPronounce !== undefined) optAutoPronounce.checked = s.autoPronounce;
    if (s.enableOnlineFallback !== undefined) optOnlineFallback.checked = s.enableOnlineFallback;
  });

  // Save changes
  function save() {
    const newSettings = {
      autoTranslate: optAutoTranslate.checked,
      triggerMode: optTriggerMode.value,
      autoPronounce: optAutoPronounce.checked,
      enableOnlineFallback: optOnlineFallback.checked
    };

    chrome.storage.local.set({ settings: newSettings }, () => {
      showToast('Settings updated');
    });
  }

  optAutoTranslate.addEventListener('change', save);
  optTriggerMode.addEventListener('change', save);
  optAutoPronounce.addEventListener('change', save);
  optOnlineFallback.addEventListener('change', save);

  // Clear History
  optClearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your translation history?')) {
      chrome.storage.local.set({ history: [] }, () => {
        showToast('History cleared');
      });
    }
  });

  // Clear Favorites
  optClearFavsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to remove all saved favorites?')) {
      chrome.storage.local.set({ favorites: [] }, () => {
        showToast('Favorites cleared');
      });
    }
  });
});
