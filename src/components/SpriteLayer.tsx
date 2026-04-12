/**
 * SpriteLayer - キャラクター立ち絵の表示レイヤー
 *
 * 各キャラクターを「キャラカード」として表示:
 * - 半透明の暗いパネル背景
 * - キャラカラーのサブトルなボーダー
 * - 発言中キャラは明るく＋ボーダー強調
 * - 非発言キャラは暗く
 */

import { useCallback, useState } from 'preact/hooks'
import type { SpriteState, CharacterDef } from '../engine/types'

interface Props {
  sprites: SpriteState[]
  characters: Record<string, CharacterDef>
  speakingCharacter?: string | null
}

// キャラ数に応じた水平位置
function getPositions(total: number): string[] {
  switch (total) {
    case 1: return ['50%']
    case 2: return ['30%', '70%']
    case 3: return ['20%', '50%', '80%']
    case 4: return ['14%', '38%', '62%', '86%']
    case 5: return ['10%', '28%', '50%', '72%', '90%']
    default: return ['50%']
  }
}

// キャラ数に応じたカード幅
function getCardWidth(total: number): string {
  switch (total) {
    case 1: return '30vw'
    case 2: return '28vw'
    case 3: return '24vw'
    case 4: return '20vw'
    case 5: return '17vw'
    default: return '22vw'
  }
}

function SpriteImage({ spriteFile, charName, charColor, isSpeaking }: {
  spriteFile: string | undefined
  charName: string
  charColor: string
  isSpeaking: boolean
}) {
  const [failed, setFailed] = useState(false)
  const handleError = useCallback(() => setFailed(true), [])

  if (!spriteFile || failed) {
    return (
      <div style={{
        height: '30vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: charColor,
        fontSize: '48px',
      }}>
        👤
      </div>
    )
  }

  return (
    <img
      src={`/images/sprites/${spriteFile}`}
      alt={charName}
      onError={handleError}
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: '50vh',
        objectFit: 'contain',
        objectPosition: 'top center',
        display: 'block',
        filter: isSpeaking ? 'brightness(1.05)' : 'brightness(0.65)',
        transition: 'filter 0.4s ease',
      }}
    />
  )
}

const NAMED_POSITIONS: Record<string, string> = {
  left: '25%',
  center: '50%',
  right: '75%',
}

export function SpriteLayer({ sprites, characters, speakingCharacter }: Props) {
  const positions = getPositions(sprites.length)
  const cardWidth = getCardWidth(sprites.length)

  return (
    <div
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

        const isSpeaking = !speakingCharacter || speakingCharacter === sprite.characterId
        const charColor = charDef.color

        return (
          <div
            key={sprite.characterId}
            class="sprite-card"
            style={{
              position: 'absolute',
              bottom: '22vh',
              left: leftPos,
              transform: 'translateX(-50%)',
              width: cardWidth,
              maxWidth: '350px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* キャラカード */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                background: isSpeaking
                  ? 'rgba(0, 0, 0, 0.35)'
                  : 'rgba(0, 0, 0, 0.5)',
                borderRadius: '12px 12px 0 0',
                border: `2px solid ${isSpeaking ? charColor : 'rgba(255,255,255,0.15)'}`,
                borderBottom: 'none',
                padding: '8px 4px 0',
                transition: 'all 0.4s ease',
                boxShadow: isSpeaking
                  ? `0 0 20px ${charColor}40, 0 4px 16px rgba(0,0,0,0.4)`
                  : '0 4px 12px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              <SpriteImage
              spriteFile={spriteFile}
              charName={charDef.name}
              charColor={charColor}
              isSpeaking={isSpeaking}
            />
            </div>

            {/* キャラ名タグ */}
            <div
              style={{
                width: '100%',
                padding: '4px 8px',
                background: isSpeaking ? charColor : 'rgba(40, 40, 60, 0.9)',
                borderRadius: '0 0 8px 8px',
                border: `2px solid ${isSpeaking ? charColor : 'rgba(255,255,255,0.15)'}`,
                borderTop: 'none',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 'bold',
                color: isSpeaking ? '#fff' : 'rgba(255,255,255,0.6)',
                letterSpacing: '1px',
                transition: 'all 0.4s ease',
              }}
            >
              {charDef.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
