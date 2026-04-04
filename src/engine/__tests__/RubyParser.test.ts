import { describe, it, expect } from 'vitest'
import {
  parseRubyText,
  countVisualUnits,
  renderSegmentsToHtml,
  stripRuby,
} from '../RubyParser'

describe('parseRubyText', () => {
  it('returns single plain segment for text without ruby', () => {
    const result = parseRubyText('普通のテキスト')
    expect(result).toEqual([{ type: 'plain', content: '普通のテキスト' }])
  })

  it('parses single ruby annotation', () => {
    const result = parseRubyText('{漢字|かんじ}')
    expect(result).toEqual([{ type: 'ruby', content: '漢字', ruby: 'かんじ' }])
  })

  it('parses mixed plain and ruby', () => {
    const result = parseRubyText('「{虹色|にじいろ}の{結晶|けっしょう}」が{消|き}えた')
    expect(result).toHaveLength(7)
    expect(result[0]).toEqual({ type: 'plain', content: '「' })
    expect(result[1]).toEqual({ type: 'ruby', content: '虹色', ruby: 'にじいろ' })
    expect(result[2]).toEqual({ type: 'plain', content: 'の' })
    expect(result[3]).toEqual({ type: 'ruby', content: '結晶', ruby: 'けっしょう' })
    expect(result[4]).toEqual({ type: 'plain', content: '」が' })
    expect(result[5]).toEqual({ type: 'ruby', content: '消', ruby: 'き' })
    expect(result[6]).toEqual({ type: 'plain', content: 'えた' })
  })

  it('handles empty string', () => {
    expect(parseRubyText('')).toEqual([])
  })

  it('handles consecutive ruby annotations', () => {
    const result = parseRubyText('{犯人|はんにん}{探|さが}し')
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ type: 'ruby', content: '犯人', ruby: 'はんにん' })
    expect(result[1]).toEqual({ type: 'ruby', content: '探', ruby: 'さが' })
    expect(result[2]).toEqual({ type: 'plain', content: 'し' })
  })

  it('handles trailing plain text after ruby', () => {
    const result = parseRubyText('{証拠|しょうこ}カード')
    expect(result).toEqual([
      { type: 'ruby', content: '証拠', ruby: 'しょうこ' },
      { type: 'plain', content: 'カード' },
    ])
  })
})

describe('countVisualUnits', () => {
  it('counts plain characters individually', () => {
    const segments = parseRubyText('あいう')
    expect(countVisualUnits(segments)).toBe(3)
  })

  it('counts ruby group as single unit', () => {
    const segments = parseRubyText('{漢字|かんじ}')
    expect(countVisualUnits(segments)).toBe(1)
  })

  it('combines plain and ruby counts', () => {
    const segments = parseRubyText('A{漢字|かんじ}B')
    expect(countVisualUnits(segments)).toBe(3) // A + {漢字} + B
  })
})

describe('renderSegmentsToHtml', () => {
  it('renders plain text with html escaping', () => {
    const segments = parseRubyText('<b>test</b>')
    const html = renderSegmentsToHtml(segments, 100, false)
    expect(html).toBe('&lt;b&gt;test&lt;/b&gt;')
  })

  it('renders ruby with furigana enabled', () => {
    const segments = parseRubyText('{漢字|かんじ}')
    const html = renderSegmentsToHtml(segments, 1, true)
    expect(html).toBe('<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>')
  })

  it('renders ruby without furigana (base text only)', () => {
    const segments = parseRubyText('{漢字|かんじ}')
    const html = renderSegmentsToHtml(segments, 1, false)
    expect(html).toBe('漢字')
  })

  it('limits output by visible units (typewriter)', () => {
    const segments = parseRubyText('AB{漢字|かんじ}CD')
    const html = renderSegmentsToHtml(segments, 3, false)
    expect(html).toBe('AB漢字')
  })

  it('returns empty for 0 visible units', () => {
    const segments = parseRubyText('テスト')
    expect(renderSegmentsToHtml(segments, 0, false)).toBe('')
  })
})

describe('stripRuby', () => {
  it('removes ruby annotations keeping base text', () => {
    expect(stripRuby('{漢字|かんじ}テスト')).toBe('漢字テスト')
  })

  it('handles multiple annotations', () => {
    expect(stripRuby('{犯人|はんにん}の{証拠|しょうこ}')).toBe('犯人の証拠')
  })

  it('returns plain text unchanged', () => {
    expect(stripRuby('テスト')).toBe('テスト')
  })
})
