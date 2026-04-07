/**
 * Background - 背景画像の表示
 * フェードによる背景切り替えに対応
 */

import { useEffect, useState, useCallback } from 'preact/hooks'

const FALLBACK_BG = 'classroom'

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

  const handleImgError = useCallback((e: Event) => {
    const img = e.target as HTMLImageElement
    const fallbackSrc = `/images/bg/${FALLBACK_BG}.webp`
    if (!img.src.endsWith(fallbackSrc)) {
      img.src = fallbackSrc
    }
  }, [])

  return (
    <div
      class="background"
      style={{
        opacity,
        transition: 'opacity 0.3s ease',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: '#1a1a2e',
      }}
    >
      {currentImage && (
        <img
          src={`/images/bg/${currentImage}.webp`}
          alt=""
          onError={handleImgError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      )}
    </div>
  )
}
