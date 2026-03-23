/**
 * BacklogPanel - テキスト履歴パネル
 * 過去のナレーション・セリフを遡って確認できる
 */

import { useEffect, useRef } from 'preact/hooks'
import type { BacklogEntry } from '../engine/types'
import { stripRuby } from '../engine/RubyParser'

interface Props {
  entries: BacklogEntry[]
  onClose: () => void
}

export function BacklogPanel({ entries, onClose }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // 開いたとき最下部（最新）にスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [])

  return (
    <div class="backlog-overlay" onClick={onClose}>
      <div class="backlog-panel" onClick={(e) => e.stopPropagation()}>
        <div class="backlog-header">
          <span class="backlog-title">テキスト履歴</span>
          <button class="backlog-close" onClick={onClose}>✕</button>
        </div>
        <div class="backlog-list">
          {entries.length === 0 && (
            <div class="backlog-empty">まだテキストがありません</div>
          )}
          {entries.map((entry, i) => (
            <div key={i} class="backlog-entry">
              {entry.characterName && (
                <span
                  class="backlog-name"
                  style={{ color: entry.characterColor || '#fff' }}
                >
                  {entry.characterName}
                </span>
              )}
              <span class="backlog-text">{stripRuby(entry.text)}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
