/**
 * RubyParser - {漢字|ふりがな} 記法を解析してレンダリング用データに変換
 *
 * 入力: "「{虹色|にじいろ}の{結晶|けっしょう}」が{消|き}えた"
 * 出力: セグメント配列 + ふりがなON/OFFに応じたHTMLまたはプレーンテキスト
 */

export interface TextSegment {
  type: 'plain' | 'ruby'
  content: string  // プレーンテキスト or 漢字（base）
  ruby?: string    // ふりがな
}

const RUBY_REGEX = /\{([^|]+)\|([^}]+)\}/g

/**
 * テキストをセグメント配列に分割
 */
export function parseRubyText(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0
  let match

  // グローバルflagを持つRegExpはexecでステートフルなのでリセット
  RUBY_REGEX.lastIndex = 0

  while ((match = RUBY_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'plain', content: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'ruby', content: match[1], ruby: match[2] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'plain', content: text.slice(lastIndex) })
  }

  return segments
}

/**
 * セグメントの「表示単位数」を計算
 * plain: 1文字=1単位、ruby: グループ全体で1単位
 */
export function countVisualUnits(segments: TextSegment[]): number {
  let count = 0
  for (const seg of segments) {
    count += seg.type === 'ruby' ? 1 : seg.content.length
  }
  return count
}

/**
 * 指定位置までのHTMLを生成（タイプライター用）
 * @param segments パース済みセグメント
 * @param visibleUnits 表示する単位数
 * @param furigana ふりがなを表示するか
 */
export function renderSegmentsToHtml(
  segments: TextSegment[],
  visibleUnits: number,
  furigana: boolean
): string {
  let html = ''
  let remaining = visibleUnits

  for (const seg of segments) {
    if (remaining <= 0) break

    if (seg.type === 'plain') {
      const chars = Math.min(remaining, seg.content.length)
      html += escapeHtml(seg.content.slice(0, chars))
      remaining -= chars
    } else {
      // ruby: 1単位として扱う
      if (furigana) {
        html += `<ruby>${escapeHtml(seg.content)}<rp>(</rp><rt>${escapeHtml(seg.ruby!)}</rt><rp>)</rp></ruby>`
      } else {
        html += escapeHtml(seg.content)
      }
      remaining -= 1
    }
  }

  return html
}

/**
 * ふりがな記法を除去してプレーンテキストに変換
 */
export function stripRuby(text: string): string {
  return text.replace(RUBY_REGEX, '$1')
}

/**
 * unitIndex 番目の表示単位の末尾文字を返す（句読点判定用）
 */
export function getUnitChar(segments: TextSegment[], unitIndex: number): string {
  let pos = 0
  for (const seg of segments) {
    if (seg.type === 'ruby') {
      if (pos === unitIndex) return seg.content[seg.content.length - 1]
      pos++
    } else {
      for (const ch of seg.content) {
        if (pos === unitIndex) return ch
        pos++
      }
    }
  }
  return ''
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
