/**
 * GameScreen - ゲームのメイン画面
 *
 * 全コンポーネントを統合し、SceneManagerの状態に基づいて描画する。
 * クリックイベントをSceneManagerに伝播する。
 */

import { useCallback, useEffect, useRef } from 'preact/hooks'
import type { ScriptData, GameState, GameEvent } from '../engine/types'
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
      // キューをクリア
      onEvent({ type: 'sounds_played' })
    }
  }, [state.pendingSounds])

  const handleClick = useCallback(() => {
    onEvent({ type: 'click' })
  }, [onEvent])

  const handleTypingComplete = useCallback(() => {
    // タイプライター完了時は状態を「クリック待ち」にする
    // （SceneManager側で textDisplay.isTyping = false にする）
  }, [])

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

  return (
    <div class="game-screen" onClick={handleClick}>
      {/* 背景 */}
      <Background image={state.currentBg} />

      {/* 背景ダークオーバーレイ（キャラがいる時に背景を暗くして人物を際立たせる） */}
      {state.visibleSprites.length > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 2,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}

      {/* 立ち絵 */}
      <SpriteLayer
        sprites={state.visibleSprites}
        characters={script.characters}
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

      {/* テキストウィンドウ（選択肢・タイトルカード表示中は非表示） */}
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
