# Handoff: 打ち上げ費用計算ツール（金額計算）

## Overview

サークルの打ち上げなど、学年（期）ごとに支払い金額を変えて割り勘する計算ツール。

- 下級生ほど支払いを少なく、最上級生が多く払う不均等割り勘を簡単に設定できる
- 最上級生の支払い額は自動計算（総額から下級生分を引いた残額を均等配分）
- 学年数・人数・期番号がすべてインライン編集可能
- 結果をクリップボードにコピーしてシェアできる

---

## About the Design Files

`Calculator.html` は **HTML で作成したハイファイデザインプロトタイプ** です。最終的な見た目・操作感・計算ロジックを確認するためのリファレンスです。iOSフレームはプレゼンテーション用の見栄えラッパーであり、実装には無関係です。

開発者のタスクは、このプロトタイプで示された UI と動作を **SvelteKit + TailwindCSS + TypeScript** で再実装することです。ロジック部分（計算・制約・再配分）は `Calculator.html` 内の JavaScript で書かれているため、そのまま TypeScript に移植できます。

---

## Fidelity

**High-fidelity（ハイファイ）**

色・タイポグラフィ・スペーシング・アニメーション・インタラクションすべて最終仕様です。このプロトタイプの見た目・動作を忠実に再現してください。

---

## Tech Stack

| 項目 | 採用技術 |
|------|---------|
| フレームワーク | **SvelteKit** + `@sveltejs/adapter-static` |
| 言語 | **TypeScript** |
| スタイリング | **TailwindCSS** |
| PWA | **vite-plugin-pwa**（Workbox ベース） |
| ホスティング | **Cloudflare Pages** |
| 状態管理 | Svelte カスタムストア + **localStorage 同期（必須）** |

---

## Screens / Views

### メイン画面（唯一の画面）

縦スクロール可能な1画面構成。「総額ヘッダー」のみ sticky で固定。

#### 1. ナビゲーションバー（固定・スクロールしない）

```
[アイコン 26px] [「金額計算」テキスト 18px / 800]
```

- 背景: `--surface`（#fff / ダーク: #1c1a17）
- 下ボーダー: 1px solid `--border`
- 高さ: 46px、padding: 10px 16px

#### 2. 総額ヘッダー（sticky）

```
[TOTAL ラベル 11px uppercase]
[¥20,000  ✏]                    [👥 13人] [☀/🌙] [toggle]
```

- 背景: `--surface`、下ボーダー 1.5px
- ¥数値: 28px / 800。クリックで `<input type="number">` に切替、Enter/blur で確定
- 人数: SVG アイコン（people）+ 数値 13px / 700
- ダークモードトグル: 36×20px 角丸ピル。アクセントブルー ON / グレー OFF、内部に 16×16 白丸
- 太陽 SVG アイコン（ライト時）/ 月 SVG アイコン（ダーク時）をトグル左に表示

#### 3. 期チップ一覧

横並びのチップ群（flex wrap）。

各チップ:
- 背景: 最上級生=`--greenL`、下級生=`--accentL`
- ボーダー: 最上級生=`rgba(31,170,107,0.3)`、下級生=`rgba(58,126,246,0.3)`
- border-radius: 12px、padding: 5px 10px
- 内容: ⠿ドラッグハンドル ｜ [XX期] [最上バッジ] ✏ ｜ [−] [N] [＋] ｜ [N人] ｜ [×削除]
- ドラッグ中: opacity 0.35 + scale(0.97)
- ドラッグオーバー: outline 2px solid `--accent`

**「＋ 期追加」ボタン**: dashed border、border-radius: 12px

**並び替えルール**: 上のチップ = 最上級生（grades[0]）。ドラッグ&ドロップで順序変更すると grades[0] が自動的に最上級生になる。

#### 4. スライダーセクション

最上級生スライダーが上、下級生スライダーが下（1px ボーダーで区切り）。

**各スライダー行の構成:**
```
[● XX期]  [最上バッジ / 自動ラベル / ↺自動ボタン]       ¥X,XXX / 人
[==================●=====]  トラック
¥0                                                   ¥10,000
```

- ラベルドット: 10px 丸、同色 3px 外側リング（`--greenL` / `--accentL`）
- 支払額数値: 24px / 800、RAF ベースで 180ms ease-out-cubic アニメーション
- トラック: height 6px、背景 `--border2`、塗り = グラデーション `${color}99 → ${color}`
- つまみ: 28×28px 丸、背景 `--surface`、border 3px solid color
  - ドラッグ中: scale(1.18) + 外側に color の 6px 半透明リング
  - transition: transform 0.12s, box-shadow 0.12s（位置は transition なし）

#### 5. 支払いサマリー

```
支払いサマリー（11px uppercase ラベル）

[⚠ 差額あり / ✓ 合計一致]          ¥XX,XXX（アニメーション）
─────────────────────────────
● 15期  ×4人  自動    計 ¥XX,XXX    ¥X,XXX/人
● 16期  ×6人          計 ¥XX,XXX    ¥X,XXX/人
● 17期  ×3人          計 ¥XX,XXX    ¥X,XXX/人
```

- 合計確認バッジ: background `--greenL` / `--redL`、border-radius 12px、padding 10px 14px
- 合計額: RAF ベースアニメーション
- 各行: ドット + 期名 16px / 700 + 人数 12px + 計XX円（副）+ ¥XX/人（主 20px / 800）
- 最上級生行: green カラー、下級生: accent カラー

#### 6. コピーボタン

```
[結果をコピー]  →クリック後→  [✓ コピーしました！]
```

- 通常: グラデーション `--accent → --accentD`、青系 shadow
- コピー後: `--green`、緑系 shadow
- height: 48px、border-radius: 14px、font 17px / 800

**コピー内容プレビュー**: ボタン下に小さく表示
```
15期 ¥X,XXX / 16期 ¥X,XXX / 17期 ¥X,XXX
```

---

## Interactions & Behavior

### 学年の制約（支払い順序）

`grades[0]` = 最上級生（最高額）、`grades[n]` = 最下級生（最低額）の降順。

```
grades[0].payment >= grades[1].payment >= grades[2].payment >= ...
```

### 最上級生の自動計算

```ts
const manualSum = lower.reduce((s, g) => s + g.payment * g.count, 0);
const autoTopPayment = Math.round((total - manualSum) / topGrade.count);
```

下級生のスライダーを動かすたびに自動再計算。

### 最上級生を手動設定した時（topOverridden = true）

```ts
// 下級生を自動調整して差額を最小化
const targetLowerSum = total - topPayment * topGrade.count;
const adjusted = redistributeLower(otherLower, targetLowerSum, SNAP_STEP);
```

### 下級生スライダー操作（topOverridden 時）

他の下級生で差額を補うよう自動調整：

```ts
const otherTarget = targetLowerSum - movedGrade.payment * movedGrade.count;
const others = lower.filter(g => g.id !== movedId);
const adjusted = redistributeLower(others, otherTarget, SNAP_STEP);
// 降順制約を再確認してから state 更新
```

### redistributeLower アルゴリズム

```ts
// diff > 0（over budget）: 最低額の下級生から SNAP_STEP ずつ削減
// diff < 0（under budget）: 最低額の下級生から SNAP_STEP ずつ増額
// 制約: grades[i] >= grades[i+1]（降順維持）
// 最大 10,000 イテレーションでデッドロック防止
```

### ドラッグ&ドロップ（期チップ）

HTML5 Drag and Drop API（または Svelte 向けライブラリ）:
- `dragstart`: dragIdx を記録
- `dragover`: preventDefault + dragOverIdx 更新
- `drop`: grades 配列を splice で並び替え、topOverridden をリセット
- `dragend`: state リセット

並び替え後、`grades[0]` が自動的に最上級生になる。

### 数値アニメーション

```ts
// target が変わったら 180ms で ease-out-cubic 補間
// requestAnimationFrame ベース
const eased = 1 - Math.pow(1 - t, 3);
display = Math.round(from + (target - from) * eased);
```

支払い額・合計額の両方に適用。

### ダークモード

`document.documentElement` の `data-theme="dark"` 属性を切替。CSS 変数で全色が切り替わる。ダークモード設定は localStorage に保存。

---

## State Management

```ts
// メインの状態（Svelte カスタムストア + localStorage 同期）
total: number           // 総額（タップで編集可）
grades: Grade[]         // 全学年（grades[0] = 最上級生）
topOverridden: boolean  // 最上級生が手動設定中か
darkMode: boolean       // ダークモード

// Grade 型
interface Grade {
  id: number;
  num: number;    // 期の番号（例: 15）
  count: number;  // 人数
  payment: number;
}

// 派生値（$derived / $: で計算）
topGrade = grades[0]
lower = grades.slice(1)
totalPeople = grades.reduce((s, g) => s + g.count, 0)
equalSplit = Math.round(total / totalPeople)
autoTop = Math.round((total - manualSum) / topGrade.count)
topPayment = topOverridden ? topGrade.payment : autoTop
actualTotal = lowerSum + topPayment * topGrade.count
balanced = Math.abs(actualTotal - total) <= 1
```

---

## Design Tokens

```css
/* ライトモード */
--bg:       #f4f2ee;
--surface:  #ffffff;
--surface2: #f8f6f2;
--border:   #e4dfd6;
--border2:  #ede9e2;
--text:     #18160f;
--text2:    #6b6259;
--text3:    #a09388;
--accent:   #3a7ef6;
--accentL:  #eaf1ff;
--accentD:  #2a6ee0;
--green:    #1faa6b;
--greenL:   #e3f8ef;
--greenD:   #17905c;
--red:      #e04030;
--redL:     #fff0ee;

/* ダークモード上書き */
--bg:       #0e0d0b;
--surface:  #1c1a17;
--surface2: #252320;
--border:   #2e2c28;
--border2:  #353330;
--text:     #f0ede6;
--text2:    #8a8078;
--text3:    #5c5650;
--accentL:  #1a2840;
--greenL:   #0f2820;
--redL:     #2a1510;

/* タイポグラフィ */
font-family: 'M PLUS Rounded 1c', sans-serif;
/* weights: 400, 500, 700, 800 */

/* 定数 */
SNAP_STEP = 50    /* 50円単位スナップ */
SLIDER_MAX = 10000
```

---

## App Icon（案 A 採用確定）

```svg
<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3a7ef6"/>
      <stop offset="100%" stop-color="#1faa6b"/>
    </linearGradient>
  </defs>
  <text x="20" y="23" text-anchor="middle"
    font-family="sans-serif" font-weight="800" font-size="19" fill="white">¥</text>
  <rect x="8"  y="29" width="4" height="5"  rx="1.5" fill="white" opacity="0.50"/>
  <rect x="14" y="26" width="4" height="8"  rx="1.5" fill="white" opacity="0.65"/>
  <rect x="20" y="23" width="4" height="11" rx="1.5" fill="white" opacity="0.80"/>
  <rect x="26" y="27" width="4" height="7"  rx="1.5" fill="white" opacity="0.60"/>
</svg>
```

ファビコン、PWA manifest の `icons`、ナビバー左 26px に使用。

---

## PWA 要件

- **vite-plugin-pwa**（Workbox ベース）を使用。Service Worker を手書きしないこと
  - `vite.config.ts` でキャッシュ戦略を宣言的に記述
  - Cloudflare Pages との相性が良く、PWA 特有のキャッシュ更新問題も回避できる
- `manifest.json`: `name: "金額計算"`, `short_name: "金額計算"`, `display: "standalone"`, `theme_color: "#3a7ef6"`
- オフライン動作必須（全アセットをキャッシュ）

---

## Files

| ファイル | 内容 |
|---------|------|
| `Calculator.html` | ハイファイプロトタイプ（全ロジック・スタイル含む・動作確認用） |

---

## Notes for Developer

1. **スライダー実装は Melt UI 等のヘッドレス UI ライブラリを推奨**
   ネイティブの `<input type="range">` はタッチデバイスで値が0にジャンプするバグがある。また、カスタムポインターイベントで独自実装すると、後からキーボード操作（矢印キー）や ARIA 属性を追加する際に状態管理が複雑化しバグの温床になる。**Melt UI や Bits UI の Slider コンポーネント**はこれらの問題（タッチバグ・アクセシビリティ）を標準でクリアしており、最初から導入することを強く推奨する。

2. **SvelteKit + @sveltejs/adapter-static**
   純粋な Svelte ではなく SvelteKit をベースに構築すること。Cloudflare Pages への静的デプロイは `@sveltejs/adapter-static` で対応。

3. **localStorage は必須要件**
   総額・学年設定・ダークモード設定をアプリ終了後も保持すること。PWA としてスタンドアロン動作する電卓ツールにおいて、データのリセットは致命的なストレスになる。Svelte カスタムストアと localStorage の同期は容易に実装可能。「あれば良い機能」ではなく Must-have として扱うこと。

4. **grades[0] = 最上級生（位置ベース）**
   `isTop` フラグは使わず配列の先頭位置で最上級生を判定する。ドラッグ&ドロップで並び替えると grades[0] が自動的に最上級生になる。

5. **redistributeLower のイテレーション上限**
   再配分ロジックには 10,000 イテレーション上限を設けること。無限ループ防止のため必須。

6. **TypeScript 型定義**
   `Grade` インターフェースを定義し、全コンポーネントで型安全を確保すること（State Management セクション参照）。
