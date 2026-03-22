/**
 * ChoicePanel - 選択肢の表示UI
 *
 * ダンガンロンパ風の選択肢パネル。
 * 選択すると短いフィードバックを表示してから次へ進む。
 */

import { useState } from 'preact/hooks'
import type { ChoiceStep } from '../engine/types'

interface Props {
  choice: ChoiceStep
  onSelect: (choiceId: string, value: string) => void
}

export function ChoicePanel({ choice, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (value: string) => {
    if (selected) return // 二重クリック防止
    setSelected(value)
    setTimeout(() => {
      onSelect(choice.id, value)
    }, 600) // 選択演出の後に進む
  }

  return (
    <div class="choice-overlay">
      <div class="choice-panel">
        {choice.question && (
          <div class="choice-question">{choice.question}</div>
        )}
        <div class="choice-options">
          {choice.options.map((option, i) => (
            <button
              key={option.value}
              class={`choice-option ${selected === option.value ? 'selected' : ''} ${selected && selected !== option.value ? 'dimmed' : ''}`}
              onClick={() => handleSelect(option.value)}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span class="choice-label">
                {String.fromCharCode(65 + i)}.
              </span>
              <span class="choice-text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
