/**
 * ScenarioSelect - シナリオ選択画面
 * catalog.json からシナリオ一覧を読み込み、グリッド表示する
 */

import { useState, useEffect } from 'preact/hooks'

export interface CatalogEntry {
  id: string
  title: string
  series: string
  volume: number
  subject: string
  estimatedMinutes: number
}

interface Props {
  onSelect: (scriptId: string) => void
}

export function ScenarioSelect({ onSelect }: Props) {
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/scripts/catalog.json')
      .then((r) => r.json())
      .then((data: CatalogEntry[]) => {
        setCatalog(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div class="select-screen">
        <div class="select-loading">読み込み中...</div>
      </div>
    )
  }

  return (
    <div class="select-screen">
      <div class="select-header">
        <h1 class="select-title">ナゾトキ探偵団</h1>
        <p class="select-subtitle">シナリオを選んでください</p>
      </div>
      <div class="select-grid">
        {catalog.map((entry) => (
          <button
            key={entry.id}
            class="select-card"
            onClick={() => onSelect(entry.id)}
          >
            <div class="select-card-subject">{entry.subject}</div>
            <div class="select-card-series">{entry.series}</div>
            <div class="select-card-title">{entry.title}</div>
            <div class="select-card-meta">
              Vol.{entry.volume} / 約{entry.estimatedMinutes}分
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
