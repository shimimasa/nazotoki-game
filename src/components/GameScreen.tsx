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
  const autoTimerRef = useRef<number | null>(null)

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
    if (showBacklog) return // バックログ表示中はクリック無視
    onEvent({ type: 'click' })
  }, [onEvent, showBacklog])

  const handleTypingComplete = useCallback(() => {}, [])

  const handleChoiceSelect = useCallback(
    (choiceId: string, value: string) => {
      audioManager.playSe('click')
      onEvent({ type: 'choice_selected', choiceId, value })
    },
    [onEvent]
  )

  const handleEffectDone = useCallback(() => {
    onEvent({ type: 'effect_done' })
  }, [onEvent])

  const handleTitleCardDone = useCallback(() => {
    onEvent({ type: 'title_card_done' })
  }, [onEvent])

  const hasSprites = state.visibleSprites.length > 0

  return (
    <div class="game-screen" onClick={handleClick}>
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
        <TextWindow
          display={state.textDisplay}
          onTypingComplete={handleTypingComplete}
        />
      )}

      {/* コントロールパネル */}
      <div class="game-controls">
        <button
          class="game-ctrl-btn"
          title="テキスト履歴"
          onClick={(e) => {
            e.stopPropagation()
            setShowBacklog(true)
          }}
        >
          LOG
        </button>
        <button
          class={`game-ctrl-btn ${autoMode ? 'active' : ''}`}
          title="オートモード"
          onClick={(e) => {
            e.stopPropagation()
            setAutoMode(!autoMode)
          }}
        >
          AUTO
        </button>
        <button
          class="game-ctrl-btn"
          title="ミュート"
          onClick={(e) => {
            e.stopPropagation()
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
    </div>
  )
}
