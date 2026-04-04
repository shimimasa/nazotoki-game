/**
 * ScenarioSelect - シナリオ選択画面
 * シリーズごとにグルーピング + 教科フィルター + アコーディオン開閉
 * クリア済みバッジ + シリーズ完了率表示
 */

import { useState, useEffect, useMemo, useCallback } from 'preact/hooks'
import { getAllClearRecords, type ClearRecord, type DetectiveRank } from '../engine/SaveManager'
import registryData from '../../../series-registry.json'

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

const SERIES_ORDER = registryData.map((s: { name: string }) => s.name)

const RANK_COLORS: Record<DetectiveRank, string> = {
  S: '#D4AF37',  // ゴールド
  A: '#8B7355',  // アンティークブロンズ
  B: '#B87333',  // コッパー
  C: '#5C4033',  // ブラウン
}

export function ScenarioSelect({ onSelect }: Props) {
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [openSeries, setOpenSeries] = useState<Set<string>>(new Set())
  const [activeSubject, setActiveSubject] = useState<string | null>(null)
  const [clearRecords, setClearRecords] = useState<Record<string, ClearRecord>>({})

  useEffect(() => {
    fetch('/scripts/catalog.json')
      .then((r) => r.json())
      .then((data: CatalogEntry[]) => {
        setCatalog(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    setClearRecords(getAllClearRecords())
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

  // シリーズ内のクリア数を計算
  const getSeriesClearCount = useCallback((entries: CatalogEntry[]) => {
    return entries.filter((e) => clearRecords[e.id]).length
  }, [clearRecords])

  const totalCleared = useMemo(() => Object.keys(clearRecords).length, [clearRecords])

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
        <p class="select-subtitle">シナリオをえらんでください</p>
        {totalCleared > 0 && (
          <p class="select-clear-summary">
            クリア: {totalCleared}/{catalog.length}本
          </p>
        )}
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
          const clearedCount = getSeriesClearCount(group.entries)
          const isComplete = clearedCount === group.entries.length && clearedCount > 0
          return (
            <div key={group.series} class="select-series-group">
              <button
                class={`select-series-header ${isComplete ? 'series-complete' : ''}`}
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
                {clearedCount > 0 && (
                  <span class={`select-series-clear ${isComplete ? 'complete' : ''}`}>
                    {isComplete ? '★' : `${clearedCount}/${group.entries.length}`}
                  </span>
                )}
                <span class="select-series-count">
                  {group.entries.length}本
                </span>
              </button>

              {isOpen && (
                <div class="select-series-body">
                  {group.entries.map((entry) => {
                    const record = clearRecords[entry.id]
                    return (
                      <button
                        key={entry.id}
                        class={`select-vol-card ${record ? 'cleared' : ''}`}
                        onClick={() => onSelect(entry.id)}
                      >
                        {record && (
                          <span
                            class="select-vol-badge"
                            style={{ color: RANK_COLORS[record.rank], borderColor: RANK_COLORS[record.rank] }}
                          >
                            {record.rank}
                          </span>
                        )}
                        <span class="select-vol-number">
                          Vol.{entry.volume}
                        </span>
                        <span class="select-vol-title">{entry.title}</span>
                        <span class="select-vol-time">
                          約{entry.estimatedMinutes}分
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
