/**
 * ResultScreen - ゲーム終了後の結果画面
 * 探偵ランク表示 + 全選択肢レビュー + クリア記録保存
 */

import { useState, useCallback, useEffect } from 'preact/hooks'
import type { ScriptData, ChoiceStep } from '../engine/types'
import { stripRuby } from '../engine/RubyParser'
import { audioManager } from '../engine/AudioManager'
import {
  calculateRank,
  getRankLabel,
  saveClearRecord,
  type DetectiveRank,
} from '../engine/SaveManager'

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

const RANK_COLORS: Record<DetectiveRank, string> = {
  S: '#ffd700',
  A: '#c0c0c0',
  B: '#cd7f32',
  C: '#8899aa',
}

export function ResultScreen({ script, choices, onRestart, onBackToSelect }: Props) {
  const allChoices = getAllChoices(script)
  const answeredCount = Object.keys(choices).length
  const [copied, setCopied] = useState(false)
  const [showRankAnim, setShowRankAnim] = useState(false)

  const rank = calculateRank(answeredCount, allChoices.length)
  const rankLabel = getRankLabel(rank)

  // クリア記録を保存 + ランク演出 + BGM再生
  useEffect(() => {
    saveClearRecord(script.meta.id, {
      rank,
      answeredCount,
      totalChoices: allChoices.length,
      clearedAt: Date.now(),
    })
    // 結果画面BGM
    audioManager.playBgm('hope')
    // ランク表示のアニメーション遅延
    const timer = setTimeout(() => setShowRankAnim(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleCopy = useCallback(() => {
    const lines: string[] = [
      `${script.meta.series} Vol.${script.meta.volume}「${script.meta.title}」`,
      `探偵ランク: ${rank}（${rankLabel}）`,
      `回答数: ${answeredCount}/${allChoices.length}`,
      '',
    ]
    allChoices.forEach((choice, i) => {
      const val = choices[choice.id]
      const opt = choice.options.find((o) => o.value === val)
      lines.push(`Q${i + 1}. ${stripRuby(choice.question || '')}`)
      lines.push(`→ ${opt ? stripRuby(opt.text) : '未回答'}`)
      lines.push('')
    })
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [script, choices, allChoices, answeredCount, rank, rankLabel])

  return (
    <div class="result-screen">
      <div class="result-content">
        {/* 探偵ランク */}
        <div class={`result-rank-section ${showRankAnim ? 'visible' : ''}`}>
          <div class="result-rank-label">探偵ランク</div>
          <div
            class="result-rank-badge"
            style={{ color: RANK_COLORS[rank], borderColor: RANK_COLORS[rank] }}
          >
            {rank}
          </div>
          <div class="result-rank-title" style={{ color: RANK_COLORS[rank] }}>
            {rankLabel}
          </div>
        </div>

        <div class="result-series">
          {script.meta.series} Vol.{script.meta.volume}
        </div>
        <div class="result-scenario-title">
          「{script.meta.title}」
        </div>

        <div class="result-stats">
          <span class="result-stat">回答 {answeredCount}/{allChoices.length}</span>
          <span class="result-stat">約{script.meta.estimatedMinutes}分</span>
        </div>

        <div class="result-choices">
          {allChoices.map((choice, i) => {
            const selectedValue = choices[choice.id]
            const selectedOption = choice.options.find(o => o.value === selectedValue)
            const feedback = selectedOption?.feedback || choice.feedback_default

            return (
              <div key={choice.id} class="result-choice-item">
                <div class="result-question">
                  Q{i + 1}. {stripRuby(choice.question || '')}
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
                        <span class="result-option-text">{stripRuby(opt.text)}</span>
                      </div>
                    )
                  })}
                </div>
                {feedback && (
                  <div class="result-feedback">
                    {stripRuby(feedback)}
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
          <button class="result-copy" onClick={handleCopy}>
            {copied ? 'コピーしました！' : 'けっかをコピー'}
          </button>
          <button class="result-restart" onClick={onRestart}>
            もういちど最初から
          </button>
          <button class="result-back" onClick={onBackToSelect}>
            べつのシナリオをえらぶ
          </button>
        </div>
      </div>
    </div>
  )
}
