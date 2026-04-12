/**
 * EvidenceBoard - 収集した証拠カードの一覧パネル
 */

import type { EvidenceItem } from '../engine/types'

interface Props {
  evidence: EvidenceItem[]
  open: boolean
  onClose: () => void
}

export function EvidenceBoard({ evidence, open, onClose }: Props) {
  if (!open) return null

  return (
    <div class="evidence-board-backdrop" onClick={onClose}>
      <div class="evidence-board" onClick={(e) => e.stopPropagation()}>
        <div class="evidence-board-header">
          <span>🔍 証拠ボード</span>
          <button class="evidence-board-close" onClick={onClose}>✕</button>
        </div>
        <div class="evidence-board-list">
          {evidence.length === 0 ? (
            <div class="evidence-board-empty">
              まだ証拠を集めていません
            </div>
          ) : (
            evidence.map((item, i) => (
              <div key={item.sceneId} class="evidence-card">
                <div class="evidence-card-number">{i + 1}</div>
                <div class="evidence-card-title">{item.title}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
