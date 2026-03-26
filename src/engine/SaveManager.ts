/**
 * SaveManager - localStorageでプレイ進行を保存・復元
 *
 * 保存タイミング: 各ステップ進行時（自動）
 * 復元タイミング: タイトル画面で「つづきから」選択時
 * 削除タイミング: 結果画面到達時、または新規スタート時
 *
 * クリア履歴: シナリオ完了時にランク付きで記録（永続）
 */

import type { GameState } from './types'

const SAVE_PREFIX = 'nazotoki-save-'
const CLEAR_PREFIX = 'nazotoki-clear-'

export type DetectiveRank = 'S' | 'A' | 'B' | 'C'

export interface ClearRecord {
  rank: DetectiveRank
  answeredCount: number
  totalChoices: number
  correctCount: number // 正解数
  totalJudged: number // 正解判定がある問題の総数
  clearedAt: number // timestamp
}

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

// --- クリア履歴 ---

/**
 * 探偵ランクを算出
 * 正解判定がある問題: 正解率ベース（S≥100%, A≥75%, B≥50%, C<50%）
 * 正解判定がない問題のみ: 回答率ベース（互換）
 */
export function calculateRank(
  correctCount: number,
  totalJudged: number,
  answeredCount?: number,
  totalChoices?: number,
): DetectiveRank {
  // 正解判定がある問題がある場合 → 正解率で判定
  if (totalJudged > 0) {
    const rate = correctCount / totalJudged
    if (rate >= 1) return 'S'
    if (rate >= 0.75) return 'A'
    if (rate >= 0.5) return 'B'
    return 'C'
  }
  // 正解判定がない問題のみ → 回答率で互換判定
  const total = totalChoices ?? 0
  if (total === 0) return 'S'
  const rate = (answeredCount ?? 0) / total
  if (rate >= 1) return 'S'
  if (rate >= 0.75) return 'A'
  if (rate >= 0.5) return 'B'
  return 'C'
}

/**
 * ランクに対応する称号テキスト
 */
export function getRankLabel(rank: DetectiveRank): string {
  switch (rank) {
    case 'S': return '名探偵'
    case 'A': return '熟練探偵'
    case 'B': return '見習い探偵'
    case 'C': return '探偵助手'
  }
}

/**
 * クリア記録を保存（ベストランクを維持）
 */
export function saveClearRecord(scriptId: string, record: ClearRecord): void {
  try {
    const existing = getClearRecord(scriptId)
    // 既存記録がある場合、ランクが上がった時のみ更新
    if (existing) {
      const rankOrder: DetectiveRank[] = ['S', 'A', 'B', 'C']
      if (rankOrder.indexOf(record.rank) >= rankOrder.indexOf(existing.rank)) {
        return // 既存ランクの方が高い or 同じ → 更新しない
      }
    }
    localStorage.setItem(CLEAR_PREFIX + scriptId, JSON.stringify(record))
  } catch {
    // 無視
  }
}

/**
 * 特定シナリオのクリア記録を取得
 */
export function getClearRecord(scriptId: string): ClearRecord | null {
  try {
    const raw = localStorage.getItem(CLEAR_PREFIX + scriptId)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * 全クリア記録を取得（シナリオ選択画面用）
 */
export function getAllClearRecords(): Record<string, ClearRecord> {
  const records: Record<string, ClearRecord> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CLEAR_PREFIX)) {
        const scriptId = key.slice(CLEAR_PREFIX.length)
        const raw = localStorage.getItem(key)
        if (raw) {
          records[scriptId] = JSON.parse(raw)
        }
      }
    }
  } catch {
    // 無視
  }
  return records
}
