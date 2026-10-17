/**
 * French Science Dictionary - Content Script
 * Automatically triggers precision French-to-English translation upon text selection.
 * Injects a scoped Shadow DOM to ensure zero CSS collision with host web pages.
 */

(function () {
  'use strict';

  // Prevent double-initialization
  if (window.__FSD_INITIALIZED__) return;
  window.__FSD_INITIALIZED__ = true;

  let hostElement = null;
  let shadowRoot = null;
  let cardElement = null;
  let triggerIconElement = null;
  let activeEntry = null;
  let activeSelectionText = '';
  let isBookmarked = false;

  // Default User Settings
  let settings = {
    autoTranslate: true,
    triggerMode: 'instant', // 'instant' | 'icon' | 'alt'
    theme: 'dark',
    autoPronounce: false,
    enableOnlineFallback: true
  };

  // Load settings from chrome storage if available
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['settings'], (res) => {
      if (res && res.settings) {
        settings = Object.assign(settings, res.settings);
      }
    });

    // Listen for setting changes
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.settings) {
        settings = Object.assign(settings, changes.settings.newValue);
      }
    });
  }

  // Inject or retrieve Shadow DOM host
  function getOrCreateShadowRoot() {
    if (shadowRoot) return shadowRoot;

    hostElement = document.createElement('div');
    hostElement.id = 'french-science-dict-host';
    document.documentElement.appendChild(hostElement);

    shadowRoot = hostElement.attachShadow({ mode: 'open' });

    // Inject styles
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = chrome.runtime.getURL('content/content.css');
    shadowRoot.appendChild(styleLink);

    return shadowRoot;
  }

  // Speech Synthesis helper
  function speak(text, lang = 'fr-FR') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Check if term is bookmarked
  function checkBookmarkStatus(term, callback) {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      callback(false);
      return;
    }
    chrome.storage.local.get(['favorites'], (res) => {
      const favs = res.favorites || [];
      const exists = favs.some(f => f.fr.toLowerCase() === term.toLowerCase());
      callback(exists);
    });
  }

  // Toggle bookmark in chrome storage
  function toggleBookmark(entry, btnElement) {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(['favorites'], (res) => {
      let favs = res.favorites || [];
      const index = favs.findIndex(f => f.fr.toLowerCase() === entry.fr.toLowerCase());

      if (index >= 0) {
        favs.splice(index, 1);
        isBookmarked = false;
        if (btnElement) {
          btnElement.classList.remove('fsd-active');
          btnElement.innerHTML = '☆';
          btnElement.title = 'Add to favorites';
        }
      } else {
        favs.unshift({
          fr: entry.fr,
          en: entry.en,
          category: entry.category,
          pos: entry.pos || '',
          timestamp: Date.now()
        });
        isBookmarked = true;
        if (btnElement) {
          btnElement.classList.add('fsd-active');
          btnElement.innerHTML = '★';
          btnElement.title = 'Remove from favorites';
        }
      }

      chrome.storage.local.set({ favorites: favs });
    });
  }

  // Record term in lookup history
  function recordHistory(entry) {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(['history'], (res) => {
      let history = res.history || [];
      // remove duplicate
      history = history.filter(h => h.fr.toLowerCase() !== entry.fr.toLowerCase());
      history.unshift({
        fr: entry.fr,
        en: entry.en,
        category: entry.category,
        pos: entry.pos || '',
        timestamp: Date.now()
      });
      // limit to 100 entries
      if (history.length > 100) history.pop();
      chrome.storage.local.set({ history });
    });
  }

  // Get category badge markup
  function getCategoryBadge(category) {
    switch (category) {
      case 'math':
        return `<span class="fsd-badge fsd-badge-math">📐 Mathematics</span>`;
      case 'ai':
        return `<span class="fsd-badge fsd-badge-ai">🤖 AI & Machine Learning</span>`;
      case 'cs':
        return `<span class="fsd-badge fsd-badge-cs">💻 Computer Science</span>`;
      case 'science':
        return `<span class="fsd-badge fsd-badge-science">🔬 Physics & Science</span>`;
      default:
        return `<span class="fsd-badge fsd-badge-general">📖 Academic French</span>`;
    }
  }

  // Render Card Markup
  function renderCardHTML(entry) {
    const badgeHTML = getCategoryBadge(entry.category);
    const posHTML = entry.pos ? `<span class="fsd-pos">${entry.pos}</span>` : '';
    const noteHTML = entry.note ? `
      <div class="fsd-note-box">
        <span class="fsd-note-icon">⚠️</span>
        <div><strong>Precision Caveat:</strong> ${entry.note}</div>
      </div>
    ` : '';

    const defHTML = entry.definition ? `
      <div class="fsd-definition">${entry.definition}</div>
    ` : '';

    const altHTML = entry.alt && entry.alt.length > 0 ? `
      <div class="fsd-alt-terms">Also: <span>${entry.alt.join(', ')}</span></div>
    ` : '';

    const example = entry.examples && entry.examples.length > 0 ? entry.examples[0] : null;
    const exampleHTML = example ? `
      <div class="fsd-example-box">
        <div class="fsd-example-fr">« ${example.fr} »</div>
        <div class="fsd-example-en">“ ${example.en} ”</div>
      </div>
    ` : '';

    return `
      <div class="fsd-header">
        <div class="fsd-header-left">
          ${badgeHTML}
          ${posHTML}
        </div>
        <div class="fsd-header-actions">
          <button class="fsd-icon-btn fsd-fav-btn" title="Save to favorites">${isBookmarked ? '★' : '☆'}</button>
          <button class="fsd-icon-btn fsd-close-btn" title="Close (Esc)">✕</button>
        </div>
      </div>
      <div class="fsd-body">
        <div class="fsd-term-row">
          <span class="fsd-fr-term">${entry.fr}</span>
          <button class="fsd-speech-btn" title="Pronounce French">🔊 Écouter</button>
        </div>
        <div class="fsd-translation-block">
          <div class="fsd-en-translation">${entry.en}</div>
          ${altHTML}
        </div>
        ${noteHTML}
        ${defHTML}
        ${exampleHTML}
      </div>
      <div class="fsd-footer">
        <button class="fsd-copy-btn">
          <span>📋</span> <span class="fsd-copy-text">Copy Translation</span>
        </button>
        <div class="fsd-footer-right">
          <button class="fsd-speech-en-btn fsd-link-btn" title="Pronounce English">Pronounce EN</button>
        </div>
      </div>
    `;
  }

  // Render Loading Card for Online Fallback
  function renderLoadingCardHTML(searchTerm) {
    return `
      <div class="fsd-header">
        <div class="fsd-header-left">
          <span class="fsd-badge fsd-badge-general">🌐 Translating</span>
        </div>
        <div class="fsd-header-actions">
          <button class="fsd-icon-btn fsd-close-btn" title="Close">✕</button>
        </div>
      </div>
      <div class="fsd-body" style="align-items: center; justify-content: center; padding: 28px 16px;">
        <div class="fsd-loading-spinner"></div>
        <div style="margin-top: 12px; font-size: 13px; color: #94a3b8;">
          Searching translation for « <strong>${searchTerm}</strong> »...
        </div>
      </div>
    `;
  }

  // Position Card relative to selection bounds
  function positionCard(rect) {
    if (!cardElement) return;

    const cardWidth = 380;
    const estimatedHeight = 260;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Horizontal centering
    let left = rect.left + rect.width / 2 - cardWidth / 2;
    left = Math.max(16, Math.min(left, viewportWidth - cardWidth - 16));

    // Vertical positioning: prefer above selection, flip below if not enough room
    let top = rect.top - estimatedHeight - 12;
    if (top < 16) {
      top = rect.bottom + 12;
    }
    // Prevent exceeding bottom edge
    top = Math.max(16, Math.min(top, viewportHeight - estimatedHeight - 16));

    cardElement.style.left = `${Math.round(left)}px`;
    cardElement.style.top = `${Math.round(top)}px`;
  }

  // Display translation card
  function showCard(entry, rect) {
    const shadow = getOrCreateShadowRoot();
    activeEntry = entry;

    if (!cardElement) {
      cardElement = document.createElement('div');
      cardElement.className = 'fsd-card';
      shadow.appendChild(cardElement);
    }

    checkBookmarkStatus(entry.fr, (fav) => {
      isBookmarked = fav;
      cardElement.innerHTML = renderCardHTML(entry);
      positionCard(rect);

      // Trigger entrance transition
      requestAnimationFrame(() => {
        cardElement.classList.add('fsd-visible');
      });

      // Bind events
      const closeBtn = cardElement.querySelector('.fsd-close-btn');
      if (closeBtn) closeBtn.onclick = hideCard;

      const favBtn = cardElement.querySelector('.fsd-fav-btn');
      if (favBtn) favBtn.onclick = () => toggleBookmark(entry, favBtn);

      const speechFrBtn = cardElement.querySelector('.fsd-speech-btn');
      if (speechFrBtn) speechFrBtn.onclick = () => speak(entry.fr, 'fr-FR');

      const speechEnBtn = cardElement.querySelector('.fsd-speech-en-btn');
      if (speechEnBtn) speechEnBtn.onclick = () => speak(entry.en, 'en-US');

      const copyBtn = cardElement.querySelector('.fsd-copy-btn');
      if (copyBtn) {
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(entry.en).then(() => {
            copyBtn.classList.add('fsd-copied');
            const copyText = copyBtn.querySelector('.fsd-copy-text');
            if (copyText) copyText.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.classList.remove('fsd-copied');
              if (copyText) copyText.textContent = 'Copy Translation';
            }, 1800);
          });
        };
      }

      // Record to lookup history
      recordHistory(entry);

      // Optional auto-pronounce
      if (settings.autoPronounce) {
        speak(entry.fr, 'fr-FR');
      }
    });
  }

  // Display floating trigger icon (if triggerMode === 'icon')
  function showTriggerIcon(rect, onClick) {
    const shadow = getOrCreateShadowRoot();
    if (!triggerIconElement) {
      triggerIconElement = document.createElement('div');
      triggerIconElement.className = 'fsd-trigger-icon';
      triggerIconElement.innerHTML = '🔬';
      triggerIconElement.title = 'Click to translate scientific term';
      shadow.appendChild(triggerIconElement);
    }

    const iconX = Math.min(rect.right + 6, window.innerWidth - 36);
    const iconY = Math.max(10, rect.top - 14);

    triggerIconElement.style.left = `${Math.round(iconX)}px`;
    triggerIconElement.style.top = `${Math.round(iconY)}px`;
    triggerIconElement.style.display = 'flex';

    triggerIconElement.onclick = (e) => {
      e.stopPropagation();
      hideTriggerIcon();
      onClick();
    };
  }

  function hideTriggerIcon() {
    if (triggerIconElement) {
      triggerIconElement.style.display = 'none';
    }
  }

  // Hide Card
  function hideCard() {
    if (cardElement) {
      cardElement.classList.remove('fsd-visible');
      setTimeout(() => {
        if (cardElement && !cardElement.classList.contains('fsd-visible')) {
          cardElement.remove();
          cardElement = null;
        }
      }, 200);
    }
    hideTriggerIcon();
    activeEntry = null;
  }

  // Online fallback via background script
  function fetchOnlineTranslation(text, rect) {
    const shadow = getOrCreateShadowRoot();
    if (!cardElement) {
      cardElement = document.createElement('div');
      cardElement.className = 'fsd-card';
      shadow.appendChild(cardElement);
    }

    cardElement.innerHTML = renderLoadingCardHTML(text);
    positionCard(rect);
    cardElement.classList.add('fsd-visible');

    const closeBtn = cardElement.querySelector('.fsd-close-btn');
    if (closeBtn) closeBtn.onclick = hideCard;

    // Send translation request to background service worker
    chrome.runtime.sendMessage({ action: 'translate_fallback', text: text }, (response) => {
      if (response && response.success && response.result) {
        showCard(response.result, rect);
      } else {
        // Fallback display if not found
        cardElement.innerHTML = `
          <div class="fsd-header">
            <div class="fsd-header-left">
              <span class="fsd-badge fsd-badge-general">Term Not Found</span>
            </div>
            <div class="fsd-header-actions">
              <button class="fsd-icon-btn fsd-close-btn">✕</button>
            </div>
          </div>
          <div class="fsd-body">
            <div style="font-size: 13px; color: #94a3b8;">
              No scientific translation found for « <strong>${text}</strong> ».
            </div>
          </div>
        `;
        const cBtn = cardElement.querySelector('.fsd-close-btn');
        if (cBtn) cBtn.onclick = hideCard;
      }
    });
  }

  // Handle selection event
  function handleTextSelection(e) {
    // If click happened inside our shadow DOM card, ignore
    if (e && hostElement && hostElement.contains(e.target)) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      hideCard();
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText || selectedText.length < 2 || selectedText.length > 250) {
      hideCard();
      return;
    }

    // Ignore pure numbers or formulas with only symbols
    if (!/[a-zA-ZÀ-ÿ]/.test(selectedText)) {
      hideCard();
      return;
    }

    // Check trigger mode
    if (settings.triggerMode === 'alt' && !e.altKey) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    activeSelectionText = selectedText;

    // Perform offline dictionary lookup
    const entry = window.FrenchScienceDict ? window.FrenchScienceDict.lookup(selectedText) : null;

    const executeTranslation = () => {
      if (entry) {
        showCard(entry, rect);
      } else if (settings.enableOnlineFallback) {
        fetchOnlineTranslation(selectedText, rect);
      }
    };

    if (settings.triggerMode === 'icon') {
      showTriggerIcon(rect, executeTranslation);
    } else {
      executeTranslation();
    }
  }

  // Event Listeners
  document.addEventListener('mouseup', (e) => {
    // Debounce slightly to allow double clicks to complete
    setTimeout(() => handleTextSelection(e), 60);
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      hideCard();
      return;
    }
    // Handle shift+arrows selection
    if (e.shiftKey) {
      setTimeout(() => handleTextSelection(e), 100);
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (hostElement && e.composedPath().includes(hostElement)) {
      return; // click is inside shadow DOM
    }
    hideCard();
  });

  // Listen for messages from background script (e.g. context menu translation)
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'translate_selection' && request.text) {
        const selection = window.getSelection();
        let rect = { left: window.innerWidth / 2 - 100, top: 100, width: 200, height: 20, right: window.innerWidth / 2 + 100, bottom: 120 };
        if (selection && !selection.isCollapsed) {
          const range = selection.getRangeAt(0);
          rect = range.getBoundingClientRect();
        }

        const entry = window.FrenchScienceDict ? window.FrenchScienceDict.lookup(request.text) : null;
        if (entry) {
          showCard(entry, rect);
        } else {
          fetchOnlineTranslation(request.text, rect);
        }
      }
    });
  }

})();
