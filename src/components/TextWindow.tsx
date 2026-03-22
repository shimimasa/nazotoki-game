/**
 * TextWindow - テキストウィンドウ + ネームプレート
 *
 * タイプライター効果でテキストを表示し、
 * キャラ名がある場合はネームプレートを上部に表示する。
 */

import { useEffect, useRef } from 'preact/hooks'
import type { TextDisplayState } from '../engine/types'

interface Props {
  display: TextDisplayState
  onTypingComplete: () => void
  typingSpeed?: number // ms per char
}

export function TextWindow({ display, onTypingComplete, typingSpeed = 30 }: Props) {
  const timerRef = useRef<number | null>(null)
  const charsRef = useRef(0)

  // タイプライター効果
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (!display.isTyping || !display.text) return

    charsRef.current = 0

    timerRef.current = window.setInterval(() => {
      charsRef.current++
      if (charsRef.current >= display.text.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        onTypingComplete()
      }
    }, typingSpeed)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [display.text, display.isTyping])

  if (!display.text) return null

  const visibleText = display.isTyping
    ? display.text
    : display.text

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
        <TypewriterText
          text={visibleText}
          isTyping={display.isTyping}
          speed={typingSpeed}
        />
      </div>
      {!display.isTyping && (
        <div class="click-indicator">▼</div>
      )}
    </div>
  )
}

/** 実際にタイプライター表示を行う内部コンポーネント */
function TypewriterText({
  text,
  isTyping,
  speed,
}: {
  text: string
  isTyping: boolean
  speed: number
}) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (!isTyping) {
      ref.current.textContent = text
      return
    }

    ref.current.textContent = ''
    let i = 0
    const timer = setInterval(() => {
      if (!ref.current) return
      i++
      ref.current.textContent = text.slice(0, i)
      if (i >= text.length) clearInterval(timer)
    }, speed)

    return () => clearInterval(timer)
  }, [text, isTyping, speed])

  return <p ref={ref} class="typewriter-text" />
}
