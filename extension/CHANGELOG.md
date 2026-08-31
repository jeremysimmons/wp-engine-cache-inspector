# Changelog

## 1.2.0 — 2026-08-31

- Cache bust: request the current URL with `_={epoch_ms}` (keeps other query params and the hash).

## 1.1.0 — 2026-08-31

- Plain-English cache TTL: remaining time, or how long a fresh copy can live.
- Request cookie capture for WordPress-related names (values are not stored).
- When WP Engine reports `x-pass-why: logged-in`, distinguish `wordpress_logged_in_*` from `wordpress_test_cookie` and other `wordpress_*` cookies.
- Copied reports include cookie classification.

## 1.0.0 — 2026-08-31

- HIT / MISS / BYPASS and Cloudflare cache status for the current page.
- Cache layer, Age, TTL (`s-maxage` / `max-age`), remaining TTL.
- WP Engine and HTTP cache response headers (`x-cache`, `x-pass-why`, `cache-control`, `cf-cache-status`, and related).
- Reload page and copy JSON report.
