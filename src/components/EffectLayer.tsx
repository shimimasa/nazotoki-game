/**
 * EffectLayer - 画面演出（シェイク、フラッシュ、フェード等）
 */

import { useEffect, useState } from 'preact/hooks'
import type { EffectStep } from '../engine/types'

interface Props {
  effect: EffectStep | null
  onEffectDone: () => void
}

export function EffectLayer({ effect, onEffectDone }: Props) {
  const [shaking, setShaking] = useState(false)
  const [flash, setFlash] = useState(false)
  const [fadeOverlay, setFadeOverlay] = useState<'in' | 'out' | null>(null)
  const [zooming, setZooming] = useState(false)

  useEffect(() => {
    if (!effect) return

    const duration = effect.duration ?? 500

    switch (effect.name) {
      case 'shake':
        setShaking(true)
        setTimeout(() => {
          setShaking(false)
          onEffectDone()
        }, duration)
        break

      case 'flash':
        setFlash(true)
        setTimeout(() => {
          setFlash(false)
          onEffectDone()
        }, duration)
        break

      case 'fade-out':
        setFadeOverlay('out')
        setTimeout(() => {
          setFadeOverlay(null)
          onEffectDone()
        }, duration)
        break

      case 'fade-in':
        setFadeOverlay('in')
        setTimeout(() => {
          setFadeOverlay(null)
          onEffectDone()
        }, duration)
        break

      case 'zoom-in':
        setZooming(true)
        setTimeout(() => {
          setZooming(false)
          onEffectDone()
        }, duration)
        break
    }
  }, [effect])

  return (
    <>
      {/* シェイクはCSS classで適用 */}
      {shaking && <style>{`
        .game-screen { animation: vn-shake 0.1s infinite; }
        @keyframes vn-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px) translateY(4px); }
          75% { transform: translateX(8px) translateY(-4px); }
        }
      `}</style>}

      {/* フラッシュ */}
      {flash && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'white',
          zIndex: 100,
          animation: 'vn-flash 0.3s ease-out forwards',
        }} />
      )}

      {/* ズームイン */}
      {zooming && <style>{`
        .game-screen {
          animation: vn-zoom-in ${(effect?.duration ?? 600)}ms ease-out forwards;
        }
        @keyframes vn-zoom-in {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>}

      {/* フェードオーバーレイ */}
      {fadeOverlay && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'black',
          zIndex: 100,
          opacity: fadeOverlay === 'out' ? 1 : 0,
          transition: `opacity ${(effect?.duration ?? 500)}ms ease`,
        }} />
      )}
    </>
  )
}
