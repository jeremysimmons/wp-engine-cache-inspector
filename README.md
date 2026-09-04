# WP Engine Cache Inspector

Chrome / Firefox Manifest V3 extension for inspecting WP Engine and HTTP cache status on the current page.

See [CHANGELOG.md](CHANGELOG.md) for versions.

## Shows
- HIT / MISS / BYPASS / Cloudflare status
- Cache layer
- Age
- TTL from s-maxage or max-age
- Calculated remaining TTL
- x-cache, x-pass-why, cache-control, cf-cache-status, via, vary, etag, last-modified, expires

## Develop
Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then:
1. Open `chrome://extensions`
2. Enable Developer mode
3. Click Load unpacked
4. Select the `dist/` folder

Firefox:

```bash
npm run dev:firefox
```

Then:
1. Open `about:debugging#/runtime/this-firefox`
2. Click Load Temporary Add-on
3. Select `dist-firefox/manifest.json`

Vite + CRXJS watches files and updates the loaded extension. Popup changes hot-reload. Background service worker changes reload the extension. This extension has no content script, so you still need to reload the target page to recapture headers. Firefox temporary add-ons are cleared when Firefox quits.

## Production
```bash
npm run package
```

Builds `dist/` and writes `wp-engine-cache-inspector-<version>.zip` (manifest at zip root) for Chrome Web Store upload.

Upload the zip to the existing item `onenpcgedbffidbkpeamobmhlnfgaeng`. Listing details are unchanged. See `assets/unlisted-publishing-instructions.txt`.

```bash
npm run package:firefox
```

Builds `dist-firefox/` and writes `wp-engine-cache-inspector-<version>-firefox.zip`.

```bash
npm run build
npm run build:firefox
```

Build only, no zip.

## Local install (built `dist/`)
1. Unzip.
2. Open chrome://extensions.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select this folder.
6. Pin the extension.
7. Reload a page once.

## Local install (Firefox, built `dist-firefox/`)
1. Open `about:debugging#/runtime/this-firefox`.
2. Click Load Temporary Add-on.
3. Select `manifest.json` in this folder.
4. Reload a page once.
