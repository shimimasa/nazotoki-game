/**
 * App - ルートコンポーネント
 *
 * シナリオ選択 → タイトル → ゲーム → 結果 の流れを管理
 */

import { useState, useCallback } from 'preact/hooks'
import type { ScriptData, GameState, GameEvent } from './engine/types'
import {
  createInitialState,
  processEvent,
  advanceStep,
  executeStep,
} from './engine/SceneManager'
import { loadScript } from './engine/ScriptLoader'
import { ScenarioSelect } from './components/ScenarioSelect'
import { TitleScreen } from './components/TitleScreen'
import { GameScreen } from './components/GameScreen'
import { ResultScreen } from './components/ResultScreen'

export function App() {
  const [script, setScript] = useState<ScriptData | null>(null)
  const [state, setState] = useState<GameState>(createInitialState())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // シナリオ選択
  const handleSelectScenario = useCallback((scriptId: string) => {
    setLoading(true)
    setError(null)
    loadScript(`/scripts/${scriptId}.yaml`)
      .then((data) => {
        setScript(data)
        setState({ ...createInitialState(), phase: 'title' })
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

        // choice_selected の後: フィードバックがなければ次へ進む
        if (event.type === 'choice_selected' && !next.showingFeedback) {
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

  // 同じシナリオをリスタート
  const handleRestart = useCallback(() => {
    setState({ ...createInitialState(), phase: 'title' })
  }, [])

  // シナリオ選択に戻る
  const handleBackToSelect = useCallback(() => {
    setScript(null)
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
        <button class="error-back" onClick={handleBackToSelect}>
          シナリオ選択に戻る
        </button>
      </div>
    )
  }

  switch (state.phase) {
    case 'select':
      return <ScenarioSelect onSelect={handleSelectScenario} />

    case 'title':
      if (!script) return null
      return <TitleScreen meta={script.meta} onStart={handleStart} />

    case 'playing':
      if (!script) return null
      return (
        <GameScreen
          script={script}
          state={state}
          onEvent={handleEvent}
        />
      )

    case 'result':
      if (!script) return null
      return (
        <ResultScreen
          script={script}
          choices={state.choices}
          onRestart={handleRestart}
          onBackToSelect={handleBackToSelect}
        />
      )
  }
}
