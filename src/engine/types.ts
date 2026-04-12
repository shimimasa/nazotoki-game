/** VNエンジン 型定義 */

// --- スクリプトデータ（YAMLから読み込む） ---

export interface ScriptData {
  meta: ScriptMeta
  characters: Record<string, CharacterDef>
  scenes: SceneDef[]
}

export interface ScriptMeta {
  id: string
  title: string
  series: string
  volume: number
  estimatedMinutes: number
}

export interface CharacterDef {
  name: string
  color: string
  sprites: Record<string, string> // expression -> filename
}

export interface SceneDef {
  id: string
  bg?: string
  bgm?: string
  steps: Step[]
}

// --- ステップ（1つの演出単位） ---

export type Step =
  | NarrationStep
  | DialogStep
  | SpriteStep
  | SpriteGroupStep
  | BgStep
  | BgmStep
  | AmbientStep
  | SeStep
  | EffectStep
  | ChoiceStep
  | WaitStep
  | TitleCardStep

export interface NarrationStep {
  type: 'narration'
  text: string
  speed?: 'slow' | 'normal' | 'fast'
}

export interface DialogStep {
  type: 'dialog'
  character: string
  text: string
  expression?: string
}

export interface SpriteStep {
  type: 'sprite'
  character: string
  expression: string
  position?: 'left' | 'center' | 'right'
  action?: 'show' | 'hide'
}

export interface SpriteGroupStep {
  type: 'sprite_group'
  characters: Array<{
    id: string
    expression: string
  }>
}

export interface BgStep {
  type: 'bg'
  image: string
  transition?: 'fade' | 'instant'
}

export interface BgmStep {
  type: 'bgm'
  track?: string
  action?: 'play' | 'stop' | 'fade-out'
}

export interface AmbientStep {
  type: 'ambient'
  sound?: string
  action?: 'play' | 'stop' | 'fade-out'
}

export interface SeStep {
  type: 'se'
  sound: string
}

export interface EffectStep {
  type: 'effect'
  name: 'shake' | 'flash' | 'fade-in' | 'fade-out'
  duration?: number
}

export interface ChoiceStep {
  type: 'choice'
  id: string
  question?: string
  options: ChoiceOption[]
  feedback_default?: string
}

export interface ChoiceOption {
  text: string
  value: string
  feedback?: string
  correct?: boolean // trueで正解選択肢。不正解時はリトライ
}

export interface WaitStep {
  type: 'wait'
  duration: number // ms
}

export interface TitleCardStep {
  type: 'title_card'
  text: string
  subtitle?: string
}

// --- エンジンの状態 ---

export interface GameState {
  phase: 'select' | 'title' | 'playing' | 'result'
  currentSceneIndex: number
  currentStepIndex: number
  choices: Record<string, string> // choiceId -> selected value
  correctCount: number // 正解数（correct: true の選択肢を選んだ回数）
  totalJudged: number // 正解判定がある選択肢の総数
  // 表示状態
  visibleSprites: SpriteState[]
  currentBg: string | null
  currentBgm: string | null
  currentAmbient: string | null
  textDisplay: TextDisplayState
  activeChoice: ChoiceStep | null
  activeEffect: EffectStep | null
  activeTitleCard: TitleCardStep | null
  pendingSounds: string[] // SE再生キュー
  waitingForClick: boolean
  showingFeedback: boolean // 選択肢フィードバック表示中
  feedbackIsCorrect: boolean | null // true=正解, false=不正解, null=判定なし
  retryChoice: ChoiceStep | null // 不正解時のリトライ用
  backlog: BacklogEntry[] // テキスト履歴
  autoMode: boolean // オートモード（テキスト完了後に自動進行）
}

export interface BacklogEntry {
  text: string
  characterName: string | null
  characterColor: string | null
}

export interface SpriteState {
  characterId: string
  expression: string
  position?: 'left' | 'center' | 'right'
}

export interface TextDisplayState {
  text: string
  characterName: string | null
  characterColor: string | null
  isTyping: boolean
  visibleChars: number
  speed?: 'slow' | 'normal' | 'fast' // テキスト表示速度
}

// --- イベント ---

export type GameEvent =
  | { type: 'click' }
  | { type: 'choice_selected'; choiceId: string; value: string }
  | { type: 'sounds_played' }
  | { type: 'effect_done' }
  | { type: 'wait_done' }
  | { type: 'start_game' }
  | { type: 'title_card_done' }
