/**
 * ResultScreen - ゲーム終了後の結果画面
 * プレイヤーが選んだ回答を一覧表示する
 */

import type { ScriptData } from '../engine/types'

interface Props {
  script: ScriptData
  choices: Record<string, string>
  onRestart: () => void
}

// 選択肢IDから質問文と選択テキストを逆引き
function getChoiceInfo(script: ScriptData, choiceId: string, value: string) {
  for (const scene of script.scenes) {
    for (const step of scene.steps) {
      if (step.type === 'choice' && step.id === choiceId) {
        const option = step.options.find(o => o.value === value)
        return {
          question: step.question ?? '',
          answer: option?.text ?? value,
        }
      }
    }
  }
  return { question: choiceId, answer: value }
}

export function ResultScreen({ script, choices, onRestart }: Props) {
  const entries = Object.entries(choices)

  return (
    <div class="result-screen">
      <div class="result-content">
        <h2 class="result-title">あなたの選択</h2>
        <div class="result-series">
          {script.meta.series} Vol.{script.meta.volume}「{script.meta.title}」
        </div>

        <div class="result-choices">
          {entries.map(([id, value], i) => {
            const info = getChoiceInfo(script, id, value)
            return (
              <div key={id} class="result-choice-item">
                <div class="result-question">
                  Q{i + 1}. {info.question}
                </div>
                <div class="result-answer">
                  → {info.answer}
                </div>
              </div>
            )
          })}
        </div>

        {entries.length === 0 && (
          <p class="result-no-choices">選択肢はありませんでした。</p>
        )}

        <div class="result-message">
          正解はありません。大事なのは「なぜそう思ったか」を考えること。
        </div>

        <button class="result-restart" onClick={onRestart}>
          もう一度最初から
        </button>
      </div>
    </div>
  )
}
