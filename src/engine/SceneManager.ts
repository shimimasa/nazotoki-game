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
  ChoiceStep,
} from './types'

export function createInitialState(): GameState {
  return {
    phase: 'select',
    currentSceneIndex: 0,
    currentStepIndex: 0,
    choices: {},
    correctCount: 0,
    totalJudged: 0,
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
    pendingSounds: [],
    waitingForClick: false,
    showingFeedback: false,
    feedbackIsCorrect: null,
    retryChoice: null,
    backlog: [],
    autoMode: false,
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

    case 'choice_selected': {
      const choice = state.activeChoice
      if (!choice) return state
      const selectedOption = choice.options.find((o) => o.value === event.value)
      const hasCorrectAnswer = choice.options.some((o) => o.correct)
      const isCorrect = !hasCorrectAnswer || !!selectedOption?.correct
      const feedback =
        selectedOption?.feedback || choice.feedback_default || null
      // リトライ中かどうか（初回のみ totalJudged をカウント）
      const isRetry = !!state.retryChoice

      if (isCorrect) {
        // 正解 or 正解なし選択肢 → 記録して次へ
        // 初回正解: correctCount+1, totalJudged+1
        // リトライ正解: correctCount+1のみ（totalJudgedは初回不正解時にカウント済み）
        const newState: GameState = {
          ...state,
          choices: { ...state.choices, [event.choiceId]: event.value },
          activeChoice: null,
          retryChoice: null,
          correctCount: hasCorrectAnswer ? state.correctCount + 1 : state.correctCount,
          totalJudged: (hasCorrectAnswer && !isRetry) ? state.totalJudged + 1 : state.totalJudged,
          pendingSounds: hasCorrectAnswer
            ? [...state.pendingSounds, 'correct']
            : state.pendingSounds,
        }
        if (feedback) {
          return {
            ...newState,
            showingFeedback: true,
            feedbackIsCorrect: hasCorrectAnswer ? true : null,
            textDisplay: {
              text: feedback,
              characterName: null,
              characterColor: null,
              isTyping: true,
              visibleChars: 0,
            },
          }
        }
        return { ...newState, feedbackIsCorrect: null }
      } else {
        // 不正解 → フィードバック後にリトライ
        const newState: GameState = {
          ...state,
          activeChoice: null,
          retryChoice: choice,
          totalJudged: !isRetry ? state.totalJudged + 1 : state.totalJudged,
          pendingSounds: [...state.pendingSounds, 'wrong'],
        }
        if (feedback) {
          return {
            ...newState,
            showingFeedback: true,
            feedbackIsCorrect: false,
            textDisplay: {
              text: feedback,
              characterName: null,
              characterColor: null,
              isTyping: true,
              visibleChars: 0,
            },
          }
        }
        // フィードバックなし → 即リトライ
        return { ...newState, activeChoice: choice, retryChoice: null }
      }
    }

    case 'effect_done':
      return { ...state, activeEffect: null }

    case 'sounds_played':
      return { ...state, pendingSounds: [] }

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
    if (scene.bgm) {
      newState.currentBgm = scene.bgm
    } else {
      const autoBgm = getDefaultBgm(scene.id)
      if (autoBgm) newState.currentBgm = autoBgm
    }
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

  // フィードバック表示中 → クリックでフィードバックを閉じる
  if (state.showingFeedback) {
    if (state.retryChoice) {
      // 不正解 → 同じ選択肢を再表示
      return {
        ...state,
        showingFeedback: false,
        feedbackIsCorrect: null,
        activeChoice: state.retryChoice,
        retryChoice: null,
        textDisplay: { text: '', characterName: null, characterColor: null, isTyping: false, visibleChars: 0 },
      }
    }
    return advanceStep(script, { ...state, showingFeedback: false, feedbackIsCorrect: null })
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
    if (nextScene.bgm) {
      state = { ...state, currentBgm: nextScene.bgm }
    } else if (!state.currentBgm || shouldAutoSwitchBgm(script.scenes[state.currentSceneIndex]?.id, nextScene.id)) {
      // BGM未指定のシーンにはシーンIDからデフォルトBGMを自動割当
      const autoBgm = getDefaultBgm(nextScene.id)
      if (autoBgm) state = { ...state, currentBgm: autoBgm }
    }
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
      return advanceStep(script, applySprite(state, step))

    case 'sprite_group':
      return advanceStep(script, applySpriteGroup(state, step))

    case 'bg':
      return advanceStep(script, applyBg(state, step))

    case 'bgm':
      return advanceStep(script, applyBgm(state, step))

    case 'se':
      return advanceStep(script, {
        ...state,
        pendingSounds: [...state.pendingSounds, step.sound],
      })

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
      speed: step.speed,
    },
    backlog: [...state.backlog, { text: step.text, characterName: null, characterColor: null }],
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

  const name = charDef?.name ?? step.character
  const color = charDef?.color ?? '#ffffff'

  return {
    ...state,
    visibleSprites: newSprites,
    textDisplay: {
      text: step.text,
      characterName: name,
      characterColor: color,
      isTyping: true,
      visibleChars: 0,
    },
    backlog: [...state.backlog, { text: step.text, characterName: name, characterColor: color }],
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
  // positionは設定しない → SpriteLayerがインデックスベースで均等配置する
  const newSprites: SpriteState[] = step.characters.map((c) => ({
    characterId: c.id,
    expression: c.expression,
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

// --- デフォルトBGM自動マッピング ---

/**
 * シーンIDからフェーズを推定してBGMを返す
 * 利用可能BGM: daily-life, exploration, tension-quiet, confession, hope
 */
function getDefaultBgm(sceneId: string): string | null {
  if (!sceneId) return null
  // プロローグ・日常
  if (sceneId === 'prologue' || sceneId === 'title' || sceneId === 'suspects') {
    return 'daily-life'
  }
  // 証拠収集・捜査
  if (sceneId.startsWith('evidence') || sceneId === 'letter') {
    return 'exploration'
  }
  // 推理・質問フェーズ
  if (sceneId === 'questions' || sceneId === 'deduction' || sceneId === 'investigation') {
    return 'tension-quiet'
  }
  // 真相解明
  if (sceneId.startsWith('truth')) {
    return 'confession'
  }
  // エピローグ
  if (sceneId === 'epilogue') {
    return 'hope'
  }
  return null
}

/**
 * シーン遷移時にBGMを切り替えるべきか判定
 * フェーズが変わったときのみtrue
 */
function shouldAutoSwitchBgm(prevSceneId: string | undefined, nextSceneId: string): boolean {
  if (!prevSceneId) return true
  const prevBgm = getDefaultBgm(prevSceneId)
  const nextBgm = getDefaultBgm(nextSceneId)
  return prevBgm !== nextBgm && nextBgm !== null
}
