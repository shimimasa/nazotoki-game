/**
 * GameScreen - ゲームのメイン画面
 *
 * VN標準レイアウト:
 * - 背景 (z:0) → ダークオーバーレイ (z:2) → 立ち絵 (z:5) → テキストウィンドウ (z:20)
 * - テキストウィンドウがキャラの下半身を覆う（VN定番）
 * - 発言中キャラは明るく、非発言キャラは暗く
 */

import { useCallback, useEffect, useRef, useMemo } from 'preact/hooks'
import type { ScriptData, GameState, GameEvent } from '../engine/types'
import { getCurrentStep } from '../engine/SceneManager'
import { audioManager } from '../engine/AudioManager'
import { Background } from './Background'
import { SpriteLayer } from './SpriteLayer'
import { TextWindow } from './TextWindow'
import { ChoicePanel } from './ChoicePanel'
import { EffectLayer } from './EffectLayer'
import { TitleCard } from './TitleCard'

interface Props {
  script: ScriptData
  state: GameState
  onEvent: (event: GameEvent) => void
}

export function GameScreen({ script, state, onEvent }: Props) {
  const prevBgmRef = useRef<string | null>(null)

  // 現在発言中のキャラクターを特定
  const speakingCharacter = useMemo(() => {
    if (state.textDisplay.characterName) {
      // characterNameからcharacter IDを逆引き
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

  // SE再生（pendingSoundsキューを消化）
  useEffect(() => {
    if (state.pendingSounds.length > 0) {
      for (const sound of state.pendingSounds) {
        audioManager.playSe(sound)
      }
      onEvent({ type: 'sounds_played' })
    }
  }, [state.pendingSounds])

  const handleClick = useCallback(() => {
    onEvent({ type: 'click' })
  }, [onEvent])

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
      {/* 背景 */}
      <Background image={state.currentBg} />

      {/* 背景ダークオーバーレイ（キャラがいる時に背景を暗くする） */}
      <div
        class="bg-overlay"
        style={{
          opacity: hasSprites ? 1 : 0,
        }}
      />

      {/* 立ち絵（テキストウィンドウの下に入る。z-index:5） */}
      <SpriteLayer
        sprites={state.visibleSprites}
        characters={script.characters}
        speakingCharacter={speakingCharacter}
      />

      {/* エフェクト */}
      <EffectLayer
        effect={state.activeEffect}
        onEffectDone={handleEffectDone}
      />

      {/* タイトルカード */}
      {state.activeTitleCard && (
        <TitleCard
          text={state.activeTitleCard.text}
          subtitle={state.activeTitleCard.subtitle}
          onClick={handleTitleCardDone}
        />
      )}

      {/* 選択肢 */}
      {state.activeChoice && (
        <ChoicePanel
          choice={state.activeChoice}
          onSelect={handleChoiceSelect}
        />
      )}

      {/* テキストウィンドウ（z-index:20 でキャラの上に乗る） */}
      {!state.activeChoice && !state.activeTitleCard && state.textDisplay.text && (
        <TextWindow
          display={state.textDisplay}
          onTypingComplete={handleTypingComplete}
        />
      )}

      {/* ミュートボタン */}
      <button
        class="mute-button"
        onClick={(e) => {
          e.stopPropagation()
          audioManager.toggleMute()
        }}
      >
        {audioManager.isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}
