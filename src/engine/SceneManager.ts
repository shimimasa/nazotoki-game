/**
 * SceneManager - VNゲームの進行状態を管理する状態マシン
 *
 * YAMLスクリプトのステップを1つずつ処理し、
 * 画面に何を表示すべきかの状態（GameState）を生成する。
 */

import type {
  ScriptData,
  GameState,
  GameEvent,
  Step,
  SpriteState,
  DialogStep,
  NarrationStep,
} from './types'

export function createInitialState(): GameState {
  return {
    phase: 'title',
    currentSceneIndex: 0,
    currentStepIndex: 0,
    choices: {},
    visibleSprites: [],
    currentBg: null,
    currentBgm: null,
    textDisplay: {
      text: '',
      characterName: null,
      characterColor: null,
      isTyping: false,
      visibleChars: 0,
    },
    activeChoice: null,
    activeEffect: null,
    activeTitleCard: null,
    waitingForClick: false,
  }
}

/**
 * 現在のステップを取得
 */
export function getCurrentStep(
  script: ScriptData,
  state: GameState
): Step | null {
  const scene = script.scenes[state.currentSceneIndex]
  if (!scene) return null
  return scene.steps[state.currentStepIndex] ?? null
}

/**
 * イベントに応じて GameState を更新する純粋関数
 */
export function processEvent(
  script: ScriptData,
  state: GameState,
  event: GameEvent
): GameState {
  switch (event.type) {
    case 'start_game':
      return processStartGame(script, state)

    case 'click':
      return processClick(script, state)

    case 'choice_selected':
      return {
        ...state,
        choices: { ...state.choices, [event.choiceId]: event.value },
        activeChoice: null,
      }

    case 'effect_done':
      return { ...state, activeEffect: null }

    case 'wait_done':
      return state

    case 'title_card_done':
      return { ...state, activeTitleCard: null }

    default:
      return state
  }
}

function processStartGame(script: ScriptData, state: GameState): GameState {
  const newState: GameState = {
    ...state,
    phase: 'playing',
    currentSceneIndex: 0,
    currentStepIndex: 0,
  }
  // シーンの初期bg/bgmを適用
  const scene = script.scenes[0]
  if (scene) {
    if (scene.bg) newState.currentBg = scene.bg
    if (scene.bgm) newState.currentBgm = scene.bgm
  }
  return newState
}

function processClick(script: ScriptData, state: GameState): GameState {
  if (state.phase !== 'playing') return state

  // タイプライター中ならテキスト全表示
  if (state.textDisplay.isTyping) {
    return {
      ...state,
      textDisplay: {
        ...state.textDisplay,
        isTyping: false,
        visibleChars: state.textDisplay.text.length,
      },
    }
  }

  // 選択肢表示中はクリックを無視
  if (state.activeChoice) return state

  // エフェクト中はクリックを無視
  if (state.activeEffect) return state

  // タイトルカード中は消す
  if (state.activeTitleCard) {
    return { ...state, activeTitleCard: null }
  }

  // 次のステップに進む
  return advanceStep(script, state)
}

/**
 * 次のステップに進み、即座に処理可能なステップを連続処理する
 */
export function advanceStep(
  script: ScriptData,
  state: GameState
): GameState {
  let nextStepIndex = state.currentStepIndex + 1
  let nextSceneIndex = state.currentSceneIndex
  const scene = script.scenes[nextSceneIndex]

  // シーン末尾に到達 → 次のシーンへ
  if (!scene || nextStepIndex >= scene.steps.length) {
    nextSceneIndex++
    nextStepIndex = 0

    // 全シーン終了 → 結果画面
    if (nextSceneIndex >= script.scenes.length) {
      return {
        ...state,
        phase: 'result',
        textDisplay: {
          text: '',
          characterName: null,
          characterColor: null,
          isTyping: false,
          visibleChars: 0,
        },
        waitingForClick: false,
      }
    }

    // 新シーンの初期bg/bgmを適用
    const nextScene = script.scenes[nextSceneIndex]
    if (nextScene.bg) state = { ...state, currentBg: nextScene.bg }
    if (nextScene.bgm) state = { ...state, currentBgm: nextScene.bgm }
  }

  const newState: GameState = {
    ...state,
    currentSceneIndex: nextSceneIndex,
    currentStepIndex: nextStepIndex,
  }

  // 新しいステップを処理
  return executeStep(script, newState)
}

/**
 * 現在のステップを実行し、状態を更新する
 * テキスト系/選択肢/エフェクト → ユーザー入力待ちになる
 * それ以外 → 即座に次のステップへ進む
 */
export function executeStep(
  script: ScriptData,
  state: GameState
): GameState {
  const step = getCurrentStep(script, state)
  if (!step) return state

  switch (step.type) {
    case 'narration':
      return applyNarration(state, step)

    case 'dialog':
      return applyDialog(script, state, step)

    case 'sprite':
      return applySprite(state, step)

    case 'sprite_group':
      return applySpriteGroup(state, step)

    case 'bg':
      return applyBg(state, step)

    case 'bgm':
      return applyBgm(state, step)

    case 'se':
      // SE再生はコンポーネント側で処理。状態は次へ進む
      return advanceStep(script, state)

    case 'effect':
      return { ...state, activeEffect: step }

    case 'choice':
      return { ...state, activeChoice: step, waitingForClick: false }

    case 'wait':
      // wait は時間経過後に自動で次へ
      return { ...state, waitingForClick: false }

    case 'title_card':
      return { ...state, activeTitleCard: step, waitingForClick: false }
  }
}

function applyNarration(state: GameState, step: NarrationStep): GameState {
  return {
    ...state,
    textDisplay: {
      text: step.text,
      characterName: null,
      characterColor: null,
      isTyping: true,
      visibleChars: 0,
    },
    waitingForClick: false,
  }
}

function applyDialog(
  script: ScriptData,
  state: GameState,
  step: DialogStep
): GameState {
  const charDef = script.characters[step.character]
  let newSprites = state.visibleSprites

  // expression指定があれば立ち絵を更新
  if (step.expression && charDef) {
    newSprites = updateSpriteExpression(
      newSprites,
      step.character,
      step.expression
    )
  }

  return {
    ...state,
    visibleSprites: newSprites,
    textDisplay: {
      text: step.text,
      characterName: charDef?.name ?? step.character,
      characterColor: charDef?.color ?? '#ffffff',
      isTyping: true,
      visibleChars: 0,
    },
    waitingForClick: false,
  }
}

function applySprite(
  state: GameState,
  step: { type: 'sprite'; character: string; expression: string; position?: string; action?: string }
): GameState {
  if (step.action === 'hide') {
    return {
      ...state,
      visibleSprites: state.visibleSprites.filter(
        (s) => s.characterId !== step.character
      ),
    }
  }

  const existing = state.visibleSprites.find(
    (s) => s.characterId === step.character
  )
  const position = (step.position ?? existing?.position ?? 'center') as SpriteState['position']

  if (existing) {
    return {
      ...state,
      visibleSprites: state.visibleSprites.map((s) =>
        s.characterId === step.character
          ? { ...s, expression: step.expression, position }
          : s
      ),
    }
  }

  return {
    ...state,
    visibleSprites: [
      ...state.visibleSprites,
      { characterId: step.character, expression: step.expression, position },
    ],
  }
}

function applySpriteGroup(
  state: GameState,
  step: { type: 'sprite_group'; characters: Array<{ id: string; expression: string }> }
): GameState {
  const positions: Array<SpriteState['position']> = ['left', 'center', 'right', 'center']
  const newSprites: SpriteState[] = step.characters.map((c, i) => ({
    characterId: c.id,
    expression: c.expression,
    position: positions[i] ?? 'center',
  }))
  return { ...state, visibleSprites: newSprites }
}

function applyBg(
  state: GameState,
  step: { type: 'bg'; image: string }
): GameState {
  return { ...state, currentBg: step.image }
}

function applyBgm(
  state: GameState,
  step: { type: 'bgm'; track?: string; action?: string }
): GameState {
  if (step.action === 'stop' || step.action === 'fade-out') {
    return { ...state, currentBgm: null }
  }
  if (step.track) {
    return { ...state, currentBgm: step.track }
  }
  return state
}

function updateSpriteExpression(
  sprites: SpriteState[],
  characterId: string,
  expression: string
): SpriteState[] {
  const exists = sprites.some((s) => s.characterId === characterId)
  if (exists) {
    return sprites.map((s) =>
      s.characterId === characterId ? { ...s, expression } : s
    )
  }
  return [...sprites, { characterId, expression, position: 'center' }]
}
