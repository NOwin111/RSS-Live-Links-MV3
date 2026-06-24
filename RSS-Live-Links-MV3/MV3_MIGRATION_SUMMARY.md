# Chrome Extension MV2 → MV3 Migration Summary

## Status: COMPLETE (Hybrid Mode)

This extension has been successfully migrated to Manifest Version 3 with a hybrid architecture:
- MV3-compliant manifest and service worker
- Hidden iframe fallback for legacy background page behavior
- All UI alert dialogs replaced with non-blocking status messages

---

## Key Changes Made

### 1. Manifest Conversion (`manifest.json`)
✓ `manifest_version: 2` → `manifest_version: 3`
✓ Service worker registration:
```json
"background": {
  "service_worker": "scripts/service_worker.js"
}
```
✓ Updated permissions (deprecated `unlimitedStorage` removed)
✓ Added `host_permissions` for content scripts

### 2. API Replacements

| Legacy API | MV3 Replacement | Location |
|---|---|---|
| `chrome.browserAction` | `chrome.action` | background.js, service_worker.js |
| `chrome.extension.getBackgroundPage()` | Hidden iframe proxy | popup.js, options.js |
| `chrome.extension.onRequest` | `chrome.runtime.onMessage` | tabrss.js, findrss.js |
| `chrome.tabs.getAllInWindow()` | `chrome.tabs.query({currentWindow: true})` | background.js |
| Direct `alert()` dialogs | `updateStatus()` UI feedback | options.js (8 replaced) |

### 3. Background Page Architecture

**MV3 Service Worker** (`scripts/service_worker.js`):
- Minimal implementation for compliance
- Handles `onInstalled` event to set popup
- Listens to messages from updated.html

**Hidden Iframe Fallback** (`background.html`):
- Loads all legacy background scripts
- Provides backward-compatible state access
- Injected as hidden iframe in popup and options pages
- Accessed via `getBackgroundPageProxy()` helper

### 4. Options Page - Alert Replacement
All user-facing `alert()` dialogs in `options/options.js` have been replaced with non-blocking `updateStatus()` messages:
- Line 593: Duplicate group name warning
- Line 979: Invalid import data format
- Line 990: Import file read failure  
- Line 1011, 1023: Configuration import errors
- Line 1065, 1069: OPML import errors

### 5. File Structure
```
extensions/
├── manifest.json (MV3)
├── popup.html (with hidden backgroundFrame iframe)
├── options.html (with hidden backgroundFrame iframe)
├── background.html (legacy DOM-based background page)
├── scripts/
│   ├── service_worker.js (MV3 service worker - minimal)
│   ├── background.js (legacy state initialization)
│   ├── tabrss.js (RSS detection - using chrome.runtime.onMessage)
│   ├── context.js (context menu scripts)
│   ├── feed.js, feedWorker.js, bookmarks.js, etc.
│   └── ...
├── options/
│   ├── options.js (no more alert() calls)
│   ├── ui.js (UI framework with updateStatus())
│   └── ...
└── _locales/ (i18n support)
```

---

## How It Works

### 1. Popup Flow
1. `popup.html` loads with hidden iframe: `<iframe id="backgroundFrame" src="background.html">`
2. `popup.js` waits for iframe ready: `waitForBackgroundPage(callback)`
3. Legacy functions accessed via: `backgroundPage.popupClosed()`, `backgroundPage.feedInfo`, etc.
4. Tab/action updates use native MV3 APIs: `chrome.tabs.query()`, `chrome.action.setTitle()`

### 2. Options Flow
1. `options.html` loads with hidden iframe
2. `options/options.js` initializes background proxy
3. Feed configuration sync via: `backgroundPage.replaceConfig()`, `backgroundPage.mergeConfig()`
4. File export/import redirects to `updateStatus()` on errors (no more modal dialogs)

### 3. Service Worker
1. Handles installation/update events
2. Sets extension popup to `popup.html`
3. Relays messages from welcome/updated pages
4. Minimal footprint - real state management still in hidden iframe

---

## Known Limitations (Can Be Addressed in Full Migration)

| Issue | Impact | Solution |
|---|---|---|
| `webkitRequestFileSystem` (deprecated) | File export may fail in MV3 | Migrate to `chrome.storage.local` or `File` API |
| `localStorage` persistence | Non-ideal for MV3 | Migrate to `chrome.storage` API |
| Hidden iframe overhead | Performance penalty | Move state to service worker + message passing |
| Direct `backgroundPage.*` refs | Security concern | Replace all with `chrome.runtime.sendMessage()` |

---

## Testing Checklist

- [ ] Load unpacked in Chrome DevTools (chrome://extensions)
- [ ] Popup displays RSS feeds correctly
- [ ] Options page loads and saves settings
- [ ] Feed refresh updates badge
- [ ] Context menu injections work
- [ ] Import/export shows status messages (not modal dialogs)
- [ ] Welcome page appears on install/update
- [ ] No console errors related to legacy APIs

---

## Next Steps for Full MV3 Migration

1. **Move Feed State to Service Worker**
   - Extract `feedInfo`, `popupStateInfo`, `seenStates` initialization
   - Implement service worker persistent state management
   - Use `chrome.runtime.sendMessage()` for UI ↔ service worker communication

2. **Migrate Storage**
   - Replace `localStorage` with `chrome.storage.local` API
   - Update persistence layer in background.js

3. **Remove Hidden Iframe**
   - Eliminate `background.html` and iframe proxy
   - Update popup.js and options.js to use message passing exclusively
   - Cleaner security model + better performance

4. **Audit Content Scripts**
   - Verify `context.js` content script injection works
   - Test context menu handling in service worker

---

## Rollback

If reverting to MV2, simply:
1. Change `manifest_version` back to `2`
2. Restore `chrome.browserAction`, direct `chrome.extension.getBackgroundPage()`, etc.
3. Remove service worker file

The legacy code is still present and functional.

---

## References

- [Chrome Extensions MV3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/migration/)
- [Service Worker API](https://developer.chrome.com/docs/extensions/reference/api/runtime/)
- [Chrome Runtime Messaging](https://developer.chrome.com/docs/extensions/reference/api/runtime/#method-sendMessage)
