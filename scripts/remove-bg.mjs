#!/usr/bin/env node
/**
 * 立ち絵の白背景を透過に変換するスクリプト（改良版）
 *
 * 使い方:
 *   node scripts/remove-bg.mjs
 *   node scripts/remove-bg.mjs --threshold 250
 *
 * 改良点:
 * - 画像の四辺から繋がっている白ピクセルのみを透過にする（フラッドフィル方式）
 * - キャラクター内部の白（白衣、ハイライト等）は残る
 */

import sharp from 'sharp'
import { readdir, rename, stat } from 'fs/promises'
import { join } from 'path'

const SPRITES_DIR = join(import.meta.dirname, '..', 'public', 'images', 'sprites')
const THRESHOLD = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--threshold') ?? '250')

async function removeWhiteBgFloodFill(filePath) {
  const image = sharp(filePath)
  const { width, height } = await image.metadata()
  if (!width || !height) return

  const { data } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = Buffer.from(data)
  const visited = new Uint8Array(width * height)
  const toRemove = new Uint8Array(width * height)

  function isWhite(idx) {
    const offset = idx * 4
    return (
      pixels[offset] >= THRESHOLD &&
      pixels[offset + 1] >= THRESHOLD &&
      pixels[offset + 2] >= THRESHOLD
    )
  }

  // BFS: 画像の四辺からスタートして、つながっている白ピクセルだけを透過対象にする
  const queue = []

  // 上辺と下辺
  for (let x = 0; x < width; x++) {
    queue.push(x) // 上辺
    queue.push((height - 1) * width + x) // 下辺
  }
  // 左辺と右辺
  for (let y = 0; y < height; y++) {
    queue.push(y * width) // 左辺
    queue.push(y * width + (width - 1)) // 右辺
  }

  // BFS実行
  let head = 0
  while (head < queue.length) {
    const idx = queue[head++]
    if (idx < 0 || idx >= width * height) continue
    if (visited[idx]) continue
    visited[idx] = 1

    if (!isWhite(idx)) continue

    toRemove[idx] = 1

    const x = idx % width
    const y = Math.floor(idx / width)

    if (x > 0) queue.push(idx - 1) // 左
    if (x < width - 1) queue.push(idx + 1) // 右
    if (y > 0) queue.push(idx - width) // 上
    if (y < height - 1) queue.push(idx + width) // 下
  }

  // 透過対象のピクセルのアルファを0にする
  let changed = 0
  for (let i = 0; i < width * height; i++) {
    if (toRemove[i]) {
      pixels[i * 4 + 3] = 0
      changed++
    }
  }

  await sharp(pixels, { raw: { width, height, channels: 4 } })
    .webp({ quality: 92 })
    .toFile(filePath + '.tmp')

  // バックアップがあれば上書き、なければバックアップ作成
  const bakPath = filePath.replace('.webp', '.bak.webp')
  try {
    await stat(bakPath)
  } catch {
    await rename(filePath, bakPath)
  }
  await rename(filePath + '.tmp', filePath)

  const totalPixels = width * height
  const pct = ((changed / totalPixels) * 100).toFixed(1)
  console.log(`  ✅ ${changed}/${totalPixels} ピクセル透過 (${pct}%) — フラッドフィル方式`)
}

async function main() {
  console.log(`\n🎨 白背景を透過に変換【フラッドフィル方式】(しきい値: RGB >= ${THRESHOLD})\n`)
  console.log(`対象ディレクトリ: ${SPRITES_DIR}\n`)

  const files = (await readdir(SPRITES_DIR))
    .filter(f => f.endsWith('.webp') && !f.includes('.bak.'))
    .sort()

  if (files.length === 0) {
    console.log('対象ファイルなし。')
    return
  }

  for (const file of files) {
    console.log(`処理中: ${file}`)
    try {
      await removeWhiteBgFloodFill(join(SPRITES_DIR, file))
    } catch (err) {
      console.log(`  ❌ エラー: ${err.message}`)
    }
  }

  console.log(`\n完了！`)
}

main().catch(console.error)
