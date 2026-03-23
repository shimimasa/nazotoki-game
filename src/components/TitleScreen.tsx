/**
 * TitleScreen - ゲーム開始前のタイトル画面
 * セーブデータがある場合は「つづきから」ボタンを表示
 */

import type { ScriptMeta } from '../engine/types'

interface Props {
  meta: ScriptMeta
  onStart: () => void
  hasSavedProgress?: boolean
  onContinue?: () => void
}

export function TitleScreen({ meta, onStart, hasSavedProgress, onContinue }: Props) {
  return (
    <div class="title-screen">
      <div class="title-screen-content">
        <div class="title-series">{meta.series}</div>
        <div class="title-volume">Vol.{meta.volume}</div>
        <h1 class="title-name">{meta.title}</h1>

        <div class="title-buttons">
          {hasSavedProgress && onContinue && (
            <button
              class="title-btn title-btn-continue"
              onClick={(e) => { e.stopPropagation(); onContinue() }}
            >
              つづきから
            </button>
          )}
          <button
            class="title-btn title-btn-start"
            onClick={(e) => { e.stopPropagation(); onStart() }}
          >
            {hasSavedProgress ? 'はじめから' : 'スタート'}
          </button>
        </div>

        <div class="title-time">プレイ時間: 約{meta.estimatedMinutes}分</div>
      </div>
    </div>
  )
}
