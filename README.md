# ナゾトキ探偵団 ノベルゲーム (nazotoki-game)

## このディレクトリについて

`game/` は **独立した git リポジトリ** (`shimimasa/nazotoki-game`) である。
親リポジトリ (`ai-shimizu`) の中に配置されているが、`.git` は別管理。
git submodule ではなく、手動で分離運用している。

**重要:** 親リポで `git push` しても、このゲームリポには反映されない。

## 技術スタック

| 項目 | 技術 |
|---|---|
| フレームワーク | Preact 10 |
| ビルドツール | Vite 8 |
| 言語 | TypeScript 5 |
| テスト | Vitest 4 |
| デプロイ先 | Vercel (自動デプロイ) |

## ローカル開発

```bash
cd game
npm install
npm run dev
```

`http://localhost:5173` でブラウザプレビューが開く。

## ビルド

```bash
cd game
npm run build
```

`tsc`（型チェック）→ `vite build` の順で実行され、`dist/` に成果物が出力される。

## テスト

```bash
cd game
npm run test        # 一回実行
npm run test:watch  # ウォッチモード
```

## デプロイ

```bash
cd game
git add .
git commit -m "変更内容"
git push
```

`git push` すると Vercel が自動検知してビルド・デプロイする。

**注意:** 必ず `game/` ディレクトリ内で `git` コマンドを実行すること。親ディレクトリで `git push` してもこのリポには反映されない。

## ディレクトリ構成

```
game/
├── public/
│   ├── scripts/       # ゲームスクリプト（YAML）— 585本
│   ├── images/
│   │   ├── sprites/   # キャラクター立ち絵（WebP、透過）
│   │   └── bg/        # 背景画像（WebP、16:9）
│   └── audio/
│       ├── bgm/       # BGM（MP3）
│       └── se/        # 効果音（MP3）
├── src/
│   ├── App.tsx                    # ルートコンポーネント
│   ├── main.tsx                   # エントリーポイント
│   ├── series-registry.json       # シリーズ一覧（カタログ用）
│   ├── components/                # UIコンポーネント（11個）
│   │   ├── TitleScreen.tsx        #   タイトル画面
│   │   ├── ScenarioSelect.tsx     #   シナリオ選択画面
│   │   ├── GameScreen.tsx         #   ゲームメイン画面
│   │   ├── TextWindow.tsx         #   テキスト表示ウィンドウ
│   │   ├── ChoicePanel.tsx        #   選択肢パネル
│   │   ├── SpriteLayer.tsx        #   キャラクター立ち絵レイヤー
│   │   ├── Background.tsx         #   背景表示
│   │   ├── EffectLayer.tsx        #   演出エフェクト（shake/flash等）
│   │   ├── TitleCard.tsx          #   フェーズ間テロップ
│   │   ├── ResultScreen.tsx       #   結果画面
│   │   └── BacklogPanel.tsx       #   バックログ（読み返し）
│   ├── engine/                    # ゲームエンジン
│   │   ├── SceneManager.ts        #   シーン進行制御
│   │   ├── ScriptLoader.ts        #   YAMLスクリプト読み込み
│   │   ├── AudioManager.ts        #   BGM/SE再生管理
│   │   ├── SaveManager.ts         #   セーブ/ロード
│   │   ├── RubyParser.ts          #   ふりがな（ルビ）解析
│   │   ├── types.ts               #   型定義
│   │   └── __tests__/             #   エンジンのテスト
│   └── styles/
│       └── game.css               # グローバルスタイル
├── GAME_SPEC.md       # ゲーム開発仕様書（YAML形式・素材命名規則等）
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## スクリプト（public/scripts/）

`public/scripts/` には **585本** のYAMLスクリプトが格納されている。
各ファイルは `apps/madamisu/` のシナリオをノベルゲーム形式に変換したもの。

ファイル名は `{シリーズ名}-{番号}.yaml`（例: `archaeology-01.yaml`）。

各YAMLは以下の3セクションで構成される:
- `meta` — タイトル、シリーズ、プレイ時間等のメタ情報
- `characters` — キャラクター定義（名前、カラー、スプライト）
- `scenes` — シーン配列（ナレーション、セリフ、選択肢、演出等）

詳細は `GAME_SPEC.md` を参照。

## 親リポとの関係

```
ai-shimizu/          ← 親リポ (shimimasa/ai-shimizu)
├── apps/madamisu/   ← シナリオ原作（テキスト）
├── game/            ← このリポ (shimimasa/nazotoki-game) ※別の .git
│   └── public/scripts/  ← シナリオをYAMLに変換したもの
└── site/            ← セッションPF (shimimasa/nazotoki-site) ※別の .git
```

- `apps/madamisu/` のシナリオを `/convert-scenario-to-game` スキルでYAMLに変換
- 変換後のYAMLを `game/public/scripts/` に配置
- `game/` 内で `git push` してデプロイ

## よくある注意点

1. **push は必ず `game/` 内で行う** — 親リポの push では反映されない
2. **ビルドエラー時は `tsc` を先に確認** — `npm run build` は型チェック → ビルドの順
3. **スクリプト追加後は `catalog.json` を同期** — `/sync-game-catalog` スキルを使用
4. **画像が無くてもゲームは動く** — スプライト/背景が未配置でもエラーにならない（フォールバック表示）
