/**
 * ChoicePanel - 選択肢の表示UI
 *
 * Kahoot!方式の4色選択肢パネル。
 * 選択すると短いフィードバックを表示してから次へ進む。
 */

import { useState } from 'preact/hooks'
import type { ChoiceStep } from '../engine/types'
import { stripRuby } from '../engine/RubyParser'

const CHOICE_COLOR_CLASSES = ['choice-color-a', 'choice-color-b', 'choice-color-c', 'choice-color-d', 'choice-color-e']

interface Props {
  choice: ChoiceStep
  onSelect: (choiceId: string, value: string) => void
}

export function ChoicePanel({ choice, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (value: string) => {
    if (selected) return
    setSelected(value)
    setTimeout(() => {
      onSelect(choice.id, value)
    }, 600)
  }

  return (
    <div class="choice-overlay">
      <div class="choice-panel">
        {choice.question && (
          <div class="choice-question">{stripRuby(choice.question)}</div>
        )}
        <div class="choice-options">
          {choice.options.map((option, i) => {
            const colorClass = CHOICE_COLOR_CLASSES[i % CHOICE_COLOR_CLASSES.length]
            const isSelected = selected === option.value
            const isDimmed = selected && !isSelected
            return (
              <button
                key={option.value}
                class={[
                  'choice-option',
                  colorClass,
                  isSelected ? 'selected' : '',
                  isDimmed ? 'dimmed' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleSelect(option.value)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span class="choice-label">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span class="choice-text">{stripRuby(option.text)}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
