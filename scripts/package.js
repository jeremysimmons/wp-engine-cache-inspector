import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pkg from '../package.json' with { type: 'json' }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const staging = resolve(root, '.package-tmp')
const zipName = `${pkg.name}-${pkg.version}.zip`
const zipPath = resolve(root, zipName)

if (!existsSync(dist)) {
  console.error('dist/ missing')
  process.exit(1)
}

if (existsSync(zipPath)) {
  unlinkSync(zipPath)
}

rmSync(staging, { recursive: true, force: true })
mkdirSync(staging, { recursive: true })
cpSync(dist, staging, { recursive: true })

const manifestPath = resolve(staging, 'manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
delete manifest.key
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

execSync(`zip -r ${JSON.stringify(zipPath)} . -x '*.DS_Store' '*.map'`, {
  cwd: staging,
  stdio: 'inherit',
})

rmSync(staging, { recursive: true, force: true })
console.log(`Wrote ${zipName}`)
