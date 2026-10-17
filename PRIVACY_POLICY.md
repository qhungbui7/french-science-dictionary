# Privacy Policy — French Science & Math Dictionary

**Last Updated**: October 17, 2026  
**Extension**: French Science & Math Dictionary (Brave & Google Chrome)  
**Repository**: [https://github.com/qhungbui7/french-science-dictionary](https://github.com/qhungbui7/french-science-dictionary)  
**Developer**: Quốc Hùng Bùi ([@qhungbui7](https://github.com/qhungbui7))  

---

## 1. Executive Summary

The **French Science & Math Dictionary** is built on an **offline-first, zero-telemetry** architecture designed for researchers, mathematicians, and students reading technical scientific literature.

- **We do not collect, store, sell, or monetize any personal data.**
- **No analytics, no cookies, no tracking pixels, and no fingerprinting** are embedded in this extension.
- **Offline dictionary lookups operate with 0 network requests.**
- When the optional **Online Fallback** feature is enabled, only the selected uncataloged phrase is sent to a third-party translation API (MyMemory) to retrieve a definition. Disabling this toggle completely disables all network traffic.

---

## 2. Data Handled Locally on Your Device

The extension uses Chrome's built-in `chrome.storage.local` and `chrome.storage.sync` APIs strictly for local functionality:

| Data Type | Purpose | Storage Location | Shared Externally? |
| :--- | :--- | :--- | :--- |
| **User Preferences** (`settings`) | Remembers trigger mode (`button`, `instant`, `alt`), auto-translate, auto-pronounce, and fallback toggle. | `chrome.storage.sync` / `local` | **Never** |
| **Search History** (`history`) | Displays recent lookups in the extension popup for study revision (last 50 items). | `chrome.storage.local` | **Never** |
| **Starred Bookmarks** (`favorites`) | Stores terms you star for study and export to Anki / CSV. | `chrome.storage.local` | **Never** |

All local data remains strictly inside your browser profile. You can purge history and favorites at any time from the popup interface, or by uninstalling the extension.

---

## 3. External Network Requests & Third-Party Services

### Third-Party Service: MyMemory Translated API
- **Endpoint**: `https://api.mymemory.translated.net/get`
- **Purpose**: Provides an optional fallback translation when a selected technical phrase is not present in our curated offline dictionary.
- **Provider**: Translated s.r.l. ([MyMemory Privacy Policy](https://mymemory.translated.net/doc/tos.php))

### Strict Conditions for Transmission
An external network call is made **only if all of the following conditions are met**:
1. You highlight a word or phrase on a webpage or invoke the context menu.
2. The term is **not found** in the local offline scientific lexicon.
3. The **"Enable Online Fallback"** setting is toggled **ON** (checked).

### What is Transmitted:
- The selected French text string.
- Language pair parameters (`fr|en`).

### What is NEVER Transmitted:
- ❌ No personal identifiers, names, or email addresses.
- ❌ No IP tracking or browser fingerprints.
- ❌ No host webpage URLs, browsing history, or surrounding DOM content.
- ❌ No authentication tokens, cookies, or session state.

### How to Disable All External Network Requests:
You have complete control over external requests:
1. Click the extension icon in your browser toolbar to open the Popup.
2. Go to the **Settings** tab (or right-click the extension and select **Options**).
3. Uncheck **"Enable Online Fallback"**.

When disabled, the extension enforces an offline-only policy: uncataloged terms display a local "not found" card, and **zero network requests are dispatched** by the extension under any circumstances.

---

## 4. Permissions Scope & Minimization

The extension requests only the minimum permissions necessary under Google Chrome Web Store Developer Policies:

- `storage`: Required to save user preferences, favorites, and search history locally.
- `contextMenus`: Required to provide the right-click *"Translate with French Science Dictionary"* shortcut.
- `host_permissions: ["https://api.mymemory.translated.net/*"]`: Narrowly scoped strictly to the MyMemory API host for optional fallback translations. No other remote hosts are permitted.
- `content_scripts: ["<all_urls>"]`: Enables reading text selections when you highlight mathematical terms across scientific repositories, universities, and preprint archives (e.g., `arxiv.org`, `hal.science`, `inria.fr`, `univ-paris-saclay.fr`). Content scripts run in an isolated world and do not transmit page content.

---

## 5. Chrome Web Store Policy Compliance

In compliance with the **Chrome Web Store Developer Program Policies** (including the August 2026 data handling requirements):
- The extension does not collect or transmit **Personally Identifiable Information (PII)**, financial data, authentication credentials, or health data.
- The single data type transmitted externally (selected text for translation) is transmitted over secure HTTPS directly to the translation service solely to perform the advertised translation functionality requested by the user.
- Data is not sold, rented, transferred for credit assessment, or used for targeted advertising.

---

## 6. Open Source Verification & Contact

This extension is completely open-source under the MIT License. Anyone can audit the complete source code and network calls on GitHub:

- **Repository**: [https://github.com/qhungbui7/french-science-dictionary](https://github.com/qhungbui7/french-science-dictionary)
- **Security & Privacy Inquiries**: Open an issue on GitHub or contact the maintainer at `bqhung127@gmail.com`.
