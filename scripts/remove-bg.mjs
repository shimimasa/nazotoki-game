#!/usr/bin/env node
/**
 * 立ち絵の白背景を透過に変換するスクリプト
 *
 * 使い方:
 *   node scripts/remove-bg.mjs
 *   node scripts/remove-bg.mjs --threshold 240
 *
 * public/images/sprites/ 内の全 .webp ファイルの白背景を透過にする。
 * 元ファイルは .bak.webp としてバックアップされる。
 */

import sharp from 'sharp'
import { readdir, rename } from 'fs/promises'
import { join } from 'path'

const SPRITES_DIR = join(import.meta.dirname, '..', 'public', 'images', 'sprites')
const THRESHOLD = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--threshold') ?? '240')

async function removeWhiteBg(filePath) {
  const image = sharp(filePath)
  const { width, height, channels } = await image.metadata()

  if (!width || !height) {
    console.log(`  スキップ (メタデータ取得不可): ${filePath}`)
    return
  }

  // 生のピクセルデータを取得（RGBA）
  const { data } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // 白に近いピクセルを透過にする
  const pixels = Buffer.from(data)
  let changed = 0

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]

    // RGB全てがしきい値以上なら「白」と判定して透過に
    if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
      pixels[i + 3] = 0 // アルファを0に
      changed++
    }
  }

  // 透過済み画像を保存
  await sharp(pixels, {
    raw: { width, height, channels: 4 },
  })
    .webp({ quality: 90 })
    .toFile(filePath + '.tmp')

  // バックアップ → 置き換え
  await rename(filePath, filePath.replace('.webp', '.bak.webp'))
  await rename(filePath + '.tmp', filePath)

  const totalPixels = width * height
  const pct = ((changed / totalPixels) * 100).toFixed(1)
  console.log(`  ✅ ${changed}/${totalPixels} ピクセル透過 (${pct}%)`)
}

async function main() {
  console.log(`\n🎨 白背景を透過に変換 (しきい値: RGB >= ${THRESHOLD})\n`)
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
      await removeWhiteBg(join(SPRITES_DIR, file))
    } catch (err) {
      console.log(`  ❌ エラー: ${err.message}`)
    }
  }

  console.log(`\n完了！ バックアップは .bak.webp として保存済み。`)
  console.log(`問題なければ .bak.webp を削除してOK。`)
}

main().catch(console.error)
