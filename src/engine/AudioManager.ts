/**
 * AudioManager - BGMとSEの再生を管理
 *
 * BGM: ループ再生、フェードイン/アウト対応
 * SE: 単発再生
 */

class AudioManagerImpl {
  private bgmElement: HTMLAudioElement | null = null
  private currentBgmTrack: string | null = null
  private bgmVolume = 0.4
  private seVolume = 0.7
  private muted = false

  /**
   * BGMを再生（同じ曲なら何もしない）
   */
  async playBgm(track: string): Promise<void> {
    if (this.currentBgmTrack === track && this.bgmElement) return

    this.stopBgm()

    const audio = new Audio(`/audio/bgm/${track}.mp3`)
    audio.loop = true
    audio.volume = this.muted ? 0 : this.bgmVolume

    try {
      await audio.play()
      this.bgmElement = audio
      this.currentBgmTrack = track
    } catch {
      // ブラウザのAutoplay Policy対策: ユーザー操作後にリトライ
      console.warn('BGM autoplay blocked, will retry on user interaction')
      const retry = () => {
        audio.play().then(() => {
          this.bgmElement = audio
          this.currentBgmTrack = track
        }).catch(() => {})
        document.removeEventListener('click', retry)
      }
      document.addEventListener('click', retry, { once: true })
    }
  }

  /**
   * BGMを停止
   */
  stopBgm(): void {
    if (this.bgmElement) {
      this.bgmElement.pause()
      this.bgmElement.currentTime = 0
      this.bgmElement = null
      this.currentBgmTrack = null
    }
  }

  /**
   * BGMをフェードアウト
   */
  async fadeOutBgm(durationMs = 1000): Promise<void> {
    if (!this.bgmElement) return

    const audio = this.bgmElement
    const startVolume = audio.volume
    const steps = 20
    const stepMs = durationMs / steps
    const volumeStep = startVolume / steps

    for (let i = 0; i < steps; i++) {
      await new Promise((r) => setTimeout(r, stepMs))
      audio.volume = Math.max(0, startVolume - volumeStep * (i + 1))
    }

    this.stopBgm()
  }

  /**
   * SEを再生
   */
  playSe(sound: string): void {
    const audio = new Audio(`/audio/se/${sound}.mp3`)
    audio.volume = this.muted ? 0 : this.seVolume
    audio.play().catch(() => {
      console.warn(`SE play failed: ${sound}`)
    })
  }

  /**
   * ミュート切り替え
   */
  toggleMute(): boolean {
    this.muted = !this.muted
    if (this.bgmElement) {
      this.bgmElement.volume = this.muted ? 0 : this.bgmVolume
    }
    return this.muted
  }

  get isMuted(): boolean {
    return this.muted
  }
}

// シングルトン
export const audioManager = new AudioManagerImpl()
