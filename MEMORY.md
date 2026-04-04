# AIシミズ プロジェクトメモリ

> このファイルはClaude Code専用のセッション間状態。
> ルール → `CLAUDE.md` / 設計原則 → `session_platform_spec.yaml` / 方法論 → `docs/`

## フィードバック
- [1本ずつ丁寧に実装](feedback_sequential_quality.md) — 並列ではなく順次・高品質で
- [タイトルカード・metaにルビ不要](feedback_no_ruby_on_titles.md) — ルビはnarration/dialogのみ。title_card/meta/subtitleには付けない
- [スプライト使い回し不可シリーズ](feedback_sprite_reuse_series.md) — time-travel/popculture/literatureは汎用スプライト不可。ゲーム化は後回し
- [ゲーム化はシリーズ単位でバッチ](feedback_series_batch.md) — 各シリーズから1本ずつではなく、1シリーズを連続完成させる
- [Codex委譲ワークフロー](feedback_codex_workflow.md) — Opus設計+Codex実装でOpus消費70%削減。tokkatsuで実証済み

## プロジェクト
- [ゲームデザイン原則spec作成](project_game_design_spec.md) — Phase 2完了。spec作成済み。Phase 3（機能実装）が次ステップ

## 現在の状態（最終更新: 2026-04-03）

### ★ 即再開用: 次やること

> **シナリオ631本（overview済み）+ゲーム284本。新30シリーズのoverview300本完成！**
>
> **★ 今日やったこと（4/3）:**
> - **30シリーズ×10本＝300シナリオのブループリント+overview.mdを新規作成**
>   - #30-39: space/rights/data/emotion/philosophy/security/body/cyber/classic/experiment
>   - #40-49: weather/energy/archaeology/ocean/farm/language/democracy/architecture/medical/design
>   - #50-59: botany/chemistry/physics/insect/geology/logic/tradition/peace/invention/communication
>
> **★ 次やること（優先順）:**
> 1. **Codex指示書を300本対応に更新** → #30-59 の300シナリオ分（1,800ファイル）
> 2. **Codexに指示書を渡す（人間タスク）**
> 3. **ゲームデザイン原則spec Phase 3 short_term**: GM-01, FE-02, FE-03
> 4. **SE音源ファイルの取得（人間タスク）**: correct.mp3, wrong.mp3, decision.mp3
>
> **新20シリーズ（overview.md作成済み、6ファイル未生成 → Codex待ち）:**
> | # | シリーズ | スラッグ | 教科 | overview | 6ファイル |
> |---|---|---|---|---|---|
> | 30 | 宇宙探偵団 | space | 天文 | ✅ 10本 | ⬜ Codex待ち |
> | 31 | 人権探偵団 | rights | 人権 | ✅ 10本 | ⬜ Codex待ち |
> | 32 | データ探偵団 | data | 統計 | ✅ 10本 | ⬜ Codex待ち |
> | 33 | 感情探偵団 | emotion | 感情教育 | ✅ 10本 | ⬜ Codex待ち |
> | 34 | 哲学探偵団 | philosophy | 哲学 | ✅ 10本 | ⬜ Codex待ち |
> | 35 | 防犯探偵団 | security | 防犯 | ✅ 10本 | ⬜ Codex待ち |
> | 36 | からだ探偵団 | body | 性教育・同意 | ✅ 10本 | ⬜ Codex待ち |
> | 37 | ネット探偵団 | cyber | サイバーセキュリティ | ✅ 10本 | ⬜ Codex待ち |
> | 38 | 古典探偵団 | classic | 古典 | ✅ 10本 | ⬜ Codex待ち |
> | 39 | 実験探偵団 | experiment | 科学的方法 | ✅ 10本 | ⬜ Codex待ち |
> | 40 | 天気探偵団 | weather | 気象 | ✅ 10本 | ⬜ Codex待ち |
> | 41 | エネルギー探偵団 | energy | エネルギー | ✅ 10本 | ⬜ Codex待ち |
> | 42 | 考古学探偵団 | archaeology | 考古学 | ✅ 10本 | ⬜ Codex待ち |
> | 43 | 海洋探偵団 | ocean | 海洋教育 | ✅ 10本 | ⬜ Codex待ち |
> | 44 | 農業探偵団 | farm | 農業 | ✅ 10本 | ⬜ Codex待ち |
> | 45 | ことば探偵団 | language | 言語学 | ✅ 10本 | ⬜ Codex待ち |
> | 46 | 選挙探偵団 | democracy | 主権者教育 | ✅ 10本 | ⬜ Codex待ち |
> | 47 | 建築探偵団 | architecture | まちづくり | ✅ 10本 | ⬜ Codex待ち |
> | 48 | 医療探偵団 | medical | 医療 | ✅ 10本 | ⬜ Codex待ち |
> | 49 | デザイン思考探偵団 | design | デザイン思考 | ✅ 10本 | ⬜ Codex待ち |
> | 50 | 植物探偵団 | botany | 植物 | ✅ 10本 | ⬜ Codex待ち |
> | 51 | 化学探偵団 | chemistry | 化学 | ✅ 10本 | ⬜ Codex待ち |
> | 52 | 物理探偵団 | physics | 物理 | ✅ 10本 | ⬜ Codex待ち |
> | 53 | 昆虫探偵団 | insect | 昆虫 | ✅ 10本 | ⬜ Codex待ち |
> | 54 | 地質探偵団 | geology | 地学 | ✅ 10本 | ⬜ Codex待ち |
> | 55 | 論理学探偵団 | logic | クリティカルシンキング | ✅ 10本 | ⬜ Codex待ち |
> | 56 | 伝統文化探偵団 | tradition | 日本文化 | ✅ 10本 | ⬜ Codex待ち |
> | 57 | 平和探偵団 | peace | 平和学 | ✅ 10本 | ⬜ Codex待ち |
> | 58 | 発明探偵団 | invention | イノベーション | ✅ 10本 | ⬜ Codex待ち |
> | 59 | コミュニケーション探偵団 | communication | コミュニケーション | ✅ 10本 | ⬜ Codex待ち |
>
> **スプライトマッピング（シリーズ共通）:**
> - 音楽探偵団: カオリ→girl-b, ソウタ→boy-b, ヒビキ→boy-a, コトネ→girl-c, 山田先生→teacher-f
> - 美術探偵団: サクラ→girl-b, タクミ→boy-b, ニジカ→girl-a, ユウ→boy-c, 先生→teacher-f
> - 食育探偵団: ミソラ→girl-b, タベル→boy-b, ニコミ→boy-a, サチコ→girl-c, 山田先生→teacher-f
> - 国際理解探偵団: ヒロム→boy-b, マナブ→boy-a, コエル→girl-b, ツムギ→girl-c, 山田先生→teacher-f
> - 体育探偵団: ハヤテ→boy-b, ツバサ→boy-a, カケル→girl-b, ミノリ→girl-c, 山田先生→teacher-f
> - 図工探偵団: ヒナタ→boy-a, ツクル→boy-b, カナデ→girl-b, スミレ→girl-c, 山田先生→teacher-f
> - 特別活動探偵団: ツムギ→girl-b, アユム→boy-a, マモル→boy-b, ノゾミ→girl-c, 山田先生→teacher-f
> - 生命探偵団: イノリ→girl-b, カケル→boy-a, シズク→boy-b, ミコト→girl-c, 山田先生→teacher-f
> - 交通安全探偵団: ハシル→boy-b, ヒカル→boy-a, ミチカ→girl-b, トワ→girl-c, 山田先生→teacher-f
> - 宇宙探偵団: ヒカリ→boy-a, ホシノ→boy-b, ツキミ→girl-b, ソラ→girl-c, 山田先生→teacher-f
> - 天気探偵団: ソラ→boy-a, カゼル→boy-b, クモリ→girl-b, アメネ→girl-c, 山田先生→teacher-f
> - エネルギー探偵団: デンタ→boy-a, ヒカル→boy-b, ネツミ→girl-b, チカラ→girl-c, 山田先生→teacher-f
> - 考古学探偵団: イシノ→boy-a, ホリベ→boy-b, ツチカ→girl-b, フミコ→girl-c, 山田先生→teacher-f
> - 海洋探偵団: シオル→boy-a, ミナト→boy-b, ナミ→girl-b, カイ→girl-c, 山田先生→teacher-f
> - 農業探偵団: タネ→boy-a, ツチ→boy-b, ミノリ→girl-b, カリナ→girl-c, 山田先生→teacher-f
> - ことば探偵団: フミ→boy-a, ツヅリ→boy-b, コトハ→girl-b, ヨミ→girl-c, 山田先生→teacher-f
> - 選挙探偵団: ヒョウ→boy-a, ギカイ→boy-b, タミ→girl-b, ノゾミ→girl-c, 山田先生→teacher-f
> - 建築探偵団: タテル→boy-a, ハリ→boy-b, ノキ→girl-b, イズミ→girl-c, 山田先生→teacher-f
> - 医療探偵団: ナオル→boy-a, ミブキ→boy-b, イヤシ→girl-b, ゲンキ→girl-c, 山田先生→teacher-f
> - デザイン思考探偵団: ツクル→boy-a, ハカル→boy-b, カナエ→girl-b, ミナオス→girl-c, 山田先生→teacher-f
> - 植物探偵団: ネコ→boy-a, モリ→boy-b, ハナ→girl-b, ツボミ→girl-c, 山田先生→teacher-f
> - 化学探偵団: モル→boy-a, ソウダ→boy-b, リトマ→girl-b, ネーサ→girl-c, 山田先生→teacher-f
> - 物理探偵団: チカラ→boy-a, ナミ→boy-b, ヒカル→girl-b, オモリ→girl-c, 山田先生→teacher-f
> - 昆虫探偵団: ムシ→boy-a, ハネ→boy-b, サナギ→girl-b, ミツ→girl-c, 山田先生→teacher-f
> - 地質探偵団: イシカワ→boy-a, マグム→boy-b, スナコ→girl-b, チソウ→girl-c, 山田先生→teacher-f
> - 論理学探偵団: ロン→boy-a, コト→boy-b, リカ→girl-b, カナ→girl-c, 山田先生→teacher-f
> - 伝統文化探偵団: ツムギ→boy-a, カナデ→boy-b, イブキ→girl-b, コトノ→girl-c, 山田先生→teacher-f
> - 平和探偵団: ナギ→boy-a, ヒビキ→boy-b, ミワ→girl-b, コトハ→girl-c, 山田先生→teacher-f
> - 発明探偵団: ソウゾウ→boy-a, カイゼン→boy-b, ハッキン→girl-b, アイデア→girl-c, 山田先生→teacher-f
> - コミュニケーション探偵団: キク→boy-a, マナブ→boy-b, コトバ→girl-b, ツタエ→girl-c, 山田先生→teacher-f

### シリーズ総合計: 631本（完成331本 + overview only 300本）

| # | シリーズ | スラッグ | 教科 | シナリオ | ゲーム化 |
|---|---|---|---|---|---|
| 1 | タイムトラベル探偵団 | time-travel | 歴史 | 12 | 1（スプライト不可） |
| 2 | 名作文学ミステリー | literature | 国語 | 15 | 0（スプライト不可） |
| 3 | マンガ教養ミステリー | popculture | ポップカルチャー | 20 | 0（スプライト不可） |
| 4 | 数字の迷宮 | math | 算数 | 20 | 20 |
| 5 | サイエンス捜査班 | science | 理科 | 18 | 18 |
| 6 | 答えのない法廷 | moral | 道徳 | 15 | 15 |
| 7 | 地図探偵団 | geography | 社会（地理） | 10 | 10 |
| 8 | バグ探偵団 | programming | プログラミング | 10 | 10 |
| 9 | 情報モラル探偵団 | digital | 情報モラル | 10 | 10 |
| 10 | お金の探偵団 | money | 金融教育 | 10 | 10 |
| 11 | 英語探偵団 | english | 英語 | 10 | 10 |
| 12 | 保健探偵団 | health | 保健 | 10 | 10 |
| 13 | 防災探偵団 | disaster | 防災 | 10 | 10 |
| 14 | 公民探偵団 | civics | 公民 | 10 | 10 |
| 15 | 家庭科探偵団 | homeec | 家庭科 | 10 | 10 |
| 16 | ESD探偵団 | esd | 環境 | 10 | 10 |
| 17 | キャリア探偵団 | career | キャリア | 10 | 10 |
| 18 | 数学深化探偵団 | math2 | 数学 | 10 | 10 |
| 19 | 音楽探偵団 | music | 音楽 | 10 | 10 |
| 20 | 美術探偵団 | art | 美術 | 10 | 10 |
| 21 | 食育探偵団 | food | 食育 | 10 | 10 |
| 22 | 国際理解探偵団 | global | 国際理解 | 10 | 10 |
| 23 | 体育探偵団 | sports | 体育 | 10 | 10 |
| 24 | 図工探偵団 | craft | 図工 | 10 | 10 |
| 25 | メディアリテラシー探偵団 | media | メディアリテラシー | 10 | 10 |
| 26 | 福祉探偵団 | welfare | 福祉 | 10 | 10 |
| 27 | 特別活動探偵団 | tokkatsu | 特別活動 | 10 | 10 |
| 28 | 生命探偵団 | life | 生命・動物 | 10 | 10 |
| 29 | 交通安全探偵団 | traffic | 交通安全 | 10 | 10 |
| 30 | 宇宙探偵団 | space | 天文 | 10(※) | 0 |
| 31 | 人権探偵団 | rights | 人権 | 10(※) | 0 |
| 32 | データ探偵団 | data | 統計 | 10(※) | 0 |
| 33 | 感情探偵団 | emotion | 感情教育 | 10(※) | 0 |
| 34 | 哲学探偵団 | philosophy | 哲学 | 10(※) | 0 |
| 35 | 防犯探偵団 | security | 防犯 | 10(※) | 0 |
| 36 | からだ探偵団 | body | 性教育・同意 | 10(※) | 0 |
| 37 | ネット探偵団 | cyber | サイバーセキュリティ | 10(※) | 0 |
| 38 | 古典探偵団 | classic | 古典 | 10(※) | 0 |
| 39 | 実験探偵団 | experiment | 科学的方法 | 10(※) | 0 |
| 40 | 天気探偵団 | weather | 気象 | 10(※) | 0 |
| 41 | エネルギー探偵団 | energy | エネルギー | 10(※) | 0 |
| 42 | 考古学探偵団 | archaeology | 考古学 | 10(※) | 0 |
| 43 | 海洋探偵団 | ocean | 海洋教育 | 10(※) | 0 |
| 44 | 農業探偵団 | farm | 農業 | 10(※) | 0 |
| 45 | ことば探偵団 | language | 言語学 | 10(※) | 0 |
| 46 | 選挙探偵団 | democracy | 主権者教育 | 10(※) | 0 |
| 47 | 建築探偵団 | architecture | まちづくり | 10(※) | 0 |
| 48 | 医療探偵団 | medical | 医療 | 10(※) | 0 |
| 49 | デザイン思考探偵団 | design | デザイン思考 | 10(※) | 0 |
| 50 | 植物探偵団 | botany | 植物 | 10(※) | 0 |
| 51 | 化学探偵団 | chemistry | 化学 | 10(※) | 0 |
| 52 | 物理探偵団 | physics | 物理 | 10(※) | 0 |
| 53 | 昆虫探偵団 | insect | 昆虫 | 10(※) | 0 |
| 54 | 地質探偵団 | geology | 地学 | 10(※) | 0 |
| 55 | 論理学探偵団 | logic | クリティカルシンキング | 10(※) | 0 |
| 56 | 伝統文化探偵団 | tradition | 日本文化 | 10(※) | 0 |
| 57 | 平和探偵団 | peace | 平和学 | 10(※) | 0 |
| 58 | 発明探偵団 | invention | イノベーション | 10(※) | 0 |
| 59 | コミュニケーション探偵団 | communication | コミュニケーション | 10(※) | 0 |
| | **合計** | | | **631** | **284** |

(※) overview.mdのみ。残り6ファイルはCodex生成待ち

### ゲーム化未完了リスト

| シリーズ | 未変換Vol | 本数 | ブロッカー |
|---|---|---|---|
| time-travel | Vol.2-12 | 11 | スプライト不可 |
| literature | Vol.1-15 | 15 | スプライト不可 |
| popculture | Vol.1-20 | 20 | スプライト不可 |
**スプライト不可で後回し**: 46本 / **変換待ち**: 0本

### 技術メモ

- 詳細 → `memory/novel-game.md`（※古い可能性あり、コード確認推奨）
- ゲーム: game/ は ai-shimizu とは別の git リポジトリ。`cd game && git push` で nazotoki-game に反映（push待ち）
- catalog.json: 284エントリ（全YAMLファイルと完全同期済み）
- ビルド: `cd game && npm run build`（tsc + vite）
- UIラベル: もどる/ふりがな/じどう（2026-03-27更新済み）

### 人間タスク（継続）
- **Codexに100シナリオ指示書を渡す**: `docs/templates/codex-batch-scenario-100.md`（最優先）
- SE音源3つのDL（correct.mp3, wrong.mp3, decision.mp3）→ 効果音ラボ
- 汎用スプライト54枚のGemini画像生成 + BGM/SEダウンロード + 背景画像9枚
- NPSアンケートをGoogle Formsで作成
- 別の教員にセッション実施を依頼（最重要）
