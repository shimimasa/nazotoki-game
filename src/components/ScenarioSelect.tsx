/**
 * ScenarioSelect - シナリオ選択画面
 * シリーズごとにグルーピング + 教科フィルター + アコーディオン開閉
 * クリア済みバッジ + シリーズ完了率表示
 */

import { useState, useEffect, useMemo, useCallback } from 'preact/hooks'
import { getAllClearRecords, type ClearRecord, type DetectiveRank } from '../engine/SaveManager'
import registryData from '../series-registry.json'

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
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

  const CATEGORY_MAP: Record<string, string[]> = {
    '理数': ['理科', '算数', '物理', '数学', '数学深化', '実験', '地質'],
    '社会': ['公民', '経済', '地理', '国際理解', '選挙'],
    '言語・文学': ['英語', 'ことば', '名作文学'],
    '道徳・哲学': ['道徳', '哲学'],
    '生活・キャリア': ['キャリア', '食育', '家庭科', '農業'],
    '情報・デジタル': ['デジタル', 'プログラミング', 'メディアリテラシー'],
    '自然・環境': ['海洋', '宇宙', '天気', 'エネルギー', 'ESD', '生命', '昆虫'],
    '安全・健康': ['防犯', '防災', '保健', '体育', '交通安全', '福祉', '医療'],
    '文化・芸術': ['音楽', '美術', '図工', '伝統文化', '発明', 'デザイン思考', '特別活動', 'マンガ教養', 'ポップカルチャー', 'タイムトラベル', 'データ', '論理学', '感情', '人権', '平和', 'コミュニケーション', '金融'],
  }

  const categories = useMemo(() => {
    const allSubjects = new Set(catalog.map(e => e.subject))
    return Object.entries(CATEGORY_MAP).filter(([, subs]) =>
      subs.some(s => allSubjects.has(s))
    ).map(([name]) => name)
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
    if (!activeCategory) return groups
    const matchingSubjects = CATEGORY_MAP[activeCategory] ?? []
    return groups.filter((g) => matchingSubjects.includes(g.subject))
  }, [groups, activeCategory])

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

      {/* カテゴリフィルター */}
      <div class="select-filters">
        <button
          class={`select-filter-btn ${activeCategory === null ? 'active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            class={`select-filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* シリーズ一覧（グリッドカード） */}
      <div class="select-series-grid">
        {filteredGroups.map((group) => {
          const isOpen = openSeries.has(group.series)
          const clearedCount = getSeriesClearCount(group.entries)
          const isComplete = clearedCount === group.entries.length && clearedCount > 0
          return (
            <div key={group.series} class={`select-series-card ${isOpen ? 'open' : ''} ${isComplete ? 'complete' : ''}`}>
              <button
                class="select-series-card-header"
                onClick={() => toggleSeries(group.series)}
                aria-expanded={isOpen}
              >
                <div class="select-series-card-top">
                  <span class="select-series-subject-tag">{group.subject}</span>
                  {clearedCount > 0 && (
                    <span class={`select-series-clear ${isComplete ? 'complete' : ''}`}>
                      {isComplete ? '★ 全クリア' : `${clearedCount}/${group.entries.length}`}
                    </span>
                  )}
                </div>
                <div class="select-series-card-name">{group.series}</div>
                <div class="select-series-card-meta">
                  {group.entries.length}本 · 約{group.entries[0]?.estimatedMinutes ?? 18}分/本
                </div>
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
                        <span class="select-vol-number">Vol.{entry.volume}</span>
                        <span class="select-vol-title">{entry.title}</span>
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
