import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: 'WP Engine Cache Inspector',
  version: pkg.version,
  description: pkg.description,
  // Chrome Web Store ID: onenpcgedbffidbkpeamobmhlnfgaeng
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvRGjRh6+tCtgU/fS41cNyobIgqo1lvw8ej7cSmpsIGGcg+qaBNTV9HaPfHaYXeQ4I6MZWsJEzAT73pOdDn9HzUFNc+ccrKvjFn5TUxnjx7nUuGwTI6C9Tdlduojm/o28srk4bVsc99GL1fAvxFJI2ijhEUgqbqGd5s6taViKmYEvkpht0zKFh6JZzpswjmlNypIndz4YcusKLGM7YHRZU/Wd/GI+aFavHT76+2svAi1Ei+xeZWQqSdnHvczJ6S9E+mpJTVJP4jhQ1xbS1mSe96054pUA3tBXknKFEHRxCofEnKX+IE5bp3A5XcjKaWA0bNQnytCRtpYe1UJziD/20QIDAQAB',
  permissions: [
    'webRequest',
    'tabs',
    'storage',
  ],
  host_permissions: [
    '<all_urls>',
  ],
  background: {
    service_worker: 'src/background.js',
    type: 'module',
  },
  action: {
    default_title: 'WP Engine Cache Inspector',
    default_popup: 'src/popup.html',
  },
  icons: {
    16: 'icons/icon16.png',
    32: 'icons/icon32.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
})
