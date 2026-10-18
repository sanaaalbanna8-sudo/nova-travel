import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
for (const seat of ['host', 'join']) {
  mkdirSync(join(dist, seat), { recursive: true })
  copyFileSync(join(dist, 'index.html'), join(dist, seat, 'index.html'))
}
