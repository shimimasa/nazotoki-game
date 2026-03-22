/**
 * Background - 背景画像の表示
 * フェードによる背景切り替えに対応
 */

import { useEffect, useState } from 'preact/hooks'

interface Props {
  image: string | null
}

export function Background({ image }: Props) {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (image === currentImage) return

    // フェードアウト → 画像切替 → フェードイン
    setOpacity(0)
    const timer = setTimeout(() => {
      setCurrentImage(image)
      setOpacity(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [image])

  // 色グラデーションのプレースホルダー
  const placeholderGradients: Record<string, string> = {
    'hallway-sunset': 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 40%, #2d1b14 100%)',
    'broken-vase-closeup': 'linear-gradient(180deg, #4a3728 0%, #2d1b14 60%, #1a0f0a 100%)',
    'classroom': 'linear-gradient(135deg, #87CEEB 0%, #f5f0e8 40%, #d4c5a0 100%)',
    'classroom-blackboard': 'linear-gradient(180deg, #2d4a3e 0%, #1a3328 60%, #0f1f18 100%)',
  }

  const bgStyle = currentImage
    ? {
        backgroundImage: placeholderGradients[currentImage]
          ?? `url(/images/bg/${currentImage}.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: '#1a1a2e' }

  return (
    <div
      class="background"
      style={{
        ...bgStyle,
        opacity,
        transition: 'opacity 0.3s ease',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
    >
      {/* 背景名を小さく表示（開発用） */}
      {currentImage && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.3)',
          fontFamily: 'monospace',
        }}>
          BG: {currentImage}
        </div>
      )}
    </div>
  )
}
