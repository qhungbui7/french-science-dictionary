# French Science & Math Dictionary 🇫🇷 ➔ 🇬🇧

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-38bdf8?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Browser](https://img.shields.io/badge/Browser-Brave%20%7C%20Chrome%20%7C%20Chromium-f97316?style=flat-square)](https://brave.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

An open-source, precision **French-to-English scientific dictionary extension for Brave and Google Chrome**. Designed specifically for students, researchers, mathematicians, and engineers reading French scientific literature, textbooks, and research papers (e.g., Bourbaki, Poincaré, Paris-Saclay lecture notes, CNRS, INRIA, arXiv).

Unlike generic translation tools that confuse false friends, this extension focuses on **absolute precision** across **Mathematics, Artificial Intelligence, Computer Science, and Science**.

---

## ✨ Key Features

- **⚡ Instant Highlight Translation**: Select or highlight any French word or phrase on any webpage to immediately see its precision English scientific translation in a floating, glassmorphic card.
- **🛡️ Scoped Shadow DOM Architecture**: Injected entirely within an isolated Shadow DOM—zero styling collision or layout disruption on any host website (arXiv, Wikipedia, GitHub, Substack, Medium, etc.).
- **🎯 STEM Precision & False-Friend Warnings**:
  - `corps` ➔ **Field** (not *body*) in abstract algebra.
  - `variété` ➔ **Manifold** (not *variety*) in differential geometry.
  - `adhérence` ➔ **Closure** (not *adherence*) in topology.
  - `noyau` ➔ **Kernel / Null space** (not *nucleus* or *core*) in linear algebra.
  - `recouvrement` ➔ **Covering / Cover** (not *recovery*) in topology.
  - `tas` ➔ **Heap** (data structure), while `pile` ➔ **Stack**.
  - `tribu` ➔ **$\sigma$-algebra / $\sigma$-field** (not *tribe*) in probability and measure theory.
  - `espérance` ➔ **Expected value / Expectation** (not *hope*).
  - `s'annuler` ➔ **To vanish / To equal zero** (not *to cancel*).
- **🔊 Native Audio Pronunciation**: Listen to standard French and English pronunciations via the Web Speech API with a single click.
- **🧠 Lemmatization & Morphological Stemming**: Automatically recognizes plurals (`valeurs propres` ➔ `valeur propre`, `réseaux` ➔ `réseau`), feminine variations (`bornée` ➔ `borné`), elisions (`l'espace` ➔ `espace`), and conjugated verbs (`s'annulent` ➔ `s'annuler`, `convergent` ➔ `converger`).
- **📚 Interactive Extension Popup**:
  - Live instant search with prefix and keyword fuzzy matching across French and English.
  - Discipline filter pills: **📐 Mathematics**, **🤖 AI & Machine Learning**, **💻 Computer Science**, **🔬 Physics & Science**, and **📖 Academic French**.
  - **Scientific Concept of the Day** to discover mathematical definitions daily.
- **🗂️ Anki & CSV Export**: Bookmark terms with a star (★) and export them directly to an **Anki Flashcard Deck (`.txt`)** or CSV for spaced repetition review!
- **🌐 Offline-First with Online Fallback**: Zero-latency offline database for core STEM terms, with automatic fallback for rare or general words.

---

## 📖 Domain Expert Audit & Peer Review

For mathematicians, researchers, and technical auditors conducting peer review or security analysis:
- 📑 **[Domain Expert Audit Guide](docs/DOMAIN_EXPERT_AUDIT_GUIDE.md)**: In-depth axiomatic analyses, discipline-by-discipline translation rationale, morphological stemming formalisms, and Manifest V3 security audit.
- 📐 **[Lexicon Specification](docs/LEXICON_SPECIFICATION.md)**: Full database schema and tabular reference of all cataloged terms with academic literature citations (*Bourbaki, Laurent Schwartz, LeCun, Cormen*).
- 🧪 **Automated Test Suite**: Run `npm test` to execute the 95-point automated verification and regression test suite.

---

## 🚀 Installation Guide

### Brave Browser & Google Chrome

1. Clone or download this repository:
   ```bash
   git clone https://github.com/qhungbui7/french-science-dictionary.git
   ```
2. Open your browser and navigate to the Extensions page:
   - In **Brave**: navigate to `brave://extensions`
   - In **Google Chrome**: navigate to `chrome://extensions`
3. Toggle on **Developer mode** in the top-right corner.
4. Click the **Load unpacked** button in the top-left toolbar.
5. Select the `french-science-dictionary` directory.
6. The extension is now active! Pin it to your toolbar for quick access.

---

## 🧪 Testing the Extension

1. Open [`test_page.html`](test_page.html) directly in your browser.
2. Select any scientific word or multi-word phrase (e.g. *valeurs propres*, *descente de gradient stochastique*, *espace de Banach*, *exclusion mutuelle*).
3. The floating translation card will appear instantly at your cursor location.

---

## 📂 Project Structure

```
french-science-dictionary/
├── manifest.json              # Manifest V3 specification
├── background/
│   └── background.js          # Service worker (context menus & online fallback)
├── content/
│   ├── content.js             # Selection listener & Shadow DOM injection
│   └── content.css            # Scoped styles for floating tooltip card
├── popup/
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Obsidian glassmorphic styling
│   └── popup.js              # Live search, Anki export, favorites & history
├── options/
│   ├── options.html           # Full-page extension preferences
│   ├── options.css            # Preferences page styles
│   └── options.js             # Settings synchronization
├── data/
│   ├── science_terms.js       # Curated bilingual STEM terminology
│   ├── academic_french.js     # Mathematical reasoning & connectors
│   └── dictionary_core.js     # Lookup engine, morphology & lemmatizer
├── icons/
│   ├── icon16.png             # Toolbar icon (16x16)
│   ├── icon32.png             # Browser action icon (32x32)
│   ├── icon48.png             # Extension management icon (48x48)
│   ├── icon128.png            # High-resolution store icon (128x128)
│   └── icon.svg               # Scalable vector master asset
├── test_page.html             # Interactive testing workbench with authentic excerpts
├── changelog.md               # Version log & updates
└── README.md                  # Documentation
```

---

## ⚙️ Configuration & Options

Click the extension icon or right-click to open **Options**:
- **Auto-Translate on Highlight**: Toggle instant translation on or off.
- **Trigger Mode**:
  - `Instant Popover` (default): Appears immediately on text selection.
  - `Floating Icon`: Shows a subtle `🔬` icon next to selection; click to expand.
  - `Alt / Option Key`: Only translates when holding `Alt` while selecting.
- **Auto-Pronounce**: Automatically speak the French pronunciation on selection.
- **Online Fallback**: Query online scientific translation if an ultra-rare word is not in the offline database.

---

## 🤝 Contributing

Contributions of new mathematical, AI, computer science, and physics terms are very welcome! Please feel free to open a Pull Request or Issue to add terms, improve definitions, or suggest additional false-friend caveats.

## 📄 License

Distributed under the [MIT License](LICENSE).
