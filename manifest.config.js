import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: 'WP Engine Cache Inspector',
  version: pkg.version,
  description: pkg.description,
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
