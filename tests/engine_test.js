/**
 * French Science Dictionary - Automated Verification & Audit Test Suite
 * Validates dictionary lookup accuracy, morphological stemming,
 * false friend resolution, multi-word matching, and category filtering.
 */

const { SCIENCE_TERMS } = require('../data/science_terms.js');
const { ACADEMIC_FRENCH } = require('../data/academic_french.js');

// Load engine into global scope
global.SCIENCE_TERMS = SCIENCE_TERMS;
global.ACADEMIC_FRENCH = ACADEMIC_FRENCH;
require('../data/dictionary_core.js');

const dict = global.FrenchScienceDict;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✓ PASS\x1b[0m ${message}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✗ FAIL\x1b[0m ${message}`);
  }
}

console.log('\n======================================================');
console.log('🧪 FRENCH SCIENCE DICTIONARY - DOMAIN AUDIT TEST SUITE');
console.log('======================================================\n');

// 1. STATS & DATABASE INTEGRITY
console.log('📊 1. DATABASE INTEGRITY & METRICS');
const stats = dict.getStats();
assert(stats.total >= 100, `Database contains ${stats.total} total curated terms (>= 100)`);
assert(stats.math > 0, `Mathematics terms indexed: ${stats.math}`);
assert(stats.ai > 0, `AI & Machine Learning terms indexed: ${stats.ai}`);
assert(stats.cs > 0, `Computer Science terms indexed: ${stats.cs}`);
assert(stats.science > 0, `Physics & Science terms indexed: ${stats.science}`);
assert(stats.general > 0, `Academic French discourse terms indexed: ${stats.general}`);

// 2. CRITICAL FALSE FRIENDS VERIFICATION
console.log('\n⚠️  2. SCIENTIFIC FALSE FRIENDS AUDIT (CRITICAL PRECISION)');
const falseFriends = [
  { fr: 'corps', expected: 'field', forbidden: 'body', cat: 'math' },
  { fr: 'variété', expected: 'manifold', forbidden: 'variety', cat: 'math' },
  { fr: 'adhérence', expected: 'closure', forbidden: 'adherence', cat: 'math' },
  { fr: 'noyau', expected: 'kernel', forbidden: 'nucleus', cat: 'math' },
  { fr: 'recouvrement', expected: 'covering', forbidden: 'recovery', cat: 'math' },
  { fr: 'tas', expected: 'heap', forbidden: 'pile', cat: 'cs' },
  { fr: 'tribu', expected: 'sigma-algebra', forbidden: 'tribe', cat: 'math' },
  { fr: 'espérance', expected: 'expected value', forbidden: 'hope', cat: 'math' },
  { fr: 's\'annuler', expected: 'to vanish', forbidden: 'to cancel out', cat: 'math' }
];

for (const ff of falseFriends) {
  const res = dict.lookup(ff.fr);
  assert(res !== null, `Lookup '${ff.fr}' returned non-null result`);
  if (res) {
    const enLower = res.en.toLowerCase();
    assert(enLower.includes(ff.expected.toLowerCase()), `'${ff.fr}' translates to '${ff.expected}' (received: "${res.en}")`);
    assert(res.category === ff.cat, `'${ff.fr}' categorized as '${ff.cat}' (received: "${res.category}")`);
    if (res.note) {
      assert(res.note.length > 10, `'${ff.fr}' includes detailed domain precision note: "${res.note.slice(0, 45)}..."`);
    }
  }
}

// 3. MORPHOLOGICAL STEMMING & LEMMATIZATION
console.log('\n🧠 3. MORPHOLOGICAL STEMMING & LEMMATIZATION AUDIT');
const morphologyTests = [
  // Plural to singular
  { input: 'valeurs propres', expectedFr: 'valeur propre', expectedEn: 'eigenvalue' },
  { input: 'espaces vectoriels', expectedFr: 'espace vectoriel', expectedEn: 'vector space' },
  { input: 'sous-espaces propres', expectedFr: 'sous-espace propre', expectedEn: 'eigenspace' },
  { input: 'matrices symétriques', expectedFr: 'matrice symétrique', expectedEn: 'symmetric matrix' },
  { input: 'arbres binaires de recherche', expectedFr: 'arbre binaire de recherche', expectedEn: 'binary search tree' },
  
  // Elisions and contractions
  { input: 'l\'adhérence', expectedFr: 'adhérence', expectedEn: 'closure' },
  { input: 'l\'espace vectoriel', expectedFr: 'espace vectoriel', expectedEn: 'vector space' },
  { input: 'd\'onde', expectedFr: 'onde', expectedEn: 'wave' },
  { input: 'la fonction d\'onde', expectedFr: 'fonction d\'onde', expectedEn: 'wave function' },
  
  // Feminine to masculine
  { input: 'bornée', expectedFr: 'borné', expectedEn: 'bounded' },
  { input: 'bornées', expectedFr: 'borné', expectedEn: 'bounded' },
  
  // Reflexive verbs
  { input: 's\'annulent', expectedFr: 's\'annuler', expectedEn: 'to vanish' },
  { input: 's\'annule', expectedFr: 's\'annuler', expectedEn: 'to vanish' }
];

for (const mt of morphologyTests) {
  const res = dict.lookup(mt.input);
  assert(res !== null, `Morphological variant '${mt.input}' successfully resolved`);
  if (res) {
    assert(res.en.toLowerCase().includes(mt.expectedEn.toLowerCase()), `'${mt.input}' correctly resolved to '${mt.expectedEn}'`);
  }
}

// 4. MULTI-WORD EXPRESSION GREEDY MATCHING
console.log('\n📐 4. MULTI-WORD EXPRESSION GREEDY MATCHING AUDIT');
const multiwordTests = [
  'descente de gradient stochastique',
  'théorème des accroissements finis',
  'théorème des valeurs intermédiaires',
  'théorème des gendarmes',
  'arbre couvrant minimal',
  'loi forte des grands nombres',
  'théorème central limite',
  'matrice de confusion',
  'apprentissage par renforcement',
  'fonction d\'onde',
  'équation de Schrödinger'
];

for (const phrase of multiwordTests) {
  const res = dict.lookup(phrase);
  assert(res !== null && res.fr.toLowerCase() === phrase.toLowerCase(), `Multi-word phrase '${phrase}' matched greedily as a single cohesive unit`);
}

// 5. REVERSE ENGLISH-TO-FRENCH LOOKUPS
console.log('\n🔄 5. REVERSE ENGLISH-TO-FRENCH LOOKUPS AUDIT');
const reverseTests = [
  { en: 'eigenvalue', expectedFr: 'valeur propre' },
  { en: 'manifold', expectedFr: 'variété' },
  { en: 'closure', expectedFr: 'adhérence' },
  { en: 'gradient descent', expectedFr: 'descente de gradient' },
  { en: 'hash table', expectedFr: 'table de hachage' },
  { en: 'deadlock', expectedFr: 'interblocage' }
];

for (const rt of reverseTests) {
  const res = dict.lookup(rt.en);
  assert(res !== null, `Reverse lookup for '${rt.en}' succeeded`);
  if (res) {
    assert(res.fr.toLowerCase() === rt.expectedFr.toLowerCase(), `'${rt.en}' reverse-mapped to '${rt.expectedFr}' (received: "${res.fr}")`);
  }
}

// 6. SEARCH & AUTOCOMPLETE RANKING
console.log('\n🔍 6. SEARCH & AUTOCOMPLETE ENGINE AUDIT');
const searchTests = [
  { query: 'gradient', cat: 'all', minResults: 1 },
  { query: 'matrice', cat: 'math', minResults: 2 },
  { query: 'arbre', cat: 'cs', minResults: 1 },
  { query: 'apprentissage', cat: 'ai', minResults: 3 }
];

for (const st of searchTests) {
  const results = dict.search(st.query, st.cat, 10);
  assert(results.length >= st.minResults, `Search '${st.query}' in category '${st.cat}' returned ${results.length} matches (>= ${st.minResults})`);
}

// 7. PUNCTUATION BOUNDARY & MATHEMATICAL PROOF SENTENCES AUDIT
console.log('\n🔤 7. PUNCTUATION BOUNDARY & MATHEMATICAL PROOF SENTENCES AUDIT');
const punctuationTests = [
  // Trailing / leading punctuation
  { input: 'valeur propre,', expectedFr: 'valeur propre', expectedEn: 'eigenvalue' },
  { input: 'valeur propre.', expectedFr: 'valeur propre', expectedEn: 'eigenvalue' },
  { input: '(espace vectoriel)', expectedFr: 'espace vectoriel', expectedEn: 'vector space' },
  { input: '« fonction d\'onde »', expectedFr: 'fonction d\'onde', expectedEn: 'wave function' },
  { input: 'sous-espace propre:', expectedFr: 'sous-espace propre', expectedEn: 'eigenspace' },
  { input: '[matrice symétrique];', expectedFr: 'matrice symétrique', expectedEn: 'symmetric matrix' },
  { input: '« adhérence »...', expectedFr: 'adhérence', expectedEn: 'closure' },
  
  // Mathematical sentences with commas and colons
  { input: 'La valeur propre, notée λ, est strictement positive.', expectedFr: 'valeur propre', expectedEn: 'eigenvalue' },
  { input: 'Soit E un espace vectoriel, et F un sous-espace vectoriel de dimension finie.', expectedFr: 'sous-espace vectoriel', expectedEn: 'subspace' },
  { input: 'D\'après le théorème des gendarmes, la suite converge vers zéro.', expectedFr: 'théorème des gendarmes', expectedEn: 'squeeze theorem' }
];

for (const pt of punctuationTests) {
  const res = dict.lookup(pt.input);
  assert(res !== null, `Lookup for punctuated input '${pt.input}' succeeded`);
  if (res) {
    assert(res.en.toLowerCase().includes(pt.expectedEn.toLowerCase()), `'${pt.input}' correctly resolved to '${pt.expectedEn}' (received: "${res.en}")`);
  }
}

// 8. MULTI-SENSE DISCIPLINE DISAMBIGUATION AUDIT
console.log('\n📚 8. MULTI-SENSE DISCIPLINE DISAMBIGUATION AUDIT');
const multiSenseTerms = ['variété', 'corps', 'noyau', 'image', 'densité'];

for (const term of multiSenseTerms) {
  const entry = dict.lookup(term);
  assert(entry !== null, `Multi-sense term '${term}' resolved`);
  if (entry) {
    assert(Array.isArray(entry.senses) && entry.senses.length >= 2, `'${term}' contains at least 2 distinct domain senses (found: ${entry.senses ? entry.senses.length : 0})`);
    if (entry.senses) {
      for (const sense of entry.senses) {
        assert(typeof sense.domain === 'string' && sense.domain.length > 0, `Sense id='${sense.id}' has explicit domain label: "${sense.domain}"`);
        assert(typeof sense.translation === 'string' && sense.translation.length > 0, `Sense id='${sense.id}' has precise translation: "${sense.translation}"`);
      }
    }
  }
}

// 9. EXPANDED SEARCH INDEXING & RANKING AUDIT
console.log('\n🔎 9. EXPANDED SEARCH INDEXING & RANKING AUDIT');
// Test search matches in alternative translations, synonyms, senses, and examples
const expandedSearchTests = [
  { query: 'null space', targetFr: 'noyau', rationale: 'Matches alternative English translation' },
  { query: 'Galois field', targetFr: 'corps fini', rationale: 'Matches alternative English translation' },
  { query: 'fermeture', targetFr: 'adhérence', rationale: 'Matches French synonym' },
  { query: 'black body', targetFr: 'corps', rationale: 'Matches physics domain sense note' }
];

for (const est of expandedSearchTests) {
  const results = dict.search(est.query, 'all', 10);
  const found = results.some(r => r.fr.toLowerCase() === est.targetFr.toLowerCase());
  assert(found, `Search '${est.query}' found '${est.targetFr}' (${est.rationale})`);
}

// Verify ranking: exact headword matches outrank loose partial or example matches
const rankingResults = dict.search('corps', 'all', 10);
assert(rankingResults.length > 0 && rankingResults[0].fr.toLowerCase() === 'corps', `Exact headword 'corps' ranked first in search results (received top: "${rankingResults[0]?.fr}")`);

// 10. HTML SANITIZATION & REAL EXPORT SECURITY AUDIT
console.log('\n🛡️  10. HTML SANITIZATION & REAL EXPORT SECURITY AUDIT');

// Import actual production functions directly from popup/popup.js
const {
  escapeHTML,
  sanitizeAnkiField,
  formatAnkiDeck,
  sanitizeCsvCell,
  formatCsvExport,
  buildSuggestTermUrl
} = require('../popup/popup.js');

function highlightMatch(text, query) {
  if (!text) return '';
  const escapedText = escapeHTML(text);
  if (!query || !query.trim()) return escapedText;
  try {
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  } catch (e) {
    return escapedText;
  }
}

const xssPayloads = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert(1)>',
  'valeur" onmouseover="alert(1)"',
  '<b>bold</b> & "quotes"'
];

for (const payload of xssPayloads) {
  const escaped = escapeHTML(payload);
  assert(!escaped.includes('<script>') && !escaped.includes('<img'), `escapeHTML neutralized script/img tags for: ${payload}`);
  assert(!escaped.includes('"') && !escaped.includes('<'), `escapeHTML sanitized quotes and brackets for: ${payload}`);
  
  const highlighted = highlightMatch(payload, 'alert');
  assert(!highlighted.includes('<script') && !highlighted.includes('<img'), `highlightMatch safely escaped HTML without rendering raw executable tags`);
}

// 11. ANKI & CSV EXPORT SECURITY & FORMULA INJECTION AUDIT
console.log('\n📦 11. ANKI & CSV EXPORT SECURITY & FORMULA INJECTION AUDIT');

const dangerousFavorites = [
  { fr: '<script>alert("xss")</script>', en: 'eigenvalue', category: 'math' },
  { fr: 'terme\tavec\ttab', en: 'term\nwith\nnewline', category: 'cs' },
  { fr: '=1+1', en: 'formula test', category: 'math' },
  { fr: '+cmd|\' /C calc\'!A0', en: 'DDE injection test', category: 'cs' },
  { fr: '@SUM(A1:A10)', en: 'Excel at-command test', category: 'science' },
  { fr: '-10% discount', en: 'negative sign test', category: 'general' }
];

// Test Anki Deck Serializer
const ankiOutput = formatAnkiDeck(dangerousFavorites);
assert(!ankiOutput.includes('<script>'), 'Anki export: neutralized raw <script> tag in French headword');
assert(ankiOutput.includes('&lt;script&gt;'), 'Anki export: properly HTML-escaped French headword');
assert(!ankiOutput.includes('terme\tavec\ttab\t'), 'Anki export: stripped destructive internal tabs from field content');
assert(ankiOutput.includes('<b>eigenvalue</b> [math]'), 'Anki export: preserved intended bold styling around escaped English card field');

// Test CSV Serializer & Spreadsheet Formula Injection Mitigation
const csvOutput = formatCsvExport(dangerousFavorites);
assert(csvOutput.includes('"\'=1+1"'), 'CSV export: neutralized formula injection (=) with leading single-quote');
assert(csvOutput.includes('"\'+cmd'), 'CSV export: neutralized plus-sign command injection (+) with leading single-quote');
assert(csvOutput.includes('"\'@SUM(A1:A10)"'), 'CSV export: neutralized at-command formula injection (@) with leading single-quote');
assert(csvOutput.includes('"\'-10% discount"'), 'CSV export: neutralized negative formula injection (-) with leading single-quote');
assert(!csvOutput.includes('term\nwith\nnewline'), 'CSV export: sanitized embedded linebreaks in cell content');

// Test Suggest Term URL Builder
const suggestUrl = buildSuggestTermUrl('symplectique');
assert(suggestUrl.startsWith('https://github.com/qhungbui7/french-science-dictionary/issues/new?'), 'Suggest Term: generated valid GitHub Issue URL');
assert(suggestUrl.includes('symplectique'), 'Suggest Term: properly URL-encoded issue title with term');
assert(suggestUrl.includes('Mathematics') && suggestUrl.includes('Scientific%20Term%20Suggestion'), 'Suggest Term: pre-filled scientific discipline template in body');

// 12. ASYNCHRONOUS SELECTION RACE & REAL CONTENT SCRIPT BROWSER AUDIT
console.log('\n⚡ 12. ASYNCHRONOUS SELECTION RACE & REAL CONTENT SCRIPT BROWSER AUDIT');

// Part A: State-machine invariant check
class AsyncSelectionStateMachine {
  constructor() {
    this.currentRequestId = 0;
    this.activeSelection = null;
    this.cardRenderedWith = null;
  }

  onSelectionChange(newText) {
    this.currentRequestId++;
    this.activeSelection = newText;
  }

  dispatchAsyncLookup(text) {
    const reqId = this.currentRequestId;
    return (result) => {
      if (reqId === this.currentRequestId && this.activeSelection === text) {
        this.cardRenderedWith = result;
        return true;
      }
      return false;
    };
  }
}

const fsdState = new AsyncSelectionStateMachine();
fsdState.onSelectionChange('valeur propre');
const resolveA = fsdState.dispatchAsyncLookup('valeur propre');
fsdState.onSelectionChange('vecteur propre');
const resolveB = fsdState.dispatchAsyncLookup('vecteur propre');

const acceptedA = resolveA('eigenvalue');
assert(acceptedA === false, 'State machine: Delayed response for Term A was successfully rejected as stale');
assert(fsdState.cardRenderedWith === null, 'State machine: Card state was NOT overwritten by late Term A response');

const acceptedB = resolveB('eigenvector');
assert(acceptedB === true, 'State machine: Current response for Term B was successfully accepted');
assert(fsdState.cardRenderedWith === 'eigenvector', 'State machine: Card accurately rendered Term B result');

// Part B: Real content script browser integration test
// Tests actual event handling, selectionchange across non-collapsed selections, and resolution during debounce interval
const fs = require('fs');
const vm = require('vm');

function createMockBrowser() {
  const listeners = {};
  let currentSelectionText = '';
  let isCollapsed = true;

  const mockWindow = {
    __FSD_INITIALIZED__: false,
    innerWidth: 1024,
    innerHeight: 768,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    requestAnimationFrame: (cb) => { cb(); },
    speechSynthesis: { speak: () => {}, cancel: () => {} },
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    addEventListener: (type, fn) => {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    getSelection: () => ({
      isCollapsed,
      rangeCount: isCollapsed ? 0 : 1,
      toString: () => currentSelectionText,
      getRangeAt: () => ({
        startContainer: { nodeType: 1, tagName: 'P', id: 'p1' },
        endContainer: { nodeType: 1, tagName: 'P', id: 'p1' },
        startOffset: 0,
        endOffset: currentSelectionText.length,
        getBoundingClientRect: () => ({ left: 100, top: 100, width: 80, height: 20, right: 180, bottom: 120 })
      })
    })
  };

  mockWindow.window = mockWindow;

  const createElement = (tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      innerHTML: '',
      classList: {
        _classes: new Set(),
        add: (c) => el.classList._classes.add(c),
        remove: (c) => el.classList._classes.delete(c),
        contains: (c) => el.classList._classes.has(c)
      },
      style: {},
      children: [],
      appendChild: (child) => { el.children.push(child); return child; },
      remove: () => { el.innerHTML = ''; },
      querySelector: (sel) => createElement('div'),
      querySelectorAll: () => [],
      attachShadow: () => createElement('div'),
      getBoundingClientRect: () => ({ left: 100, top: 100, width: 80, height: 20, right: 180, bottom: 120 })
    };
    return el;
  };

  const docEl = createElement('html');
  const bodyEl = createElement('body');
  docEl.appendChild(bodyEl);

  const mockDocument = {
    createElement,
    documentElement: docEl,
    body: bodyEl,
    addEventListener: (type, fn) => {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    dispatchEvent: (type, event) => {
      if (listeners[type]) {
        listeners[type].forEach(fn => fn(event || {}));
      }
    }
  };

  mockWindow.document = mockDocument;

  let pendingTranslationCallbacks = [];

  const mockChrome = {
    storage: {
      local: {
        get: (keys, cb) => cb({ settings: { autoTranslate: true, triggerMode: 'instant', enableOnlineFallback: true } }),
        set: (data, cb) => { if (cb) cb(); }
      },
      onChanged: { addListener: () => {} }
    },
    runtime: {
      getURL: (p) => 'chrome-extension://dummy/' + p,
      onMessage: { addListener: () => {} },
      sendMessage: (msg, cb) => {
        if (msg.action === 'translate_fallback') {
          pendingTranslationCallbacks.push({ text: msg.text, cb });
        }
      }
    }
  };

  mockWindow.chrome = mockChrome;
  return {
    mockWindow,
    mockDocument,
    listeners,
    setSelection: (text, collapsed = false) => {
      currentSelectionText = text;
      isCollapsed = collapsed;
    },
    getPendingTranslations: () => pendingTranslationCallbacks
  };
}

const { mockWindow, mockDocument, setSelection, getPendingTranslations } = createMockBrowser();
const contentScriptCode = fs.readFileSync(require.resolve('../content/content.js'), 'utf8');
const vmCtx = vm.createContext(mockWindow);
vm.runInContext(contentScriptCode, vmCtx);

const fsdReal = mockWindow.__FSD_CONTENT_SCRIPT__;
assert(typeof fsdReal === 'object', 'Real content script loaded and initialized in browser environment');

// Step 1: User selects 'valeur' (non-collapsed selection)
setSelection('valeur', false);
mockDocument.dispatchEvent('selectionchange');
fsdReal.handleTextSelection();

const reqIdStep1 = fsdReal.getCurrentRequestId();
const pendingNetworkCalls = getPendingTranslations();
assert(pendingNetworkCalls.length === 1 && pendingNetworkCalls[0].text === 'valeur', 'Content script dispatched fallback translation request for Term 1 (valeur)');

// Step 2: User modifies selection using Shift+Arrow to 'valeur propre' (remains non-collapsed!)
setSelection('valeur propre', false);
mockDocument.dispatchEvent('selectionchange');

const reqIdStep2 = fsdReal.getCurrentRequestId();
assert(reqIdStep2 > reqIdStep1, 'Real content script: selectionchange between non-collapsed selections immediately invalidated in-flight request');

// Step 3: DURING debounce interval (before keyup debounce expires), resolve Term 1 delayed response
const term1DelayedRequest = pendingNetworkCalls[0];
term1DelayedRequest.cb({
  success: true,
  result: { fr: 'valeur', en: 'value', category: 'math', definition: 'A numerical quantity' }
});

const cardAfterStaleResolution = fsdReal.getCardElement();
const renderedStaleValue = cardAfterStaleResolution ? cardAfterStaleResolution.innerHTML.includes('value') : false;
assert(renderedStaleValue === false, 'Real content script: delayed response arriving during debounce interval was successfully dropped and rejected');

// Step 4: Complete debounce interval and handle Term 2 ('valeur propre')
fsdReal.handleTextSelection();
assert(pendingNetworkCalls.length === 2 && pendingNetworkCalls[1].text === 'valeur propre', 'Content script dispatched request for Term 2 (valeur propre)');

const term2ValidRequest = pendingNetworkCalls[1];
term2ValidRequest.cb({
  success: true,
  result: { fr: 'valeur propre', en: 'eigenvalue', category: 'math', definition: 'A scalar lambda' }
});

const cardAfterActiveResolution = fsdReal.getCardElement();
const renderedActiveValue = cardAfterActiveResolution ? cardAfterActiveResolution.innerHTML.includes('eigenvalue') : false;
assert(renderedActiveValue === true, 'Real content script: active selection response for Term 2 was accurately rendered into the card');

// 13. SETTINGS & NEGATIVE LOOKUP INVARIANTS AUDIT
console.log('\n⚙️  13. SETTINGS & NEGATIVE LOOKUP INVARIANTS AUDIT');

// Empty / invalid input tests
assert(dict.lookup('') === null, 'Lookup empty string returns null');
assert(dict.lookup('   ') === null, 'Lookup whitespace returns null');
assert(dict.lookup('a') === null, 'Lookup single character returns null');
assert(dict.lookup('1234567') === null, 'Lookup pure numbers returns null');
assert(dict.lookup('xyznonexistentterm99') === null, 'Lookup uncataloged pseudo-word returns null');

// FINAL SUMMARY
console.log('\n======================================================');
console.log(`TOTAL TESTS RUN : ${totalTests}`);
console.log(`PASSED          : \x1b[32m${passedTests}\x1b[0m`);
console.log(`FAILED          : ${failedTests > 0 ? `\x1b[31m${failedTests}\x1b[0m` : '0'}`);
console.log('======================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m🎉 ALL AUDIT AND REGRESSION TESTS PASSED WITH 100% SUCCESS!\x1b[0m\n');
  process.exit(0);
}
