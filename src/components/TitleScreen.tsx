/**
 * TitleScreen - ゲーム開始前のタイトル画面
 */

import type { ScriptMeta } from '../engine/types'

interface Props {
  meta: ScriptMeta
  onStart: () => void
}

export function TitleScreen({ meta, onStart }: Props) {
  return (
    <div class="title-screen" onClick={onStart}>
      <div class="title-screen-content">
        <div class="title-series">{meta.series}</div>
        <div class="title-volume">Vol.{meta.volume}</div>
        <h1 class="title-name">{meta.title}</h1>
        <div class="title-start">— クリックでスタート —</div>
        <div class="title-time">プレイ時間: 約{meta.estimatedMinutes}分</div>
      </div>
    </div>
  )
}
