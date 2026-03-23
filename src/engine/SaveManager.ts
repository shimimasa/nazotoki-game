/**
 * SaveManager - localStorageでプレイ進行を保存・復元
 *
 * 保存タイミング: 各ステップ進行時（自動）
 * 復元タイミング: タイトル画面で「つづきから」選択時
 * 削除タイミング: 結果画面到達時、または新規スタート時
 */

import type { GameState } from './types'

const SAVE_PREFIX = 'nazotoki-save-'

interface SaveData {
  state: GameState
  timestamp: number
}

/**
 * プレイ進行を保存
 */
export function saveProgress(scriptId: string, state: GameState): void {
  try {
    const data: SaveData = {
      state,
      timestamp: Date.now(),
    }
    localStorage.setItem(SAVE_PREFIX + scriptId, JSON.stringify(data))
  } catch {
    // localStorage容量超過等は無視
  }
}

/**
 * 保存されたプレイ進行を読み込み
 * 破損データや古すぎるデータ（7日以上）はnullを返す
 */
export function loadProgress(scriptId: string): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + scriptId)
    if (!raw) return null

    const data: SaveData = JSON.parse(raw)

    // 7日以上前のセーブは期限切れ
    if (Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000) {
      clearProgress(scriptId)
      return null
    }

    // playing状態のセーブのみ有効
    if (data.state.phase !== 'playing') {
      clearProgress(scriptId)
      return null
    }

    return data.state
  } catch {
    clearProgress(scriptId)
    return null
  }
}

/**
 * セーブデータを削除
 */
export function clearProgress(scriptId: string): void {
  try {
    localStorage.removeItem(SAVE_PREFIX + scriptId)
  } catch {
    // 無視
  }
}
