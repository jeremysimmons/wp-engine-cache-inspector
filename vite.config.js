import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config.js'

export default defineConfig(({ mode }) => {
  const browser = mode === 'firefox' ? 'firefox' : 'chrome'

  return {
    plugins: [
      crx({ manifest, browser }),
    ],
    build: {
      outDir: browser === 'firefox' ? 'dist-firefox' : 'dist',
    },
    server: {
      cors: {
        origin: [
          /chrome-extension:\/\//,
          /moz-extension:\/\//,
        ],
      },
    },
  }
})
