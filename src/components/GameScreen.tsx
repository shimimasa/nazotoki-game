/**
 * GameScreen - ゲームのメイン画面
 *
 * VN標準レイアウト:
 * - 背景 (z:0) → ダークオーバーレイ (z:2) → 立ち絵 (z:5) → テキストウィンドウ (z:20)
 * - バックログ・オートモード・ミュートのコントロールパネル
 */

import { useCallback, useEffect, useRef, useMemo, useState } from 'preact/hooks'
import type { ScriptData, GameState, GameEvent } from '../engine/types'
import { getCurrentStep } from '../engine/SceneManager'
import { audioManager } from '../engine/AudioManager'
import { Background } from './Background'
import { SpriteLayer } from './SpriteLayer'
import { TextWindow } from './TextWindow'
import { ChoicePanel } from './ChoicePanel'
import { EffectLayer } from './EffectLayer'
import { TitleCard } from './TitleCard'
import { BacklogPanel } from './BacklogPanel'

interface Props {
  script: ScriptData
  state: GameState
  onEvent: (event: GameEvent) => void
}

export function GameScreen({ script, state, onEvent }: Props) {
  const prevBgmRef = useRef<string | null>(null)
  const [showBacklog, setShowBacklog] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const [furigana, setFurigana] = useState(() => {
    try { return localStorage.getItem('nazotoki-furigana') === 'on' } catch { return false }
  })
  const autoTimerRef = useRef<number | null>(null)
  const [controlsActive, setControlsActive] = useState(false)
  const controlsTimerRef = useRef<number | null>(null)
  const [showGuide, setShowGuide] = useState(() => {
    try { return !localStorage.getItem('nazotoki-played') } catch { return true }
  })

  // コントロールパネル: 操作後3秒で半透明化
  const flashControls = useCallback(() => {
    setControlsActive(true)
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    controlsTimerRef.current = window.setTimeout(() => setControlsActive(false), 3000)
  }, [])

  const toggleFurigana = useCallback(() => {
    setFurigana((prev) => {
      const next = !prev
      try { localStorage.setItem('nazotoki-furigana', next ? 'on' : 'off') } catch {}
      return next
    })
  }, [])

  // 現在発言中のキャラクターを特定
  const speakingCharacter = useMemo(() => {
    if (state.textDisplay.characterName) {
      for (const [id, def] of Object.entries(script.characters)) {
        if (def.name === state.textDisplay.characterName) return id
      }
    }
    return null
  }, [state.textDisplay.characterName, script.characters])

  // BGM変更の監視
  useEffect(() => {
    if (state.currentBgm !== prevBgmRef.current) {
      if (state.currentBgm) {
        audioManager.playBgm(state.currentBgm)
      } else {
        audioManager.fadeOutBgm()
      }
      prevBgmRef.current = state.currentBgm
    }
  }, [state.currentBgm])

  // SE再生
  useEffect(() => {
    if (state.pendingSounds.length > 0) {
      for (const sound of state.pendingSounds) {
        audioManager.playSe(sound)
      }
      onEvent({ type: 'sounds_played' })
    }
  }, [state.pendingSounds])

  // オートモード: タイピング完了後に自動進行
  useEffect(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }

    if (
      autoMode &&
      !state.textDisplay.isTyping &&
      state.textDisplay.text &&
      !state.activeChoice &&
      !state.activeEffect &&
      !state.activeTitleCard &&
      !state.showingFeedback
    ) {
      // テキスト長に応じた待機時間（最低1.5秒、文字数×50ms）
      const delay = Math.max(1500, state.textDisplay.text.length * 50)
      autoTimerRef.current = window.setTimeout(() => {
        onEvent({ type: 'click' })
      }, delay)
    }

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
  }, [autoMode, state.textDisplay.isTyping, state.textDisplay.text, state.activeChoice, state.activeEffect, state.activeTitleCard, state.showingFeedback])

  // 選択肢表示時はオートモードを一時停止
  useEffect(() => {
    if (state.activeChoice && autoMode) {
      // 選択肢が出たらオートは止めない（選択後に再開される）
    }
  }, [state.activeChoice])

  const handleClick = useCallback(() => {
    if (showGuide) {
      setShowGuide(false)
      try { localStorage.setItem('nazotoki-played', '1') } catch {}
      return
    }
    if (showBacklog) return
    if (state.textDisplay.text && !state.activeChoice && !state.activeTitleCard) {
      audioManager.playSe('click')
    }
    onEvent({ type: 'click' })
  }, [onEvent, showBacklog, showGuide, state.textDisplay.text, state.activeChoice, state.activeTitleCard])

  const handleTypingComplete = useCallback(() => {}, [])

  const handleChoiceSelect = useCallback(
    (choiceId: string, value: string) => {
      audioManager.playSe('decision')
      onEvent({ type: 'choice_selected', choiceId, value })
    },
    [onEvent]
  )

  // キーボード操作（handleChoiceSelectの後に定義）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showBacklog) {
        if (e.key === 'Escape') setShowBacklog(false)
        return
      }
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          onEvent({ type: 'click' })
          break
        case 'Escape':
          setShowBacklog((prev) => !prev)
          break
        case 'a': case 'A': case '1':
          if (state.activeChoice?.options[0])
            handleChoiceSelect(state.activeChoice.id, state.activeChoice.options[0].value)
          break
        case 'b': case 'B': case '2':
          if (state.activeChoice?.options[1])
            handleChoiceSelect(state.activeChoice.id, state.activeChoice.options[1].value)
          break
        case 'c': case 'C': case '3':
          if (state.activeChoice?.options[2])
            handleChoiceSelect(state.activeChoice.id, state.activeChoice.options[2].value)
          break
        case 'd': case 'D': case '4':
          if (state.activeChoice?.options[3])
            handleChoiceSelect(state.activeChoice.id, state.activeChoice.options[3].value)
          break
        case 'e': case 'E': case '5':
          if (state.activeChoice?.options[4])
            handleChoiceSelect(state.activeChoice.id, state.activeChoice.options[4].value)
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showBacklog, state.activeChoice, onEvent, handleChoiceSelect])

  const handleEffectDone = useCallback(() => {
    onEvent({ type: 'effect_done' })
  }, [onEvent])

  const handleTitleCardDone = useCallback(() => {
    onEvent({ type: 'title_card_done' })
  }, [onEvent])

  const hasSprites = state.visibleSprites.length > 0

  const progressPercent = script.scenes.length > 0
    ? ((state.currentSceneIndex + 1) / script.scenes.length) * 100
    : 0

  return (
    <div class="game-screen" onClick={handleClick}>
      {/* プログレスバー */}
      <div class="progress-bar" style={{ width: `${progressPercent}%` }} />

      <Background image={state.currentBg} />

      <div
        class="bg-overlay"
        style={{ opacity: hasSprites ? 1 : 0 }}
      />

      <SpriteLayer
        sprites={state.visibleSprites}
        characters={script.characters}
        speakingCharacter={speakingCharacter}
      />

      <EffectLayer
        effect={state.activeEffect}
        onEffectDone={handleEffectDone}
      />

      {state.activeTitleCard && (
        <TitleCard
          text={state.activeTitleCard.text}
          subtitle={state.activeTitleCard.subtitle}
          onClick={handleTitleCardDone}
        />
      )}

      {state.activeChoice && (
        <ChoicePanel
          choice={state.activeChoice}
          onSelect={handleChoiceSelect}
        />
      )}

      {!state.activeChoice && !state.activeTitleCard && state.textDisplay.text && (
        <div class={
          state.showingFeedback && state.feedbackIsCorrect === true ? 'feedback-correct' :
          state.showingFeedback && state.feedbackIsCorrect === false ? 'feedback-incorrect' : ''
        }>
          <TextWindow
            display={state.textDisplay}
            onTypingComplete={handleTypingComplete}
            typingSpeed={
              state.textDisplay.speed === 'slow' ? 50
              : state.textDisplay.speed === 'fast' ? 15
              : 30
            }
            furiganaEnabled={furigana}
          />
        </div>
      )}

      {/* コントロールパネル */}
      <div
        class={`game-controls ${controlsActive ? 'active' : ''}`}
        onMouseEnter={flashControls}
        onTouchStart={flashControls}
      >
        <button
          class="game-ctrl-btn"
          title="前の文をふりかえる"
          onClick={(e) => {
            e.stopPropagation()
            flashControls()
            setShowBacklog(true)
          }}
        >
          LOG
        </button>
        <button
          class={`game-ctrl-btn ${furigana ? 'active' : ''}`}
          title="ふりがなの表示/非表示"
          onClick={(e) => {
            e.stopPropagation()
            flashControls()
            toggleFurigana()
          }}
        >
          かな
        </button>
        <button
          class={`game-ctrl-btn ${autoMode ? 'active' : ''}`}
          title="自動で読みすすめる"
          onClick={(e) => {
            e.stopPropagation()
            flashControls()
            setAutoMode(!autoMode)
          }}
        >
          AUTO
        </button>
        <button
          class="game-ctrl-btn"
          title="音のON/OFF"
          onClick={(e) => {
            e.stopPropagation()
            flashControls()
            audioManager.toggleMute()
          }}
        >
          {audioManager.isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* バックログパネル */}
      {showBacklog && (
        <BacklogPanel
          entries={state.backlog}
          onClose={() => setShowBacklog(false)}
        />
      )}

      {/* 初回プレイガイド */}
      {showGuide && state.textDisplay.text && (
        <div class="play-guide-overlay">
          <div class="play-guide-text">
            画面をタップして<br />読みすすめよう
          </div>
        </div>
      )}
    </div>
  )
}
