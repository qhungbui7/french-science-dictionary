// HTML Sanitization utility to prevent DOM XSS injection
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Sanitize field for TSV / Anki (escape HTML, strip tabs/newlines)
function sanitizeAnkiField(text) {
  if (!text) return '';
  return escapeHTML(String(text))
    .replace(/[\t\r\n]/g, ' ')
    .trim();
}

// Format Anki deck with strict escaping while preserving card bolding
function formatAnkiDeck(favorites) {
  let textContent = "#separator:tab\n#html:true\n#deck:French Science Dictionary\n";
  favorites.forEach(f => {
    const frSafe = sanitizeAnkiField(f.fr);
    const enSafe = sanitizeAnkiField(f.en);
    const catSafe = sanitizeAnkiField(f.category);
    textContent += `${frSafe}\t<b>${enSafe}</b> [${catSafe}]\n`;
  });
  return textContent;
}

// Sanitize cell for CSV and neutralize spreadsheet formula injection (=, +, -, @)
function sanitizeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value).replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ').trim();
  // Formula injection mitigation: if cell begins with formula trigger character
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

// Format CSV export with formula injection mitigation and RFC 4180 quoting
function formatCsvExport(favorites) {
  let csv = 'French,English,Category\n';
  favorites.forEach(f => {
    csv += `${sanitizeCsvCell(f.fr)},${sanitizeCsvCell(f.en)},${sanitizeCsvCell(f.category)}\n`;
  });
  return csv;
}

// Build pre-filled GitHub issue suggestion URL for voluntary user term submissions
function buildSuggestTermUrl(term) {
  const cleanTerm = (term || '').trim();
  const title = encodeURIComponent(`[Term Suggestion]: ${cleanTerm}`);
  const body = encodeURIComponent(
    `### Scientific Term Suggestion\n\n` +
    `- **French Term**: ${cleanTerm}\n` +
    `- **Suggested English Translation**:\n` +
    `- **Scientific Discipline**: [ ] Mathematics  [ ] AI/ML  [ ] CS  [ ] Physics/Science  [ ] Academic French\n` +
    `- **Context / Textbook Citation** (optional):\n\n` +
    `*Submitted via French Science & Math Dictionary extension.*`
  );
  return `https://github.com/qhungbui7/french-science-dictionary/issues/new?title=${title}&body=${body}`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    escapeHTML,
    sanitizeAnkiField,
    formatAnkiDeck,
    sanitizeCsvCell,
    formatCsvExport,
    buildSuggestTermUrl
  };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const dict = window.FrenchScienceDict;
    let currentCategory = 'all';

    // DOM Elements
    const termsCountBadge = document.getElementById('termsCountBadge');
    const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const categoryPills = document.querySelectorAll('.filter-pill');
  const dailyCard = document.getElementById('dailyCard');
  const resultsHeader = document.getElementById('resultsHeader');
  const resultsCount = document.getElementById('resultsCount');
  const resultsList = document.getElementById('resultsList');
  const favoritesList = document.getElementById('favoritesList');
  const historyList = document.getElementById('historyList');
  const cheatsheetGrid = document.getElementById('cheatsheetGrid');

  // Settings DOM
  const settingAutoTranslate = document.getElementById('settingAutoTranslate');
  const settingTriggerMode = document.getElementById('settingTriggerMode');
  const settingAutoPronounce = document.getElementById('settingAutoPronounce');
  const settingOnlineFallback = document.getElementById('settingOnlineFallback');

  // Daily Concept DOM
  const dailyBadge = document.getElementById('dailyBadge');
  const dailyFr = document.getElementById('dailyFr');
  const dailyEn = document.getElementById('dailyEn');
  const dailyDef = document.getElementById('dailyDef');
  const dailyNote = document.getElementById('dailyNote');
  const dailyAudioBtn = document.getElementById('dailyAudioBtn');

  // 1. Initialize stats & daily concept
  if (dict) {
    const stats = dict.getStats();
    if (termsCountBadge) {
      termsCountBadge.textContent = `${stats.total} STEM terms`;
    }

    const daily = dict.getWordOfTheDay();
    if (daily && dailyCard) {
      dailyFr.textContent = daily.fr;
      dailyEn.textContent = daily.en;
      dailyDef.textContent = daily.definition || '';
      dailyBadge.textContent = daily.category.toUpperCase();

      if (daily.note) {
        dailyNote.style.display = 'block';
        dailyNote.innerHTML = `<strong>Note:</strong> ${escapeHTML(daily.note)}`;
      } else {
        dailyNote.style.display = 'none';
      }

      dailyAudioBtn.onclick = () => speak(daily.fr, 'fr-FR');
    }
  }

  // 2. Navigation Tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = `tab-${tab.dataset.tab}`;
      navTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      if (tab.dataset.tab === 'favorites') loadFavorites();
      if (tab.dataset.tab === 'history') loadHistory();
      if (tab.dataset.tab === 'cheatsheet') renderCheatsheet();
    });
  });

  // 3. Search & Filtering
  function renderSearchResults() {
    if (!dict) return;
    const query = searchInput.value.trim();

    if (!query) {
      dailyCard.style.display = 'block';
      resultsHeader.style.display = 'none';
      resultsList.innerHTML = '';
      clearSearchBtn.style.display = 'none';
      return;
    }

    clearSearchBtn.style.display = 'block';
    dailyCard.style.display = 'none';

    const results = dict.search(query, currentCategory, 30);
    resultsHeader.style.display = 'block';
    resultsCount.textContent = `${results.length} term${results.length === 1 ? '' : 's'} found`;

    if (results.length === 0) {
      const suggestUrl = buildSuggestTermUrl(query);
      resultsList.innerHTML = `
        <div class="empty-state">
          <div style="margin-bottom: 12px;">No terms matching « <strong>${escapeHTML(query)}</strong> ».</div>
          <a href="${suggestUrl}" target="_blank" class="suggest-term-link">
            <span>➕</span> <span>Suggest « ${escapeHTML(query)} » for Lexicon ↗</span>
          </a>
        </div>
      `;
      return;
    }

    resultsList.innerHTML = results.map(entry => {
      const safeFr = escapeHTML(entry.fr);
      const safeCat = escapeHTML(entry.category);

      const sensesHTML = (entry.senses && entry.senses.length > 1) ? `
        <div class="card-senses" style="margin-top:5px;font-size:11px;color:#94a3b8;line-height:1.4;">
          ${entry.senses.map(s => `
            <div><span style="color:#38bdf8;">[${escapeHTML(s.domain || s.category)}]</span> <strong>${escapeHTML(s.translation || s.en)}</strong></div>
          `).join('')}
        </div>
      ` : '';

      return `
        <div class="result-card" data-fr="${safeFr}">
          <div class="card-top">
            <span class="card-fr">${highlightMatch(entry.fr, query)}</span>
            <span class="card-category cat-${safeCat}">${safeCat}</span>
          </div>
          <div class="card-en">${highlightMatch(entry.en, query)}</div>
          ${sensesHTML}
          ${entry.definition ? `<div class="card-def">${escapeHTML(entry.definition)}</div>` : ''}
          ${entry.note ? `<div class="card-note">⚠️ ${escapeHTML(entry.note)}</div>` : ''}
        </div>
      `;
    }).join('');

    // Attach card click handlers (copy & pronounce)
    resultsList.querySelectorAll('.result-card').forEach(card => {
      card.addEventListener('click', () => {
        const frTerm = card.dataset.fr;
        const entry = dict.lookup(frTerm);
        if (entry) {
          navigator.clipboard.writeText(entry.en);
          speak(entry.fr, 'fr-FR');
          showToast(`Copied "${entry.en}" to clipboard!`);
        }
      });
    });
  }

  // Safe highlight match: escapes text first to ensure zero HTML injection
  function highlightMatch(text, query) {
    if (!text) return '';
    const escapedText = escapeHTML(text);
    if (!query || !query.trim()) return escapedText;
    try {
      const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return escapedText.replace(regex, '<mark style="background:rgba(56,189,248,0.3);color:#fff;border-radius:2px;padding:0 2px;">$1</mark>');
    } catch (e) {
      return escapedText;
    }
  }

  searchInput.addEventListener('input', renderSearchResults);

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderSearchResults();
    searchInput.focus();
  });

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.cat;
      renderSearchResults();
    });
  });

  // 4. Speech Helper
  function speak(text, lang = 'fr-FR') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  }

  // Toast feedback
  function showToast(msg) {
    let toast = document.getElementById('fsdToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'fsdToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: #ffffff;
        font-size: 11.5px;
        font-weight: 600;
        padding: 6px 14px;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        z-index: 99999;
        transition: opacity 0.2s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 1800);
  }

  // 5. Favorites
  function loadFavorites() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(['favorites'], (res) => {
      const favs = res.favorites || [];
      if (favs.length === 0) {
        favoritesList.innerHTML = `
          <div class="empty-state">
            No saved terms yet.<br>
            Click the star ★ icon on any translation card to bookmark terms.
          </div>
        `;
        return;
      }

      favoritesList.innerHTML = favs.map(f => `
        <div class="result-card" data-fr="${escapeHTML(f.fr)}">
          <div class="card-top">
            <span class="card-fr">${escapeHTML(f.fr)}</span>
            <button class="icon-action-btn delete-fav-btn" data-fr="${escapeHTML(f.fr)}" title="Remove">✕</button>
          </div>
          <div class="card-en">${escapeHTML(f.en)}</div>
        </div>
      `).join('');

      // Delete buttons
      favoritesList.querySelectorAll('.delete-fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetFr = btn.dataset.fr;
          const updated = favs.filter(item => item.fr !== targetFr);
          chrome.storage.local.set({ favorites: updated }, () => {
            loadFavorites();
            showToast('Removed from favorites');
          });
        });
      });

      // Click card to pronounce
      favoritesList.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', () => {
          const fr = card.dataset.fr;
          speak(fr, 'fr-FR');
        });
      });
    });
  }

  // Export Anki (.txt)
  document.getElementById('exportAnkiBtn').addEventListener('click', () => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(['favorites'], (res) => {
      const favs = res.favorites || [];
      if (favs.length === 0) {
        showToast('No favorites to export');
        return;
      }

      const textContent = formatAnkiDeck(favs);
      downloadFile(textContent, 'french_science_anki_deck.txt', 'text/plain');
      showToast('Exported Anki deck!');
    });
  });

  // Export CSV
  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(['favorites'], (res) => {
      const favs = res.favorites || [];
      if (favs.length === 0) {
        showToast('No favorites to export');
        return;
      }

      const csv = formatCsvExport(favs);
      downloadFile(csv, 'french_science_lexicon.csv', 'text/csv');
      showToast('Exported CSV!');
    });
  });

  function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // 6. History
  function loadHistory() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(['history'], (res) => {
      const history = res.history || [];
      if (history.length === 0) {
        historyList.innerHTML = `
          <div class="empty-state">
            No recent lookups.<br>
            Highlight words on any webpage to see your translation history here.
          </div>
        `;
        return;
      }

      historyList.innerHTML = history.map(h => `
        <div class="result-card" data-fr="${escapeHTML(h.fr)}">
          <div class="card-top">
            <span class="card-fr">${escapeHTML(h.fr)}</span>
            <span class="card-category cat-${escapeHTML(h.category)}">${escapeHTML(h.category)}</span>
          </div>
          <div class="card-en">${escapeHTML(h.en)}</div>
        </div>
      `).join('');

      historyList.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', () => {
          speak(card.dataset.fr, 'fr-FR');
        });
      });
    });
  }

  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;
    chrome.storage.local.set({ history: [] }, () => {
      loadHistory();
      showToast('History cleared');
    });
  });

  // 7. Cheatsheet (False Friends)
  const FALSE_FRIENDS = [
    {
      fr: "corps",
      en: "field",
      wrong: "body",
      cat: "Algebra",
      desc: "In abstract algebra, a 'corps' is a field (or division ring / skew field if non-commutative). Never translate as body."
    },
    {
      fr: "variété",
      en: "manifold",
      wrong: "variety",
      cat: "Differential Geometry",
      desc: "In topology and differential geometry, 'variété' translates to manifold (e.g. smooth manifold). 'Variety' is reserved for algebraic geometry."
    },
    {
      fr: "adhérence",
      en: "closure",
      wrong: "adherence / stickiness",
      cat: "Topology",
      desc: "The topological closure of a subset Ā = Cl(A). Not adherence."
    },
    {
      fr: "noyau",
      en: "kernel / null space",
      wrong: "core / nucleus",
      cat: "Linear Algebra",
      desc: "Ker(f) is the null space or kernel of a linear transformation or homomorphism."
    },
    {
      fr: "recouvrement",
      en: "covering / cover",
      wrong: "recovery / overlap",
      cat: "Topology",
      desc: "A collection of sets whose union contains the given set (e.g. open cover = recouvrement d'ouverts)."
    },
    {
      fr: "primitive",
      en: "antiderivative",
      wrong: "primitive",
      cat: "Calculus",
      desc: "In English calculus, ∫ f(x)dx is standardly called an antiderivative or indefinite integral."
    },
    {
      fr: "tas",
      en: "heap",
      wrong: "pile",
      cat: "Data Structures",
      desc: "A binary heap or Fibonacci heap is a 'tas'. A 'pile' in French corresponds to a 'stack' (LIFO)."
    },
    {
      fr: "tribu",
      en: "sigma-algebra / σ-algebra",
      wrong: "tribe",
      cat: "Measure Theory & Probability",
      desc: "A σ-algebra of events or measurable sets. Standard term in French probability."
    },
    {
      fr: "espérance",
      en: "expected value / expectation",
      wrong: "hope",
      cat: "Probability",
      desc: "𝔼[X] is expectation. Never translate as hope."
    },
    {
      fr: "s'annuler",
      en: "to vanish / to equal zero",
      wrong: "to cancel out",
      cat: "Analysis",
      desc: "Formal English mathematical term for a function taking the value 0 is 'to vanish' (e.g. 'the gradient vanishes at the origin')."
    }
  ];

  function renderCheatsheet() {
    cheatsheetGrid.innerHTML = FALSE_FRIENDS.map(item => `
      <div class="cheatsheet-item">
        <div class="cheatsheet-term">
          <span class="fr-word">${escapeHTML(item.fr)}</span>
          <span style="color: #64748b;">→</span>
          <span class="en-correct">${escapeHTML(item.en)}</span>
          <span class="en-wrong">(${escapeHTML(item.wrong)})</span>
        </div>
        <div class="cheatsheet-explanation">
          <strong style="color:#a5b4fc;">[${escapeHTML(item.cat)}]</strong> ${escapeHTML(item.desc)}
        </div>
      </div>
    `).join('');
  }

  // 8. Settings Management
  function loadSettings() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(['settings'], (res) => {
      const s = res.settings || {};
      if (s.autoTranslate !== undefined) settingAutoTranslate.checked = s.autoTranslate;
      if (s.triggerMode) settingTriggerMode.value = s.triggerMode;
      if (s.autoPronounce !== undefined) settingAutoPronounce.checked = s.autoPronounce;
      if (s.enableOnlineFallback !== undefined) settingOnlineFallback.checked = s.enableOnlineFallback;
    });
  }

  function saveSettings() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;

    const newSettings = {
      autoTranslate: settingAutoTranslate.checked,
      triggerMode: settingTriggerMode.value,
      autoPronounce: settingAutoPronounce.checked,
      enableOnlineFallback: settingOnlineFallback.checked
    };

    chrome.storage.local.set({ settings: newSettings }, () => {
      showToast('Settings saved');
    });
  }

  settingAutoTranslate.addEventListener('change', saveSettings);
  settingTriggerMode.addEventListener('change', saveSettings);
  settingAutoPronounce.addEventListener('change', saveSettings);
  settingOnlineFallback.addEventListener('change', saveSettings);

  loadSettings();
  });
}
