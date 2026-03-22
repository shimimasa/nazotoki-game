/**
 * TitleCard - フェーズ間のタイトルカード表示
 * 「ステップ1: 調査」等のテロップ
 */

interface Props {
  text: string
  subtitle?: string
  onClick: () => void
}

export function TitleCard({ text, subtitle, onClick }: Props) {
  return (
    <div class="title-card-overlay" onClick={onClick}>
      <div class="title-card">
        <h2 class="title-card-text">{text}</h2>
        {subtitle && <p class="title-card-subtitle">{subtitle}</p>}
        <div class="title-card-hint">クリックで続ける</div>
      </div>
    </div>
  )
}
