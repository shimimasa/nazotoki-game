# 汎用スプライトプール仕様

> 173本のシナリオ（15シリーズ）を共通の立ち絵セットでカバーする設計。

## 概要

各シナリオのキャラクターは固有だが、外見属性は「現代の小学生」で共通。
8種の汎用素体 × 6表情 = **48枚**で全シナリオに対応する。

## 素体一覧

### 男子

| ID | 外見 | 性格タイプ | カラー | 使用頻度 |
|---|---|---|---|---|
| `boy-a` | 短髪スパイキー・活発 | 元気・ムードメーカー | 赤系 | 低 |
| `boy-b` | メガネ・整った黒髪 | 知的・情報型・論理的 | 青系 | 高（15シナリオ） |
| `boy-c` | やや長め暗髪・柔らか | おっとり・優しい・責任感 | 緑系 | 中 |
| `boy-d` | 短い茶髪・スポーティ | 行動派・元気・直感型 | オレンジ系 | 高（13シナリオ） |

### 女子

| ID | 外見 | 性格タイプ | カラー | 使用頻度 |
|---|---|---|---|---|
| `girl-a` | ポニーテール・茶髪 | 元気・サポート・感情的 | ピンク系 | 中（6シナリオ） |
| `girl-b` | ボブカット・紺/黒髪 | おとなしい・観察型・慎重 | 紫系 | 高（11シナリオ） |
| `girl-c` | ロングヘア・黒髪リボン | しっかり者・リーダー・感情型 | 赤/茶系 | 高（9シナリオ） |
| `girl-d` | ショートカット・明るい髪 | 活発・アクション型・好奇心 | 黄緑系 | 低 |

### 教師（GM用）

| ID | 外見 | 用途 |
|---|---|---|
| `teacher-f` | ロングヘア・メガネ・白衣 | 女性教師/GM |
| `teacher-m` | 短髪・ジャケット | 男性教師/GM |

## 表情セット（全素体共通）

| Expression ID | 表示 | 用途 |
|---|---|---|
| `normal` | ニュートラル・軽い微笑み | 通常の会話 |
| `happy` | 笑顔 | 嬉しい場面 |
| `thinking` | 考え込む | 推理・分析場面 |
| `worried` | 不安・戸惑い | 困った場面 |
| `surprised` | 驚き | 証拠発見・意外な展開 |
| `determined` | 決意・真剣 | 告白・クライマックス |

## ファイル命名規則

```
game/public/images/sprites/
├── boy-a-normal.webp
├── boy-a-happy.webp
├── boy-a-thinking.webp
├── boy-a-worried.webp
├── boy-a-surprised.webp
├── boy-a-determined.webp
├── boy-b-normal.webp
│   ... (同パターン)
├── girl-d-determined.webp
├── teacher-f-normal.webp
├── teacher-f-happy.webp
├── teacher-f-thinking.webp
├── teacher-m-normal.webp
├── teacher-m-happy.webp
└── teacher-m-thinking.webp
```

合計: 8素体 × 6表情 + 2教師 × 3表情 = **54枚**

## YAMLでの使い方

```yaml
characters:
  haruki:                          # シナリオ固有のキャラID
    name: ハルキ                   # 表示名（シナリオごとに異なる）
    color: "#4A90D9"               # キャラカラー（シナリオごとに異なる）
    sprites:                       # 汎用素体を参照
      normal: boy-b-normal.webp
      happy: boy-b-happy.webp
      thinking: boy-b-thinking.webp
      worried: boy-b-worried.webp
      surprised: boy-b-surprised.webp
      determined: boy-b-determined.webp
  mio:
    name: ミオ
    color: "#E91E63"
    sprites:
      normal: girl-c-normal.webp
      happy: girl-c-happy.webp
      thinking: girl-c-thinking.webp
      worried: girl-c-worried.webp
      surprised: girl-c-surprised.webp
      determined: girl-c-determined.webp
```

## マッピングルール

シナリオのキャラクター性格から素体を自動選定:

| 性格キーワード | 男子 → | 女子 → |
|---|---|---|
| 元気・活発・ムードメーカー | boy-a | girl-a / girl-d |
| 知的・論理的・情報型・データ | boy-b | girl-b |
| 優しい・責任感・真面目・委員長 | boy-c | girl-c |
| スポーツ・行動派・直感・元気 | boy-d | girl-a |
| おとなしい・観察型・慎重・記録 | boy-b | girl-b |
| しっかり者・リーダー・感情型 | boy-c | girl-c |
| 好奇心・冒険・工作 | boy-a | girl-d |

## BGM/SEの構成（シナリオ別）

```
game/public/audio/
├── bgm/
│   ├── common/                    # 共通BGM（既存）
│   │   ├── daily-life.mp3
│   │   ├── exploration.mp3
│   │   ├── tension-quiet.mp3
│   │   ├── confession.mp3
│   │   └── hope.mp3
│   ├── science-01/                # シナリオ固有BGM
│   │   ├── lab-theme.mp3
│   │   └── mystery.mp3
│   └── ...
├── se/
│   ├── common/                    # 共通SE
│   │   ├── crash.mp3
│   │   ├── discover.mp3
│   │   └── click.mp3
│   └── ...
```

YAMLでの参照:
```yaml
# 共通BGMを使う場合
- type: bgm
  track: common/daily-life

# シナリオ固有BGMを使う場合
- type: bgm
  track: science-01/lab-theme
```

## 対応シリーズ（15シリーズ / 173本）

汎用スプライトで対応可能:
moral, math, science, geography, programming, digital, money, english, health, disaster, civics, homeec, esd, career, math2

個別立ち絵が必要（後回し）:
time-travel, literature, popculture

## 背景画像（シナリオごとに人間が用意）

汎用背景プール + シナリオ固有背景:

```
game/public/images/bg/
├── classroom.webp          # 汎用: 教室
├── hallway.webp            # 汎用: 廊下
├── schoolyard.webp         # 汎用: 校庭
├── library.webp            # 汎用: 図書室
├── science-lab.webp        # 汎用: 理科室
├── gym.webp                # 汎用: 体育館
├── cooking-room.webp       # 汎用: 調理室
├── park.webp               # 汎用: 公園
├── street.webp             # 汎用: 商店街
├── dramatic-sky.webp       # 汎用: クライマックス用
└── {scenario-slug}/        # シナリオ固有（人間が追加）
    └── *.webp
```
