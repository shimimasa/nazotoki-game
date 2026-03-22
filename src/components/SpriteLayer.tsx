/**
 * SpriteLayer - キャラクター立ち絵の表示レイヤー
 *
 * 複数キャラを position（left/center/right）に配置し、
 * テキストウィンドウと被らないよう bottom にマージンを取る。
 * キャラ数に応じてサイズと位置を自動調整する。
 */

import type { SpriteState, CharacterDef } from '../engine/types'

interface Props {
  sprites: SpriteState[]
  characters: Record<string, CharacterDef>
}

// キャラ数に応じたレイアウト設定
function getLayout(total: number) {
  switch (total) {
    case 1:
      return { positions: ['50%'], maxHeight: '55vh', maxWidth: '40vw' }
    case 2:
      return { positions: ['28%', '72%'], maxHeight: '50vh', maxWidth: '35vw' }
    case 3:
      return { positions: ['20%', '50%', '80%'], maxHeight: '45vh', maxWidth: '28vw' }
    case 4:
    default:
      return { positions: ['15%', '38%', '62%', '85%'], maxHeight: '40vh', maxWidth: '22vw' }
  }
}

const NAMED_POSITIONS: Record<string, string> = {
  left: '25%',
  center: '50%',
  right: '75%',
}

export function SpriteLayer({ sprites, characters }: Props) {
  const layout = getLayout(sprites.length)

  return (
    <div class="sprite-layer">
      {sprites.map((sprite, i) => {
        const charDef = characters[sprite.characterId]
        if (!charDef) return null

        const spriteFile = charDef.sprites[sprite.expression]
        const leftPos = sprite.position
          ? NAMED_POSITIONS[sprite.position] ?? '50%'
          : layout.positions[i] ?? '50%'

        return (
          <div
            key={sprite.characterId}
            class="sprite"
            style={{
              position: 'absolute',
              bottom: '160px', // テキストウィンドウの上に配置
              left: leftPos,
              transform: 'translateX(-50%)',
              transition: 'all 0.5s ease',
            }}
          >
            {spriteFile ? (
              <img
                src={`/images/sprites/${spriteFile}`}
                alt={charDef.name}
                style={{
                  maxHeight: layout.maxHeight,
                  maxWidth: layout.maxWidth,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
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
