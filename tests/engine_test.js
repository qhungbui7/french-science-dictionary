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
