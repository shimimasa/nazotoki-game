/**
 * ScenarioSelect - シナリオ選択画面
 * シリーズごとにグルーピング + 教科フィルター + アコーディオン開閉
 */

import { useState, useEffect, useMemo, useCallback } from 'preact/hooks'

export interface CatalogEntry {
  id: string
  title: string
  series: string
  volume: number
  subject: string
  estimatedMinutes: number
}

interface SeriesGroup {
  series: string
  subject: string
  entries: CatalogEntry[]
}

interface Props {
  onSelect: (scriptId: string) => void
}

const SERIES_ORDER = [
  '答えのない法廷',
  'サイエンス捜査班',
  '数字の迷宮',
  '数学深化探偵団',
  'バグ探偵団',
  '情報モラル探偵団',
  'お金の探偵団',
  '英語探偵団',
  '保健探偵団',
  '防災探偵団',
  '公民探偵団',
  '家庭科探偵団',
  'ESD探偵団',
  'キャリア探偵団',
  '地図探偵団',
  'タイムトラベル探偵団',
]

export function ScenarioSelect({ onSelect }: Props) {
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [openSeries, setOpenSeries] = useState<Set<string>>(new Set())
  const [activeSubject, setActiveSubject] = useState<string | null>(null)

  useEffect(() => {
    fetch('/scripts/catalog.json')
      .then((r) => r.json())
      .then((data: CatalogEntry[]) => {
        setCatalog(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const subjects = useMemo(() => {
    const subjectSet = new Set<string>()
    catalog.forEach((e) => subjectSet.add(e.subject))
    return Array.from(subjectSet)
  }, [catalog])

  const groups = useMemo(() => {
    const map = new Map<string, SeriesGroup>()
    for (const entry of catalog) {
      if (!map.has(entry.series)) {
        map.set(entry.series, {
          series: entry.series,
          subject: entry.subject,
          entries: [],
        })
      }
      map.get(entry.series)!.entries.push(entry)
    }
    // Sort entries within each group by volume
    for (const group of map.values()) {
      group.entries.sort((a, b) => a.volume - b.volume)
    }
    // Sort groups by SERIES_ORDER
    const sorted = Array.from(map.values()).sort((a, b) => {
      const ai = SERIES_ORDER.indexOf(a.series)
      const bi = SERIES_ORDER.indexOf(b.series)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
    return sorted
  }, [catalog])

  const filteredGroups = useMemo(() => {
    if (!activeSubject) return groups
    return groups.filter((g) => g.subject === activeSubject)
  }, [groups, activeSubject])

  const toggleSeries = useCallback((series: string) => {
    setOpenSeries((prev) => {
      const next = new Set(prev)
      if (next.has(series)) {
        next.delete(series)
      } else {
        next.add(series)
      }
      return next
    })
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

      {/* 教科フィルター */}
      <div class="select-filters">
        <button
          class={`select-filter-btn ${activeSubject === null ? 'active' : ''}`}
          onClick={() => setActiveSubject(null)}
        >
          すべて
        </button>
        {subjects.map((subject) => (
          <button
            key={subject}
            class={`select-filter-btn ${activeSubject === subject ? 'active' : ''}`}
            onClick={() =>
              setActiveSubject(activeSubject === subject ? null : subject)
            }
          >
            {subject}
          </button>
        ))}
      </div>

      {/* シリーズ一覧 */}
      <div class="select-series-list">
        {filteredGroups.map((group) => {
          const isOpen = openSeries.has(group.series)
          return (
            <div key={group.series} class="select-series-group">
              <button
                class="select-series-header"
                onClick={() => toggleSeries(group.series)}
                aria-expanded={isOpen}
              >
                <span class="select-series-arrow">
                  {isOpen ? '▼' : '▶'}
                </span>
                <span class="select-series-subject-tag">
                  {group.subject}
                </span>
                <span class="select-series-name">{group.series}</span>
                <span class="select-series-count">
                  {group.entries.length}本
                </span>
              </button>

              {isOpen && (
                <div class="select-series-body">
                  {group.entries.map((entry) => (
                    <button
                      key={entry.id}
                      class="select-vol-card"
                      onClick={() => onSelect(entry.id)}
                    >
                      <span class="select-vol-number">
                        Vol.{entry.volume}
                      </span>
                      <span class="select-vol-title">{entry.title}</span>
                      <span class="select-vol-time">
                        約{entry.estimatedMinutes}分
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
