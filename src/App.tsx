/**
 * App - ルートコンポーネント
 *
 * スクリプト読み込み → タイトル → ゲーム → 結果 の流れを管理
 */

import { useState, useEffect, useCallback } from 'preact/hooks'
import type { ScriptData, GameState, GameEvent } from './engine/types'
import {
  createInitialState,
  processEvent,
  advanceStep,
  executeStep,
} from './engine/SceneManager'
import { loadScript } from './engine/ScriptLoader'
import { TitleScreen } from './components/TitleScreen'
import { GameScreen } from './components/GameScreen'
import { ResultScreen } from './components/ResultScreen'

export function App() {
  const [script, setScript] = useState<ScriptData | null>(null)
  const [state, setState] = useState<GameState>(createInitialState())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // スクリプト読み込み
  useEffect(() => {
    loadScript('/scripts/moral-01.yaml')
      .then((data) => {
        setScript(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // イベント処理
  const handleEvent = useCallback(
    (event: GameEvent) => {
      if (!script) return

      setState((prev) => {
        let next = processEvent(script, prev, event)

        // choice_selected の後は次のステップに進む
        if (event.type === 'choice_selected') {
          next = advanceStep(script, next)
        }

        // effect_done の後は次のステップに進む
        if (event.type === 'effect_done') {
          next = advanceStep(script, next)
        }

        // title_card_done の後は次のステップに進む
        if (event.type === 'title_card_done') {
          next = advanceStep(script, next)
        }

        // start_game の後は最初のステップを実行
        if (event.type === 'start_game') {
          next = executeStep(script, next)
        }

        return next
      })
    },
    [script]
  )

  // ゲーム開始
  const handleStart = useCallback(() => {
    handleEvent({ type: 'start_game' })
  }, [handleEvent])

  // リスタート
  const handleRestart = useCallback(() => {
    setState(createInitialState())
  }, [])

  if (loading) {
    return (
      <div class="loading-screen">
        <div class="loading-text">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div class="error-screen">
        <div class="error-text">エラー: {error}</div>
      </div>
    )
  }

  if (!script) return null

  switch (state.phase) {
    case 'title':
      return <TitleScreen meta={script.meta} onStart={handleStart} />

    case 'playing':
      return (
        <GameScreen
          script={script}
          state={state}
          onEvent={handleEvent}
        />
      )

    case 'result':
      return (
        <ResultScreen
          script={script}
          choices={state.choices}
          onRestart={handleRestart}
        />
      )
  }
}
