/**
 * SpriteLayer - キャラクター立ち絵の表示レイヤー
 *
 * VNの定番レイアウト:
 * - キャラの足元はテキストウィンドウの上端に揃える
 * - キャラは画面の60-70%の高さを占める
 * - 複数キャラは重ならないよう均等配置
 */

import type { SpriteState, CharacterDef } from '../engine/types'

interface Props {
  sprites: SpriteState[]
  characters: Record<string, CharacterDef>
}

// テキストウィンドウの高さ（CSSと合わせる）
const TEXT_WINDOW_HEIGHT = 150

// キャラ数に応じた水平位置（%）
function getPositions(total: number): string[] {
  switch (total) {
    case 1: return ['50%']
    case 2: return ['32%', '68%']
    case 3: return ['22%', '50%', '78%']
    case 4: return ['18%', '39%', '61%', '82%']
    default: return ['50%']
  }
}

// キャラ数に応じたスプライトの高さ
function getSpriteHeight(total: number): string {
  switch (total) {
    case 1: return 'calc(100vh - 200px)'
    case 2: return 'calc(85vh - 180px)'
    case 3: return 'calc(75vh - 170px)'
    case 4: return 'calc(65vh - 160px)'
    default: return 'calc(70vh - 170px)'
  }
}

const NAMED_POSITIONS: Record<string, string> = {
  left: '28%',
  center: '50%',
  right: '72%',
}

export function SpriteLayer({ sprites, characters }: Props) {
  const positions = getPositions(sprites.length)
  const spriteHeight = getSpriteHeight(sprites.length)

  return (
    <div
      class="sprite-layer"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: `${TEXT_WINDOW_HEIGHT}px`,
        top: 0,
        zIndex: 5,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {sprites.map((sprite, i) => {
        const charDef = characters[sprite.characterId]
        if (!charDef) return null

        const spriteFile = charDef.sprites[sprite.expression]
        const leftPos = sprite.position
          ? NAMED_POSITIONS[sprite.position] ?? '50%'
          : positions[i] ?? '50%'

        return (
          <div
            key={sprite.characterId}
            class="sprite"
            style={{
              position: 'absolute',
              bottom: 0,
              left: leftPos,
              transform: 'translateX(-50%)',
              transition: 'all 0.5s ease',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            {spriteFile ? (
              <img
                src={`/images/sprites/${spriteFile}`}
                alt={charDef.name}
                style={{
                  height: spriteHeight,
                  maxWidth: sprites.length >= 4 ? '24vw' : '32vw',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
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
