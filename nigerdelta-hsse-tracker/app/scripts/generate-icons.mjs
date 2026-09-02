import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.dirname(fileURLToPath(import.meta.url))
const svgPath = path.join(dir, 'icon.svg')
const publicDir = path.join(dir, '..', 'public')

const sizes = [192, 512]

for (const size of sizes) {
  const outPath = path.join(publicDir, `icon-${size}.png`)
  await sharp(svgPath).resize(size, size).png().toFile(outPath)
  console.log(`Wrote ${outPath}`)
}
