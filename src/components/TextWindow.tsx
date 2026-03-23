/**
 * TextWindow - テキストウィンドウ + ネームプレート
 *
 * タイプライター効果でテキストを表示。
 * {漢字|ふりがな} 記法に対応し、ふりがなON/OFFを切替可能。
 */

import { useEffect, useRef, useMemo } from 'preact/hooks'
import type { TextDisplayState } from '../engine/types'
import { parseRubyText, countVisualUnits, renderSegmentsToHtml } from '../engine/RubyParser'

interface Props {
  display: TextDisplayState
  onTypingComplete: () => void
  typingSpeed?: number
  furiganaEnabled?: boolean
}

export function TextWindow({
  display,
  onTypingComplete,
  typingSpeed = 30,
  furiganaEnabled = false,
}: Props) {
  const segments = useMemo(() => parseRubyText(display.text), [display.text])
  const totalUnits = useMemo(() => countVisualUnits(segments), [segments])

  return (
    <div class="text-window">
      {display.characterName && (
        <div
          class="name-plate"
          style={{ borderColor: display.characterColor ?? '#fff' }}
        >
          <span style={{ color: display.characterColor ?? '#fff' }}>
            {display.characterName}
          </span>
        </div>
      )}
      <div class="text-content">
        <TypewriterRubyText
          segments={segments}
          totalUnits={totalUnits}
          isTyping={display.isTyping}
          speed={typingSpeed}
          furigana={furiganaEnabled}
          onComplete={onTypingComplete}
        />
      </div>
      {!display.isTyping && (
        <div class="click-indicator">▼</div>
      )}
    </div>
  )
}

function TypewriterRubyText({
  segments,
  totalUnits,
  isTyping,
  speed,
  furigana,
  onComplete,
}: {
  segments: ReturnType<typeof parseRubyText>
  totalUnits: number
  isTyping: boolean
  speed: number
  furigana: boolean
  onComplete: () => void
}) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!ref.current) return

    if (!isTyping) {
      ref.current.innerHTML = renderSegmentsToHtml(segments, totalUnits, furigana)
      return
    }

    ref.current.innerHTML = ''
    let i = 0
    const timer = setInterval(() => {
      if (!ref.current) return
      i++
      ref.current.innerHTML = renderSegmentsToHtml(segments, i, furigana)
      if (i >= totalUnits) {
        clearInterval(timer)
        onComplete()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [segments, totalUnits, isTyping, speed, furigana])

  return <p ref={ref} class="typewriter-text" />
}
