# ナゾトキ探偵団 ノベルゲーム 開発仕様

> Phase 0 プロトタイプ時点の仕様。アーキテクチャ安定後に YAML spec に昇格予定。

## リポジトリ・デプロイ

| 項目 | 値 |
|---|---|
| リポジトリ | `shimimasa/nazotoki-game` |
| ディレクトリ | `ai-shimizu/game/`（独自の .git を持つ） |
| デプロイ | Vercel（game/ ルートで Vite ビルド） |
| デプロイ方法 | `cd game && git push` → Vercel 自動デプロイ |
| 技術スタック | Vite + Preact + TypeScript |

**注意:** ai-shimizu の git push では nazotoki-game には反映されない。

## YAMLスクリプト形式

ファイル配置: `game/public/scripts/{slug}.yaml`

### 3セクション構造

```yaml
meta:
  id: scenario-slug       # apps/madamisu/ のスラッグと一致
  title: タイトル
  series: シリーズ名
  volume: 1
  estimatedMinutes: 18

characters:
  character_id:            # 英小文字。apps/madamisu/ のキャラ名ローマ字
    name: 表示名           # 日本語
    color: "#HEX"          # キャラカードのボーダー色
    sprites:
      expression_name: filename.webp   # 表情名 → ファイル名

scenes:
  - id: scene-id
    bg: background-name    # 省略可。前シーンを継続
    bgm: track-name        # 省略可。前シーンを継続
    steps:
      - type: ...          # 下記ステップタイプ参照
```

### ステップタイプと進行ルール

| タイプ | クリック待ち | 説明 |
|---|---|---|
| `narration` | する | ナレーションテキスト表示。タイプライター効果 |
| `dialog` | する | キャラのセリフ表示。expression指定で表情変更可 |
| `choice` | する（選択待ち） | 選択肢表示。選択結果を記録 |
| `title_card` | する（クリック待ち） | フェーズ間テロップ |
| `effect` | する（完了待ち） | shake/flash/fade-in/fade-out |
| `wait` | する（時間待ち） | 指定ms後に自動進行 |
| **`sprite`** | **しない（自動進行）** | 立ち絵の表示/非表示/表情変更 |
| **`sprite_group`** | **しない（自動進行）** | 複数キャラ一括表示 |
| **`bg`** | **しない（自動進行）** | 背景変更 |
| **`bgm`** | **しない（自動進行）** | BGM変更/停止 |
| **`se`** | **しない（自動進行）** | 効果音再生 |

### sprite ルール（重要）

1. **show したキャラは必ず hide する**
   ```yaml
   - type: sprite
     character: hayato
     expression: anxious
     position: left
   # ... セリフ等 ...
   - type: sprite
     character: hayato
     action: hide
   ```

2. **sprite_group では position を設定しない**
   SpriteLayer がキャラ数に応じてインデックスベースで均等配置する。
   ```yaml
   - type: sprite_group
     characters:
       - { id: hayato, expression: anxious }
       - { id: miruku, expression: scared }
       - { id: mamoru, expression: troubled }
       - { id: kotoha, expression: calm }
   ```

3. **sprite_group の前に既存キャラを hide するか、sprite_group が全置換する**
   sprite_group は visibleSprites を完全に置き換える。

4. **異なるシーンでキャラの位置を左右交互にする**
   全員 center は単調。証言パートは左右交互、真実パートも左右交互。
   ```
   ハヤト: left → ミルク: right → マモル: left → コトハ: right
   ```

5. **1シーンに5人以上表示しない**
   4人 + ナレーションが上限。5人必要な場合は分割する。

## キャラカードUI

各キャラクターは「カード」として表示される:
- 半透明の暗いパネル背景
- キャラカラーのボーダー
- 下部にキャラ名タグ
- **発言中キャラ**: 明るく（brightness 1.05）+ ボーダー光る + 名前タグにキャラ色
- **非発言キャラ**: 暗く（brightness 0.65）+ ボーダー薄い
- **ナレーション時**: 全キャラが均等に明るい

## 素材命名規則

### 画像

| 種類 | パス | 命名 | 形式 |
|---|---|---|---|
| 立ち絵 | `public/images/sprites/` | `{character}-{expression}.webp` | webp, 透過背景 |
| 背景 | `public/images/bg/` | `{場所名}.webp` | webp, 16:9 |

立ち絵の白背景除去: `node scripts/remove-bg.mjs`（フラッドフィル方式、しきい値 250）

### 音声

| 種類 | パス | 命名 | 形式 |
|---|---|---|---|
| BGM | `public/audio/bgm/` | `{用途名}.mp3` | mp3, ループ可 |
| SE | `public/audio/se/` | `{音名}.mp3` | mp3, 短尺 |

### 標準BGMセット（シナリオ共通で使い回し可能）

| ファイル名 | 用途 | 調達元 |
|---|---|---|
| `daily-life.mp3` | プロローグ・日常 | 魔王魂 ピアノ18 |
| `exploration.mp3` | 調査パート | DOVA-SYNDROME |
| `tension-quiet.mp3` | 緊張・問いかけ | 魔王魂 ピアノ36 |
| `confession.mp3` | 告白・真実パート | 魔王魂 ピアノ19 |
| `hope.mp3` | エピローグ・希望 | DOVA-SYNDROME Recollections |
| `emotional.mp3` | 感動シーン（手紙等） | 用途に応じて選曲 |

### 標準SEセット

| ファイル名 | 用途 | 調達元 |
|---|---|---|
| `crash.mp3` | 物が壊れる・衝撃 | 効果音ラボ |
| `discover.mp3` | 証拠発見・気づき | 効果音ラボ |
| `click.mp3` | 選択肢決定 | 効果音ラボ |

## シナリオ→ゲーム変換の標準構造

apps/madamisu/ のシナリオを VN スクリプトに変換する際の Act 構造:

```
プロローグ (2分)
  - 事件の発生を演出
  - GM（先生キャラ）が状況を説明
  - タイトルカード表示

Act 1: 調査 (5分)
  - 証拠カード1-3を VN 演出で提示
  - 各カードの重要情報で SE（discover）
  - タイムライン等はナレーションで段階表示

Act 2: 証言/深掘り (5分)
  - 各キャラが1人ずつ証言（左右交互配置）
  - 証拠カード4-5の追加情報
  - 選択肢で「自分の考え」を問う

Act 3: 真実 (5分)
  - 各キャラが真実を告白（左右交互配置）
  - BGM を confession に切り替え
  - 感情的クライマックス

エピローグ (2分)
  - 解決・振り返り
  - BGM を hope に切り替え
  - フェードアウト → 結果画面
```

## Gemini画像生成の安全フィルター対策

子どもキャラの表情で以下の言葉はブロックされる:

| NG（ブロック） | OK（言い換え） |
|---|---|
| crying, tears | speaking earnestly, eyes glistening with emotion |
| scared, frightened, fear | hesitant, looking away shyly, quiet thought |
| anxious, worried, guilt | deep in thought, contemplative |
| pained, troubled | serious expression, introspection |
| regretful, remorse | reflecting quietly, calm reflection |

詳細プロンプト集: `game/docs/image-prompts.md`

## 品質ゲート

ゲームスクリプトの品質チェック項目（`/validate-game-script` で自動検証）:

1. 全 sprite show に対応する hide がある
2. sprite_group で position を設定していない
3. 同一 position に2人以上配置していない
4. 参照する画像・音声ファイルが全て存在する
5. characters セクションの全キャラが scenes 内で使用されている
6. 配置が center に偏っていない（左右交互が望ましい）
7. 1シーンの同時表示キャラ数が5以下
