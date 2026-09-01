# WP Engine Cache Inspector

Chrome Manifest V3 extension for inspecting WP Engine and HTTP cache status on the current page.

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

Vite + CRXJS watches files and updates the loaded extension. Popup changes hot-reload. Background service worker changes reload the extension. This extension has no content script, so you still need to reload the target page to recapture headers.

## Production
```bash
npm run build
```

Zip the `dist/` directory for an unlisted Chrome Web Store release.

## Local install (built `dist/`)
1. Unzip.
2. Open chrome://extensions.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select this folder.
6. Pin the extension.
7. Reload a page once.
