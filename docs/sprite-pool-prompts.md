# 汎用スプライトプール — Gemini画像生成プロンプト集

> 8素体 × 6表情 + 2教師 × 3表情 = **54枚**

## 共通スタイル指示（全プロンプトの冒頭に付ける）

```
Japanese anime style illustration, visual novel character sprite,
clean lineart, soft cel-shading, warm color palette,
upper body to knee shot, white background,
no text, no watermark, consistent art style,
elementary school student character design, age 10-11,
friendly and approachable
```

## 生成時の注意

| 項目 | 指定 |
|---|---|
| 立ち絵サイズ | 768×1024px 以上推奨 |
| 保存形式 | webp（透過背景） |
| 白背景除去 | 生成後に `node scripts/remove-bg.mjs` で透過処理 |
| 一貫性 | 同じツール・同セッションで全素体を生成すると統一感が出る |
| 安全フィルター | 子どもの「泣き/怯え」はブロックされる → 下記の安全な表現を使用 |

### Gemini安全フィルター対策

| NG（ブロック） | OK（言い換え） |
|---|---|
| crying, tears | speaking earnestly, eyes glistening with emotion |
| scared, frightened | hesitant, looking away shyly |
| anxious, worried | uncertain, deep in thought |
| pained, troubled | serious expression, introspection |
| guilty, remorse | reflecting quietly, calm reflection |

---

## boy-a（短髪スパイキー・活発・赤系）

**キャラ設定:** 明るくて場を盛り上げるムードメーカー。短い茶髪がツンツン立っている。赤いTシャツ。

### boy-a-normal.webp
```
Japanese anime style, visual novel character sprite,
a cheerful energetic elementary school boy, age 10-11,
short spiky light brown hair, bright red T-shirt with white collar,
confident friendly smile, standing with a relaxed natural pose,
warm brown eyes, slightly tanned skin, lively aura,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-a-happy.webp
```
Japanese anime style, visual novel character sprite,
a cheerful elementary school boy laughing warmly, age 10-11,
short spiky light brown hair, bright red T-shirt with white collar,
wide bright smile, eyes slightly closed with joy,
one hand raised in a small wave or thumbs up gesture,
warm brown eyes, slightly tanned skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-a-thinking.webp
```
Japanese anime style, visual novel character sprite,
an elementary school boy tilting his head in thought, age 10-11,
short spiky light brown hair, bright red T-shirt with white collar,
one hand on chin, eyes looking upward in consideration,
curious pondering expression, head tilted slightly,
warm brown eyes, slightly tanned skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-a-worried.webp
```
Japanese anime style, visual novel character sprite,
an elementary school boy with an uncertain expression, age 10-11,
short spiky light brown hair, bright red T-shirt with white collar,
hesitant look, eyebrows slightly raised, looking to the side,
one hand rubbing the back of his neck, shoulders slightly tense,
warm brown eyes showing uncertainty,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-a-surprised.webp
```
Japanese anime style, visual novel character sprite,
an elementary school boy looking surprised, age 10-11,
short spiky light brown hair, bright red T-shirt with white collar,
eyes wide open, mouth slightly open in surprise,
both hands slightly raised in astonishment, leaning back slightly,
warm brown eyes wide with amazement,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-a-determined.webp
```
Japanese anime style, visual novel character sprite,
an elementary school boy with a resolute brave expression, age 10-11,
short spiky light brown hair, bright red T-shirt with white collar,
firm determined look, mouth set in resolve, looking straight ahead,
both hands clenched at sides showing strong will,
warm brown eyes burning with conviction,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

---

## boy-b（メガネ・知的・青系）

**キャラ設定:** 冷静で論理的。データや数字に強い。整った黒髪。丸メガネ。青いベスト。

### boy-b-normal.webp
```
Japanese anime style, visual novel character sprite,
a calm intellectual elementary school boy, age 10-11,
neat short black hair parted to the side, round thin-framed glasses,
blue vest over white collared shirt,
calm composed expression, small polite smile, good posture,
dark intelligent eyes behind glasses, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### boy-b-happy.webp
```
Japanese anime style, visual novel character sprite,
an intellectual elementary school boy smiling with satisfaction, age 10-11,
neat short black hair parted to the side, round thin-framed glasses,
blue vest over white collared shirt,
gentle warm smile, eyes slightly narrowed with contentment,
one hand adjusting glasses lightly,
dark intelligent eyes, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### boy-b-thinking.webp
```
Japanese anime style, visual novel character sprite,
an intellectual elementary school boy deep in analysis, age 10-11,
neat short black hair parted to the side, round thin-framed glasses,
blue vest over white collared shirt,
serious contemplative expression, one finger pushing up glasses,
eyes narrowed slightly in focused thought, looking downward,
dark intelligent eyes in deep concentration, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### boy-b-worried.webp
```
Japanese anime style, visual novel character sprite,
an intellectual elementary school boy looking uncertain, age 10-11,
neat short black hair parted to the side, round thin-framed glasses,
blue vest over white collared shirt,
hesitant expression, eyebrows slightly furrowed, looking to the side,
one hand holding the other arm, shoulders slightly inward,
dark eyes behind glasses showing quiet concern, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### boy-b-surprised.webp
```
Japanese anime style, visual novel character sprite,
an intellectual elementary school boy looking astonished, age 10-11,
neat short black hair parted to the side, round thin-framed glasses,
blue vest over white collared shirt,
eyes wide behind glasses, mouth open in surprise,
one hand reaching up to adjust glasses in shock,
dark intelligent eyes wide with realization, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### boy-b-determined.webp
```
Japanese anime style, visual novel character sprite,
an intellectual elementary school boy with resolute clarity, age 10-11,
neat short black hair parted to the side, round thin-framed glasses,
blue vest over white collared shirt,
calm resolute expression, chin slightly raised, looking straight forward,
glasses catching a glint of light, standing tall with conviction,
dark intelligent eyes showing quiet resolve, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

---

## boy-c（おっとり・優しい・緑系）

**キャラ設定:** 真面目で責任感がある。やや長めの暗髪。緑のセーター。穏やかな雰囲気。

### boy-c-normal.webp
```
Japanese anime style, visual novel character sprite,
a gentle responsible elementary school boy, age 10-11,
slightly longer dark brown hair swept to the side, green sweater over white shirt,
calm gentle expression, warm small smile, relaxed standing pose,
soft dark green eyes, fair skin, trustworthy class president aura,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-c-happy.webp
```
Japanese anime style, visual novel character sprite,
a gentle elementary school boy smiling warmly, age 10-11,
slightly longer dark brown hair swept to the side, green sweater over white shirt,
warm heartfelt smile, eyes gentle and kind,
hands clasped together in front, pleased and relieved expression,
soft dark green eyes, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-c-thinking.webp
```
Japanese anime style, visual novel character sprite,
a gentle elementary school boy in serious thought, age 10-11,
slightly longer dark brown hair swept to the side, green sweater over white shirt,
thoughtful serious expression, one hand placed over his chest,
gazing downward in careful consideration,
soft dark green eyes in quiet introspection, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-c-worried.webp
```
Japanese anime style, visual novel character sprite,
a gentle elementary school boy looking uncertain, age 10-11,
slightly longer dark brown hair swept to the side, green sweater over white shirt,
uncertain hesitant expression, looking slightly downward,
one hand gripping the sleeve of his other arm,
soft dark green eyes showing quiet unease, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-c-surprised.webp
```
Japanese anime style, visual novel character sprite,
a gentle elementary school boy looking taken aback, age 10-11,
slightly longer dark brown hair swept to the side, green sweater over white shirt,
eyes wide with surprise, mouth slightly open,
both hands slightly raised in front of chest,
soft dark green eyes showing genuine astonishment, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-c-determined.webp
```
Japanese anime style, visual novel character sprite,
a gentle elementary school boy speaking with quiet conviction, age 10-11,
slightly longer dark brown hair swept to the side, green sweater over white shirt,
calm resolute expression, speaking earnestly, looking straight forward,
one hand placed firmly over his heart showing sincerity,
soft dark green eyes burning with quiet determination, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

---

## boy-d（スポーティ・元気・オレンジ系）

**キャラ設定:** 体を動かすのが好き。短い茶髪。オレンジのスポーツジャケット。日焼け肌。

### boy-d-normal.webp
```
Japanese anime style, visual novel character sprite,
an athletic energetic elementary school boy, age 10-11,
short brown hair, orange sporty zip-up jacket over white T-shirt,
confident grin, standing with arms relaxed at sides,
bright brown eyes, slightly tanned skin, sporty build,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-d-happy.webp
```
Japanese anime style, visual novel character sprite,
an athletic elementary school boy laughing energetically, age 10-11,
short brown hair, orange sporty zip-up jacket over white T-shirt,
big bright grin, eyes crinkled with happiness,
one fist raised in a cheerful pump, energetic stance,
bright brown eyes, slightly tanned skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-d-thinking.webp
```
Japanese anime style, visual novel character sprite,
an athletic elementary school boy trying hard to think, age 10-11,
short brown hair, orange sporty zip-up jacket over white T-shirt,
concentrating expression, arms crossed, head tilted to one side,
eyes looking upward with effort, not his usual comfort zone,
bright brown eyes in unusual concentration, slightly tanned skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-d-worried.webp
```
Japanese anime style, visual novel character sprite,
an athletic elementary school boy looking unsure, age 10-11,
short brown hair, orange sporty zip-up jacket over white T-shirt,
uncertain expression, scratching the back of his head,
looking to the side with hesitation, unusual for his confident nature,
bright brown eyes showing uncertainty, slightly tanned skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-d-surprised.webp
```
Japanese anime style, visual novel character sprite,
an athletic elementary school boy startled in surprise, age 10-11,
short brown hair, orange sporty zip-up jacket over white T-shirt,
eyes wide, mouth open, jumping back slightly,
both hands up in a startled reflex, very animated reaction,
bright brown eyes wide with shock, slightly tanned skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### boy-d-determined.webp
```
Japanese anime style, visual novel character sprite,
an athletic elementary school boy fired up with resolve, age 10-11,
short brown hair, orange sporty zip-up jacket over white T-shirt,
fierce determined expression, fists clenched at his sides,
leaning slightly forward with intensity, eyes blazing,
bright brown eyes burning with determination, slightly tanned skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

---

## girl-a（ポニーテール・元気・ピンク系）

**キャラ設定:** 明るくて感情豊か。茶色のポニーテール。ピンクのカーディガン。面倒見がいい。

### girl-a-normal.webp
```
Japanese anime style, visual novel character sprite,
a cheerful caring elementary school girl, age 10-11,
brown hair in a high ponytail with a small pink hair tie,
pink cardigan over white blouse with a small ribbon,
bright friendly smile, hands clasped in front, upright posture,
warm brown eyes, healthy complexion, approachable aura,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-a-happy.webp
```
Japanese anime style, visual novel character sprite,
a cheerful elementary school girl beaming with joy, age 10-11,
brown hair in a high ponytail with a small pink hair tie,
pink cardigan over white blouse with a small ribbon,
radiantly happy smile, eyes sparkling, tilting head slightly,
hands together in delight,
warm brown eyes shining, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-a-thinking.webp
```
Japanese anime style, visual novel character sprite,
a cheerful elementary school girl pondering carefully, age 10-11,
brown hair in a high ponytail with a small pink hair tie,
pink cardigan over white blouse with a small ribbon,
thoughtful expression, one finger on her cheek, looking upward,
head tilted in consideration,
warm brown eyes in gentle thought, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-a-worried.webp
```
Japanese anime style, visual novel character sprite,
a caring elementary school girl looking concerned for others, age 10-11,
brown hair in a high ponytail with a small pink hair tie,
pink cardigan over white blouse with a small ribbon,
concerned empathetic expression, hands held together near chest,
eyebrows slightly raised, looking at someone with care,
warm brown eyes showing empathy, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-a-surprised.webp
```
Japanese anime style, visual novel character sprite,
a cheerful elementary school girl caught off guard, age 10-11,
brown hair in a high ponytail with a small pink hair tie,
pink cardigan over white blouse with a small ribbon,
eyes wide and round, mouth in a small O shape,
both hands raised near her face in surprise,
warm brown eyes wide with astonishment, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-a-determined.webp
```
Japanese anime style, visual novel character sprite,
a caring elementary school girl speaking up bravely, age 10-11,
brown hair in a high ponytail with a small pink hair tie,
pink cardigan over white blouse with a small ribbon,
earnest resolute expression, fists clenched in front of her chest,
eyes bright with conviction, chin raised,
warm brown eyes burning with resolve, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

---

## girl-b（ボブカット・おとなしい・紫系）

**キャラ設定:** 物静かで観察力が鋭い。紺色のボブカット。ラベンダーのトップス。控えめだが芯がある。

### girl-b-normal.webp
```
Japanese anime style, visual novel character sprite,
a quiet observant elementary school girl, age 10-11,
neat dark navy bob cut hair with straight bangs,
lavender long-sleeve top over white collar,
calm quiet expression, small reserved smile, hands folded in front,
soft violet eyes, fair skin, neat and tidy appearance,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-b-happy.webp
```
Japanese anime style, visual novel character sprite,
a quiet elementary school girl showing a rare gentle smile, age 10-11,
neat dark navy bob cut hair with straight bangs,
lavender long-sleeve top over white collar,
soft genuine smile, eyes gently closed in contentment,
hands still folded in front, subtle but warm happiness,
soft violet eyes, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-b-thinking.webp
```
Japanese anime style, visual novel character sprite,
a quiet observant elementary school girl analyzing carefully, age 10-11,
neat dark navy bob cut hair with straight bangs,
lavender long-sleeve top over white collar,
focused analytical expression, one hand touching her chin,
eyes narrowed slightly in careful observation,
soft violet eyes in deep concentration, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-b-worried.webp
```
Japanese anime style, visual novel character sprite,
a quiet elementary school girl looking hesitant, age 10-11,
neat dark navy bob cut hair with straight bangs,
lavender long-sleeve top over white collar,
hesitant reserved expression, looking slightly away,
one hand holding the other arm, shoulders drawn inward,
soft violet eyes gazing downward in quiet thought, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-b-surprised.webp
```
Japanese anime style, visual novel character sprite,
a quiet elementary school girl with eyes wide in realization, age 10-11,
neat dark navy bob cut hair with straight bangs,
lavender long-sleeve top over white collar,
eyes wide with sudden understanding, mouth slightly parted,
one hand raised near her mouth in quiet surprise,
soft violet eyes bright with discovery, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-b-determined.webp
```
Japanese anime style, visual novel character sprite,
a quiet elementary school girl speaking with quiet resolve, age 10-11,
neat dark navy bob cut hair with straight bangs,
lavender long-sleeve top over white collar,
calm resolute expression, looking straight forward,
hands held firmly together, standing taller than usual,
soft violet eyes with quiet inner strength, fair skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

---

## girl-c（ロングヘア・しっかり者・赤茶系）

**キャラ設定:** 責任感が強くリーダー気質。長い黒髪に赤いリボン。ベージュのセーター。落ち着いている。

### girl-c-normal.webp
```
Japanese anime style, visual novel character sprite,
a composed capable elementary school girl, age 10-11,
long straight black hair with a red ribbon headband,
beige sweater over white school blouse,
composed neutral expression, one hand on hip, confident stance,
amber brown eyes, healthy complexion, natural leader aura,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-c-happy.webp
```
Japanese anime style, visual novel character sprite,
a composed elementary school girl smiling with satisfaction, age 10-11,
long straight black hair with a red ribbon headband,
beige sweater over white school blouse,
warm satisfied smile, arms relaxed, head tilted slightly,
eyes soft with genuine pleasure,
amber brown eyes, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-c-thinking.webp
```
Japanese anime style, visual novel character sprite,
a composed elementary school girl considering carefully, age 10-11,
long straight black hair with a red ribbon headband,
beige sweater over white school blouse,
thoughtful serious expression, arms crossed lightly,
looking straight ahead with a calculating gaze,
amber brown eyes in focused thought, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-c-worried.webp
```
Japanese anime style, visual novel character sprite,
a composed elementary school girl showing rare vulnerability, age 10-11,
long straight black hair with a red ribbon headband,
beige sweater over white school blouse,
uncertain expression breaking her usual composure, looking slightly down,
one hand gripping her other arm, a crack in her confident facade,
amber brown eyes showing quiet concern, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-c-surprised.webp
```
Japanese anime style, visual novel character sprite,
a composed elementary school girl caught off guard, age 10-11,
long straight black hair with a red ribbon headband,
beige sweater over white school blouse,
eyes widened in surprise, one hand raised near her shoulder,
a rare break in her composure, taken aback,
amber brown eyes wide with astonishment, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

### girl-c-determined.webp
```
Japanese anime style, visual novel character sprite,
a composed elementary school girl speaking with authority, age 10-11,
long straight black hair with a red ribbon headband,
beige sweater over white school blouse,
firm resolute expression, standing tall, chin raised,
one hand extended slightly in a decisive gesture,
amber brown eyes blazing with determination, healthy complexion,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly right
```

---

## girl-d（ショートカット・活発・黄緑系）

**キャラ設定:** 好奇心旺盛で冒険好き。明るいショートカット。黄緑のパーカー。自由奔放。

### girl-d-normal.webp
```
Japanese anime style, visual novel character sprite,
a curious adventurous elementary school girl, age 10-11,
short messy light brown hair with a small hair clip,
yellow-green hoodie over a white T-shirt,
bright curious smile, hands in hoodie pockets, casual relaxed stance,
lively green eyes, lightly freckled skin, tomboy energy,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### girl-d-happy.webp
```
Japanese anime style, visual novel character sprite,
an adventurous elementary school girl grinning excitedly, age 10-11,
short messy light brown hair with a small hair clip,
yellow-green hoodie over a white T-shirt,
excited wide grin, eyes sparkling with enthusiasm,
one fist pumped upward in celebration,
lively green eyes, lightly freckled skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### girl-d-thinking.webp
```
Japanese anime style, visual novel character sprite,
an adventurous elementary school girl puzzling over something, age 10-11,
short messy light brown hair with a small hair clip,
yellow-green hoodie over a white T-shirt,
squinting expression, one hand on her head, the other on hip,
looking sideways with intense curiosity,
lively green eyes narrowed in thought, lightly freckled skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### girl-d-worried.webp
```
Japanese anime style, visual novel character sprite,
an adventurous elementary school girl looking unusually uncertain, age 10-11,
short messy light brown hair with a small hair clip,
yellow-green hoodie over a white T-shirt,
unusually quiet expression, looking to the side,
hands pulled into hoodie sleeves, shoulders slightly hunched,
lively green eyes dimmed with uncertainty, lightly freckled skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### girl-d-surprised.webp
```
Japanese anime style, visual novel character sprite,
an adventurous elementary school girl jumping in surprise, age 10-11,
short messy light brown hair with a small hair clip,
yellow-green hoodie over a white T-shirt,
wide eyes, mouth open in amazement, leaning back,
both hands up in an animated startled reaction,
lively green eyes wide with shock, lightly freckled skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

### girl-d-determined.webp
```
Japanese anime style, visual novel character sprite,
an adventurous elementary school girl with fierce resolve, age 10-11,
short messy light brown hair with a small hair clip,
yellow-green hoodie over a white T-shirt,
fierce grin, one fist clenched in front of her, leaning forward,
eyes blazing with excitement and determination,
lively green eyes burning with resolve, lightly freckled skin,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing slightly left
```

---

## teacher-f（女性教師 / GM）

**キャラ設定:** 30代前半。穏やかだが芯がある。ロングヘア。メガネ。白衣。

### teacher-f-normal.webp
```
Japanese anime style, visual novel character sprite,
a kind young female teacher, age early 30s,
long dark hair tied loosely, thin-framed glasses,
blue blouse with white lab coat,
warm gentle smile, hands together in front,
kind intelligent eyes, professional yet approachable,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing forward
```

### teacher-f-happy.webp
```
Japanese anime style, visual novel character sprite,
a kind young female teacher smiling encouragingly, age early 30s,
long dark hair tied loosely, thin-framed glasses,
blue blouse with white lab coat,
warm encouraging smile, eyes soft with pride,
hands clasped together in delight,
kind intelligent eyes showing encouragement,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing forward
```

### teacher-f-thinking.webp
```
Japanese anime style, visual novel character sprite,
a kind young female teacher considering thoughtfully, age early 30s,
long dark hair tied loosely, thin-framed glasses,
blue blouse with white lab coat,
thoughtful expression, one hand near chin,
eyes looking slightly upward in consideration,
kind intelligent eyes in contemplation,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing forward
```

---

## teacher-m（男性教師 / GM）

**キャラ設定:** 30代後半。温厚で頼りがいがある。短髪。紺ジャケット。

### teacher-m-normal.webp
```
Japanese anime style, visual novel character sprite,
a warm reliable male teacher, age late 30s,
short neat dark hair, navy blue jacket over white shirt and tie,
friendly calm smile, standing with relaxed confidence,
kind dark eyes, square jawline, dependable mature aura,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing forward
```

### teacher-m-happy.webp
```
Japanese anime style, visual novel character sprite,
a warm male teacher smiling proudly, age late 30s,
short neat dark hair, navy blue jacket over white shirt and tie,
proud warm smile, arms relaxed at sides,
eyes crinkled with genuine pleasure and pride in students,
kind dark eyes, square jawline,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing forward
```

### teacher-m-thinking.webp
```
Japanese anime style, visual novel character sprite,
a thoughtful male teacher considering carefully, age late 30s,
short neat dark hair, navy blue jacket over white shirt and tie,
serious thoughtful expression, one hand on chin,
looking forward with careful consideration,
kind dark eyes in deep thought, square jawline,
clean lineart, soft cel-shading, white background,
upper body to knee shot, facing forward
```

---

## 配置先

```
game/public/images/sprites/
├── boy-a-{normal,happy,thinking,worried,surprised,determined}.webp
├── boy-b-{normal,happy,thinking,worried,surprised,determined}.webp
├── boy-c-{normal,happy,thinking,worried,surprised,determined}.webp
├── boy-d-{normal,happy,thinking,worried,surprised,determined}.webp
├── girl-a-{normal,happy,thinking,worried,surprised,determined}.webp
├── girl-b-{normal,happy,thinking,worried,surprised,determined}.webp
├── girl-c-{normal,happy,thinking,worried,surprised,determined}.webp
├── girl-d-{normal,happy,thinking,worried,surprised,determined}.webp
├── teacher-f-{normal,happy,thinking}.webp
└── teacher-m-{normal,happy,thinking}.webp
```

合計: **54枚**

## 生成後の処理

```bash
# 白背景除去（game/ ディレクトリで実行）
node scripts/remove-bg.mjs
```
