/**
 * App - ルートコンポーネント
 *
 * シナリオ選択 → タイトル → ゲーム → 結果 の流れを管理
 * URLパラメータ ?script=xxx でシナリオ直接指定可能
 * localStorageでプレイ進行を自動保存・再開
 */

import { useState, useEffect, useCallback, useRef } from 'preact/hooks'
import type { ScriptData, GameState, GameEvent } from './engine/types'
import {
  createInitialState,
  processEvent,
  advanceStep,
  executeStep,
} from './engine/SceneManager'
import { loadScript } from './engine/ScriptLoader'
import { saveProgress, loadProgress, clearProgress } from './engine/SaveManager'
import { ScenarioSelect } from './components/ScenarioSelect'
import { TitleScreen } from './components/TitleScreen'
import { GameScreen } from './components/GameScreen'
import { ResultScreen } from './components/ResultScreen'

function getScriptIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('script')
}

function updateUrl(scriptId: string | null) {
  const url = scriptId ? `?script=${scriptId}` : window.location.pathname
  history.replaceState(null, '', url)
}

export function App() {
  const [script, setScript] = useState<ScriptData | null>(null)
  const [scriptId, setScriptId] = useState<string | null>(null)
  const [state, setState] = useState<GameState>(createInitialState())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasSavedProgress, setHasSavedProgress] = useState(false)
  const stateHistoryRef = useRef<GameState[]>([])

  // 起動時: URLパラメータからシナリオを自動読み込み
  useEffect(() => {
    const urlScript = getScriptIdFromUrl()
    if (urlScript) {
      handleSelectScenario(urlScript)
    }
  }, [])

  // シナリオ選択
  const handleSelectScenario = useCallback((id: string) => {
    setLoading(true)
    setError(null)
    setScriptId(id)
    updateUrl(id)
    loadScript(`/scripts/${id}.yaml`)
      .then((data) => {
        setScript(data)
        const saved = loadProgress(id)
        setHasSavedProgress(!!saved)
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
      if (!script || !scriptId) return

      setState((prev) => {
        // クリックで進むとき、現在の表示状態を履歴にpush（最大50件）
        if (event.type === 'click' && prev.waitingForClick) {
          const history = stateHistoryRef.current
          history.push(prev)
          if (history.length > 50) history.shift()
        }

        let next = processEvent(script, prev, event)

        if (event.type === 'choice_selected' && !next.showingFeedback && !next.activeChoice) {
          next = advanceStep(script, next)
        }
        if (event.type === 'effect_done') {
          next = advanceStep(script, next)
        }
        if (event.type === 'title_card_done') {
          next = advanceStep(script, next)
        }
        if (event.type === 'start_game') {
          next = executeStep(script, next)
        }

        // プレイ中は進行を自動保存
        if (next.phase === 'playing') {
          saveProgress(scriptId, next)
        }
        // 結果画面に到達したらセーブをクリア
        if (next.phase === 'result') {
          clearProgress(scriptId)
        }

        return next
      })
    },
    [script, scriptId]
  )

  // 新規スタート
  const handleStart = useCallback(() => {
    if (scriptId) clearProgress(scriptId)
    setHasSavedProgress(false)
    handleEvent({ type: 'start_game' })
  }, [handleEvent, scriptId])

  // セーブデータから再開
  const handleContinue = useCallback(() => {
    if (!scriptId) return
    const saved = loadProgress(scriptId)
    if (saved) {
      setState(saved)
      setHasSavedProgress(false)
    }
  }, [scriptId])

  // リスタート
  const handleRestart = useCallback(() => {
    if (scriptId) clearProgress(scriptId)
    setHasSavedProgress(false)
    setState({ ...createInitialState(), phase: 'title' })
  }, [scriptId])

  // シナリオ選択に戻る
  const handleBackToSelect = useCallback(() => {
    setScript(null)
    setScriptId(null)
    updateUrl(null)
    setState(createInitialState())
    setHasSavedProgress(false)
  }, [])

  // 1ステップ戻る
  const handleGoBack = useCallback(() => {
    const history = stateHistoryRef.current
    if (history.length === 0) return
    const prev = history.pop()!
    setState(prev)
  }, [])

  const canGoBack = stateHistoryRef.current.length > 0

  // 次のシナリオへ（同シリーズの次Vol）
  const handleNextScenario = useCallback(() => {
    if (!scriptId) return
    const match = scriptId.match(/^(.+)-(\d+)$/)
    if (!match) return
    const slug = match[1]
    const nextVol = String(Number(match[2]) + 1).padStart(2, '0')
    const nextId = `${slug}-${nextVol}`
    handleSelectScenario(nextId)
  }, [scriptId, handleSelectScenario])

  if (loading) {
    return (
      <div class="loading-screen">
        <div class="loading-notebook" />
        <div class="loading-text">じけんファイルを読み込み中…</div>
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
      return (
        <TitleScreen
          meta={script.meta}
          onStart={handleStart}
          hasSavedProgress={hasSavedProgress}
          onContinue={handleContinue}
        />
      )

    case 'playing':
      if (!script) return null
      return (
        <GameScreen script={script} state={state} onEvent={handleEvent} onGoBack={handleGoBack} canGoBack={canGoBack} />
      )

    case 'result':
      if (!script) return null
      return (
        <ResultScreen
          script={script}
          choices={state.choices}
          correctCount={state.correctCount}
          totalJudged={state.totalJudged}
          onRestart={handleRestart}
          onBackToSelect={handleBackToSelect}
          onNextScenario={handleNextScenario}
        />
      )
  }
}
