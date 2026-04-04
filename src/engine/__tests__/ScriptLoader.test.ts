import { describe, it, expect, vi, beforeEach } from 'vitest'

// ScriptLoader uses fetch() and js-yaml. We mock fetch and import the module.
const mockYaml = `
meta:
  id: test-01
  title: テストシナリオ
  series: テスト探偵団
  volume: 1
  estimatedMinutes: 18

characters:
  taro:
    name: タロウ
    color: "#FF0000"
    sprites:
      normal: taro-normal.webp

scenes:
  - id: scene1
    steps:
      - type: narration
        text: テスト
`

const invalidNoMeta = `
characters:
  taro:
    name: タロウ
scenes:
  - id: s1
    steps:
      - type: narration
        text: hi
`

const invalidNoScenes = `
meta:
  id: test-01
  title: t
  series: s
  volume: 1
  estimatedMinutes: 10
characters:
  taro:
    name: タロウ
scenes: []
`

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('loadScript', () => {
  it('parses valid YAML into ScriptData', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockYaml),
    }))

    const { loadScript } = await import('../ScriptLoader')
    const data = await loadScript('/scripts/test-01.yaml')

    expect(data.meta.id).toBe('test-01')
    expect(data.meta.title).toBe('テストシナリオ')
    expect(data.meta.series).toBe('テスト探偵団')
    expect(data.meta.volume).toBe(1)
    expect(data.characters.taro.name).toBe('タロウ')
    expect(data.scenes).toHaveLength(1)
    expect(data.scenes[0].steps[0].type).toBe('narration')
  })

  it('throws on HTTP error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Not found'),
    }))

    const { loadScript } = await import('../ScriptLoader')
    await expect(loadScript('/scripts/missing.yaml')).rejects.toThrow('404')
  })

  it('throws when meta.id is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(invalidNoMeta),
    }))

    const { loadScript } = await import('../ScriptLoader')
    await expect(loadScript('/scripts/bad.yaml')).rejects.toThrow('meta.id')
  })

  it('throws when scenes array is empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(invalidNoScenes),
    }))

    const { loadScript } = await import('../ScriptLoader')
    await expect(loadScript('/scripts/bad.yaml')).rejects.toThrow('scenes')
  })
})
