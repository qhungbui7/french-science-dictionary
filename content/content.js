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
  let currentRequestId = 0; // Monotonically increasing request counter to eliminate race conditions

  // Default User Settings
  let settings = {
    autoTranslate: true,
    triggerMode: 'button', // 'button' (default: click button to translate) | 'instant' | 'alt'
    theme: 'dark',
    autoPronounce: false,
    enableOnlineFallback: true
  };

  // HTML Sanitization utility to prevent DOM-based XSS from webpage text or external API responses
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

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
      const exists = favs.some(f => f.fr && f.fr.toLowerCase() === term.toLowerCase());
      callback(exists);
    });
  }

  // Toggle bookmark in chrome storage
  function toggleBookmark(entry, btnElement) {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(['favorites'], (res) => {
      let favs = res.favorites || [];
      const index = favs.findIndex(f => f.fr && f.fr.toLowerCase() === entry.fr.toLowerCase());

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
      history = history.filter(h => h.fr && h.fr.toLowerCase() !== entry.fr.toLowerCase());
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

  // Render Card Markup with full HTML escaping on all dynamic properties
  function renderCardHTML(entry) {
    const badgeHTML = getCategoryBadge(entry.category);
    const posHTML = entry.pos ? `<span class="fsd-pos">${escapeHTML(entry.pos)}</span>` : '';
    const noteHTML = entry.note ? `
      <div class="fsd-note-box">
        <span class="fsd-note-icon">⚠️</span>
        <div><strong>Precision Caveat:</strong> ${escapeHTML(entry.note)}</div>
      </div>
    ` : '';

    const defHTML = entry.definition ? `
      <div class="fsd-definition">${escapeHTML(entry.definition)}</div>
    ` : '';

    const altHTML = entry.alt && entry.alt.length > 0 ? `
      <div class="fsd-alt-terms">Also: <span>${entry.alt.map(escapeHTML).join(', ')}</span></div>
    ` : '';

    // Render domain-specific distinct senses if multiple exist
    const sensesHTML = (entry.senses && entry.senses.length > 1) ? `
      <div class="fsd-senses-box">
        <div class="fsd-senses-header">📚 Discipline Senses:</div>
        ${entry.senses.map(s => `
          <div class="fsd-sense-row">
            <span class="fsd-sense-badge">[${escapeHTML(s.domain || s.category)}]</span>
            <strong class="fsd-sense-trans">${escapeHTML(s.translation || s.en)}</strong>
            ${s.note ? `<span class="fsd-sense-note">— ${escapeHTML(s.note)}</span>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '';

    const example = entry.examples && entry.examples.length > 0 ? entry.examples[0] : null;
    const exampleHTML = example ? `
      <div class="fsd-example-box">
        <div class="fsd-example-fr">« ${escapeHTML(example.fr)} »</div>
        <div class="fsd-example-en">“ ${escapeHTML(example.en)} ”</div>
        ${example.source ? `<div class="fsd-example-src">Source: ${escapeHTML(example.source)}</div>` : ''}
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
          <span class="fsd-fr-term">${escapeHTML(entry.fr)}</span>
          <button class="fsd-speech-btn" title="Pronounce French">🔊 Écouter</button>
        </div>
        <div class="fsd-translation-block">
          <div class="fsd-en-translation">${escapeHTML(entry.en)}</div>
          ${altHTML}
        </div>
        ${sensesHTML}
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
    const safeTerm = escapeHTML(searchTerm);
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
          Searching translation for « <strong>${safeTerm}</strong> »...
        </div>
      </div>
    `;
  }

  // Render Offline Mode / Fallback Disabled Card
  function showOfflineNotFoundCard(text, rect) {
    const shadow = getOrCreateShadowRoot();
    currentRequestId++; // Invalidate pending lookups
    const reqId = currentRequestId;

    if (!cardElement) {
      cardElement = document.createElement('div');
      cardElement.className = 'fsd-card';
      shadow.appendChild(cardElement);
    }

    const safeText = escapeHTML(text);
    cardElement.innerHTML = `
      <div class="fsd-header">
        <div class="fsd-header-left">
          <span class="fsd-badge fsd-badge-general">Offline Mode</span>
        </div>
        <div class="fsd-header-actions">
          <button class="fsd-icon-btn fsd-close-btn" title="Close">✕</button>
        </div>
      </div>
      <div class="fsd-body" style="padding: 18px 16px;">
        <div style="font-size: 13px; color: #f1f5f9; line-height: 1.45;">
          Term « <strong>${safeText}</strong> » was not found in the curated offline dictionary.
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 8px; line-height: 1.4;">
          Online fallback translation is currently disabled in your extension preferences.
        </div>
      </div>
    `;

    positionCard(rect);
    requestAnimationFrame(() => {
      if (reqId === currentRequestId && cardElement) {
        cardElement.classList.add('fsd-visible');
      }
    });

    const closeBtn = cardElement.querySelector('.fsd-close-btn');
    if (closeBtn) closeBtn.onclick = hideCard;
  }

  // Position Card relative to selection bounds
  function positionCard(rect) {
    if (!cardElement) return;

    const cardWidth = 380;
    const estimatedHeight = 280;
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

    const reqId = ++currentRequestId;

    if (!cardElement) {
      cardElement = document.createElement('div');
      cardElement.className = 'fsd-card';
      shadow.appendChild(cardElement);
    }

    checkBookmarkStatus(entry.fr, (fav) => {
      // Discard stale async callback if user selected another term or closed card
      if (reqId !== currentRequestId || !cardElement) return;

      isBookmarked = fav;
      cardElement.innerHTML = renderCardHTML(entry);
      positionCard(rect);

      // Trigger entrance transition
      requestAnimationFrame(() => {
        if (reqId === currentRequestId && cardElement) {
          cardElement.classList.add('fsd-visible');
        }
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

      // Enforce auto-pronounce setting if enabled
      if (settings.autoPronounce && entry.fr) {
        speak(entry.fr, 'fr-FR');
      }
    });
  }

  // Display floating trigger button (click button to translate)
  function showTriggerButton(rect, onClick) {
    const shadow = getOrCreateShadowRoot();
    if (!triggerIconElement) {
      triggerIconElement = document.createElement('div');
      triggerIconElement.className = 'fsd-trigger-btn';
      triggerIconElement.innerHTML = `
        <span class="fsd-trigger-glyph">🔬</span>
        <span class="fsd-trigger-text">Translate</span>
      `;
      triggerIconElement.title = 'Click to translate scientific term (FR ➔ EN)';
      shadow.appendChild(triggerIconElement);
    }

    const estimatedBtnWidth = 92;
    // Position button near top-right of selection, clamping to viewport
    let btnX = rect.right + 6;
    if (btnX + estimatedBtnWidth > window.innerWidth - 12) {
      btnX = window.innerWidth - estimatedBtnWidth - 12;
    }
    btnX = Math.max(12, btnX);

    let btnY = rect.top - 32;
    if (btnY < 12) {
      btnY = rect.bottom + 6;
    }
    btnY = Math.max(12, Math.min(btnY, window.innerHeight - 40));

    triggerIconElement.style.left = `${Math.round(btnX)}px`;
    triggerIconElement.style.top = `${Math.round(btnY)}px`;
    triggerIconElement.style.display = 'inline-flex';

    requestAnimationFrame(() => {
      if (triggerIconElement) {
        triggerIconElement.classList.add('fsd-visible');
      }
    });

    triggerIconElement.onclick = (e) => {
      e.stopPropagation();
      hideTriggerButton();
      onClick();
    };
  }

  function hideTriggerButton() {
    if (triggerIconElement) {
      triggerIconElement.classList.remove('fsd-visible');
      triggerIconElement.style.display = 'none';
    }
  }

  // Hide Card and invalidate pending async requests
  function hideCard() {
    currentRequestId++; // Invalidate pending callbacks
    if (cardElement) {
      cardElement.classList.remove('fsd-visible');
      setTimeout(() => {
        if (cardElement && !cardElement.classList.contains('fsd-visible')) {
          cardElement.remove();
          cardElement = null;
        }
      }, 200);
    }
    hideTriggerButton();
    activeEntry = null;
  }

  // Online fallback via background script with request ID tracking & escaping
  function fetchOnlineTranslation(text, rect) {
    const shadow = getOrCreateShadowRoot();
    const reqId = ++currentRequestId;

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
      // Discard stale response if another request was triggered or card was closed
      if (reqId !== currentRequestId || !cardElement) return;

      if (response && response.success && response.result) {
        showCard(response.result, rect);
      } else {
        const safeText = escapeHTML(text);
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
              No scientific translation found for « <strong>${safeText}</strong> ».
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

    // Invalidate any outstanding asynchronous requests whenever selection changes or is evaluated
    currentRequestId++;

    // Enforce settings.autoTranslate: if disabled, do not trigger any selection translation
    if (!settings.autoTranslate) {
      hideCard();
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

    // Check trigger mode modifier key if 'alt' is configured
    if (settings.triggerMode === 'alt' && !e.altKey) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    // If selection changed from previously active selection, dismiss any currently visible card
    if (activeSelectionText !== selectedText) {
      if (cardElement) {
        cardElement.classList.remove('fsd-visible');
        cardElement.remove();
        cardElement = null;
      }
    }

    activeSelectionText = selectedText;

    // Perform offline dictionary lookup
    const entry = window.FrenchScienceDict ? window.FrenchScienceDict.lookup(selectedText) : null;

    const executeTranslation = () => {
      if (entry) {
        showCard(entry, rect);
      } else if (settings.enableOnlineFallback) {
        fetchOnlineTranslation(selectedText, rect);
      } else {
        showOfflineNotFoundCard(selectedText, rect);
      }
    };

    if (settings.triggerMode === 'instant') {
      executeTranslation();
    } else {
      // Default: do not translate immediately, show floating button to trigger translation
      showTriggerButton(rect, executeTranslation);
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
    // Handle shift+arrows and arrow selection navigation
    if (e.shiftKey || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      setTimeout(() => handleTextSelection(e), 60);
    }
  });

  // Track selection collapse to invalidate pending async requests
  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      currentRequestId++;
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
        } else if (settings.enableOnlineFallback) {
          fetchOnlineTranslation(request.text, rect);
        } else {
          // Strictly respect online fallback toggle even in context-menu trigger
          showOfflineNotFoundCard(request.text, rect);
        }
      }
    });
  }

})();
