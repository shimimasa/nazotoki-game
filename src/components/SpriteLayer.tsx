/**
 * SpriteLayer - キャラクター立ち絵の表示レイヤー
 *
 * 複数キャラを position（left/center/right）に配置し、
 * 表情切り替え時にフェードで遷移する。
 */

import type { SpriteState, CharacterDef } from '../engine/types'

interface Props {
  sprites: SpriteState[]
  characters: Record<string, CharacterDef>
}

const POSITION_STYLE: Record<string, { left: string; transform: string }> = {
  left: { left: '15%', transform: 'translateX(-50%)' },
  center: { left: '50%', transform: 'translateX(-50%)' },
  right: { left: '85%', transform: 'translateX(-50%)' },
}

// 4人表示時のポジション
function getPositionForIndex(index: number, total: number): { left: string; transform: string } {
  if (total === 1) return POSITION_STYLE.center
  if (total === 2) return index === 0 ? POSITION_STYLE.left : POSITION_STYLE.right
  if (total === 3) {
    const positions = [POSITION_STYLE.left, POSITION_STYLE.center, POSITION_STYLE.right]
    return positions[index] ?? POSITION_STYLE.center
  }
  // 4人
  const pcts = ['15%', '38%', '62%', '85%']
  return { left: pcts[index] ?? '50%', transform: 'translateX(-50%)' }
}

export function SpriteLayer({ sprites, characters }: Props) {
  return (
    <div class="sprite-layer">
      {sprites.map((sprite, i) => {
        const charDef = characters[sprite.characterId]
        if (!charDef) return null

        const spriteFile = charDef.sprites[sprite.expression]
        const pos = sprite.position
          ? POSITION_STYLE[sprite.position] ?? POSITION_STYLE.center
          : getPositionForIndex(i, sprites.length)

        return (
          <div
            key={sprite.characterId}
            class="sprite"
            style={{
              position: 'absolute',
              bottom: '0',
              left: pos.left,
              transform: pos.transform,
              transition: 'all 0.5s ease',
            }}
          >
            {spriteFile ? (
              <img
                src={`/images/sprites/${spriteFile}`}
                alt={charDef.name}
                style={{
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                }}
              />
            ) : (
              // プレースホルダー: 画像がない場合はキャラ名を表示
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
