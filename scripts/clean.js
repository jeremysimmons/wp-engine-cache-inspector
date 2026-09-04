import { existsSync, readdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pkg from '../package.json' with { type: 'json' }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const targets = [
  resolve(root, 'dist'),
  resolve(root, '.package-tmp'),
  resolve(root, `${pkg.name}-${pkg.version}.zip`),
  ...readdirSync(root)
    .filter((name) => name.endsWith('.zip'))
    .map((name) => resolve(root, name)),
]

for (const path of new Set(targets)) {
  if (!existsSync(path)) {
    continue
  }
  rmSync(path, { recursive: true, force: true })
  console.log(`Removed ${path.slice(root.length + 1)}`)
}
