/**
 * ScriptLoader - YAMLスクリプトを読み込んでScriptDataに変換する
 */

import yaml from 'js-yaml'
import type { ScriptData } from './types'

export async function loadScript(path: string): Promise<ScriptData> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Failed to load script: ${path} (${response.status})`)
  }
  const text = await response.text()
  const data = yaml.load(text) as ScriptData

  // バリデーション
  if (!data.meta?.id) throw new Error('Script missing meta.id')
  if (!data.characters) throw new Error('Script missing characters')
  if (!data.scenes?.length) throw new Error('Script missing scenes')

  return data
}
