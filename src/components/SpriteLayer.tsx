/**
 * SpriteLayer - キャラクター立ち絵の表示レイヤー
 *
 * VN標準のレイアウト:
 * - キャラは画面の80-90%の高さを占める
 * - 足元は画面下端より下（画面外にはみ出す）
 * - テキストウィンドウがキャラの腰〜足を覆う（z-indexで上に乗る）
 * - 発言中のキャラは明るく、それ以外は暗く
 */

import type { SpriteState, CharacterDef } from '../engine/types'

interface Props {
  sprites: SpriteState[]
  characters: Record<string, CharacterDef>
  speakingCharacter?: string | null
}

// キャラ数に応じた水平位置（Ren'Py標準に準拠）
function getPositions(total: number): string[] {
  switch (total) {
    case 1: return ['50%']
    case 2: return ['25%', '75%']
    case 3: return ['20%', '50%', '80%']
    case 4: return ['15%', '38%', '62%', '85%']
    case 5: return ['12%', '30%', '50%', '70%', '88%']
    default: return ['50%']
  }
}

// キャラ数に応じたスプライト高さ（画面の大部分を占める）
function getSpriteHeight(total: number): string {
  switch (total) {
    case 1: return '92vh'
    case 2: return '85vh'
    case 3: return '80vh'
    case 4: return '72vh'
    case 5: return '65vh'
    default: return '70vh'
  }
}

const NAMED_POSITIONS: Record<string, string> = {
  left: '25%',
  center: '50%',
  right: '75%',
}

export function SpriteLayer({ sprites, characters, speakingCharacter }: Props) {
  const spriteHeight = getSpriteHeight(sprites.length)
  const positions = getPositions(sprites.length)

  return (
    <div
      class="sprite-layer"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      {sprites.map((sprite, i) => {
        const charDef = characters[sprite.characterId]
        if (!charDef) return null

        const spriteFile = charDef.sprites[sprite.expression]
        const leftPos = sprite.position
          ? NAMED_POSITIONS[sprite.position] ?? '50%'
          : positions[i] ?? '50%'

        // 発言中かどうかで明るさを変える
        const isSpeaking = !speakingCharacter || speakingCharacter === sprite.characterId
        const brightnessFilter = isSpeaking
          ? 'brightness(1)'
          : 'brightness(0.6)'

        return (
          <div
            key={sprite.characterId}
            style={{
              position: 'absolute',
              bottom: '-5vh', // 足元を画面外にはみ出させる（VN標準）
              left: leftPos,
              transform: 'translateX(-50%)',
              transition: 'all 0.4s ease',
              filter: `${brightnessFilter} drop-shadow(0 2px 12px rgba(0,0,0,0.5))`,
            }}
          >
            {spriteFile ? (
              <img
                src={`/images/sprites/${spriteFile}`}
                alt={charDef.name}
                style={{
                  height: spriteHeight,
                  maxWidth: sprites.length >= 5 ? '22vw' : sprites.length >= 4 ? '26vw' : '35vw',
                  objectFit: 'contain',
                  objectPosition: 'top center',
                }}
              />
            ) : (
              <div class="sprite-placeholder" style={{ color: charDef.color }}>
                <div class="sprite-placeholder-icon">👤</div>
                <div class="sprite-placeholder-name">{charDef.name}</div>
                <div class="sprite-placeholder-expr">({sprite.expression})</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
