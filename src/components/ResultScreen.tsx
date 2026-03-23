/**
 * ResultScreen - ゲーム終了後の結果画面
 * 全選択肢を表示し、プレイヤーの選択をハイライトする
 */

import type { ScriptData, ChoiceStep } from '../engine/types'

interface Props {
  script: ScriptData
  choices: Record<string, string>
  onRestart: () => void
  onBackToSelect: () => void
}

// 全choiceステップを抽出
function getAllChoices(script: ScriptData): ChoiceStep[] {
  const result: ChoiceStep[] = []
  for (const scene of script.scenes) {
    for (const step of scene.steps) {
      if (step.type === 'choice') {
        result.push(step)
      }
    }
  }
  return result
}

export function ResultScreen({ script, choices, onRestart, onBackToSelect }: Props) {
  const allChoices = getAllChoices(script)
  const answeredCount = Object.keys(choices).length

  return (
    <div class="result-screen">
      <div class="result-content">
        <h2 class="result-title">あなたの推理</h2>
        <div class="result-series">
          {script.meta.series} Vol.{script.meta.volume}
        </div>
        <div class="result-scenario-title">
          「{script.meta.title}」
        </div>

        <div class="result-stats">
          <span class="result-stat">回答数 {answeredCount}/{allChoices.length}</span>
          <span class="result-stat">推定プレイ {script.meta.estimatedMinutes}分</span>
        </div>

        <div class="result-choices">
          {allChoices.map((choice, i) => {
            const selectedValue = choices[choice.id]
            const selectedOption = choice.options.find(o => o.value === selectedValue)
            const feedback = selectedOption?.feedback || choice.feedback_default

            return (
              <div key={choice.id} class="result-choice-item">
                <div class="result-question">
                  Q{i + 1}. {choice.question}
                </div>
                <div class="result-options">
                  {choice.options.map((opt) => {
                    const isSelected = opt.value === selectedValue
                    return (
                      <div
                        key={opt.value}
                        class={`result-option ${isSelected ? 'selected' : 'dimmed'}`}
                      >
                        <span class="result-option-marker">
                          {isSelected ? '●' : '○'}
                        </span>
                        <span class="result-option-text">{opt.text}</span>
                      </div>
                    )
                  })}
                </div>
                {feedback && (
                  <div class="result-feedback">
                    {feedback}
                  </div>
                )}
                {!selectedValue && (
                  <div class="result-skipped">未回答</div>
                )}
              </div>
            )
          })}
        </div>

        <div class="result-message">
          大事なのは「なぜそう思ったか」を考えること。
        </div>

        <div class="result-buttons">
          <button class="result-restart" onClick={onRestart}>
            もう一度最初から
          </button>
          <button class="result-back" onClick={onBackToSelect}>
            別のシナリオを選ぶ
          </button>
        </div>
      </div>
    </div>
  )
}
