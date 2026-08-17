# かけこみ辞典 リポジトリの掟

AIかけこみ寺の技術用語辞典。`content/` のMarkdownが唯一の原本で、サイトはそこから生成する。

## 大原則

**content/ のmdを編集 → `npm run build` → 生成物ごとコミット。**

生成物（`index.html`、`{slug}/index.html`、`search-index.json`）はリポジトリに含める。
LPがビルドレス運用（Vercelで静的配信）なので、HTMLが最初から存在していないと配信できない。
**生成物を手で編集してはいけない。** 次のビルドで消える。直すのは `content/*.md` か
`templates/article.html` か `scripts/build.mjs`。

```bash
npm install          # 初回のみ（devDependencies は marked だけ）
npm run build        # 検証 + HTML生成 + search-index.json生成
npm test             # 26本のテスト（node --test）
npm run serve        # http://localhost:8080 でローカル確認
```

`npm run build` は検証に1つでも違反があれば**失敗して何も生成しない**。警告（related の
未収録slug）はビルドを止めないが、その関連ワードは記事に表示されない。

## ファイルの役割

| パス | 役割 |
|------|------|
| `content/{slug}.md` | 記事の原本（SSOT）。人が書くのはここだけ |
| `scripts/build.mjs` | 生成の入口。記事HTML・トップ・検索インデックスを作る |
| `scripts/frontmatter.mjs` | 依存ゼロの最小YAML読み取り |
| `scripts/validate.mjs` | frontmatterと本文の検証ルール（11本＋セクション検査） |
| `scripts/text.mjs` | カナ正規化・要約・HTMLエスケープ |
| `scripts/link.mjs` | note原稿へ初出リンクを埋め込むCLI（wiki-linkスキルから呼ぶ） |
| `templates/article.html` | 記事HTMLのひな形。`{{PLACEHOLDER}}` を置換するだけ |
| `assets/wiki.css` | LPのCSSトークン（`--primary:#2D6A4F` 系）を流用 |
| `assets/search.js` | 依存ゼロの検索。`search-index.json` をfetchする |
| `test/build.test.mjs` | `node --test` で走るテスト |

## frontmatter仕様（検証で必須強制）

```yaml
---
slug: rls                    # 英小文字・数字・ハイフン。ファイル名と一致すること
title: RLS                   # 見出しに出る表記
yomi: アールエルエス            # カタカナ必須（検索のかな正規化に使う）
english: Row Level Security  # 任意。英語・頭字語ならフルスペルを書く
english_yomi: ロウ・レベル・セキュリティ  # english があれば必須・カタカナ
japanese: 行単位のアクセス制御   # english があれば必須・和訳
difficulty: 特級              # 初級 | 中級 | 上級 | 特級 のみ
genres: [データベース, セキュリティ]  # 1つ以上
related: [database, supabase] # slugの配列。未収録slugは警告し記事に出さない（赤リンク禁止）
sources:                      # 1つ以上。一次資料（公式ドキュメント）のみ
  - title: Row Level Security | Supabase Docs
    url: https://supabase.com/docs/guides/database/postgres/row-level-security
updated: 2026-08-16           # YYYY-MM-DD
---
```

## 本文の掟

必須セクションは4つ。この見出し文字列そのままで書く（検証で見ている）。

```markdown
## ひとことで
## なぜ大事?
## やさしい解説
## 例文
```

- **関連ワード・一次資料の見出しを本文に書かない。** frontmatterからテンプレが描画する。
  本文に書くと検証で落ちる
- 想定読者は**その話題に興味のない普通の人**。読んで「勉強になったな」と思える**超短文**にする。
  読める語彙の水準は**小学生高学年**に置く。Wikipediaの逆で、網羅せず迷ったら削る
- **本文全体400〜600字**。「ひとことで」は1文、「なぜ大事?」は1段落（2〜3文）が上限で
  技術的意義ではなく平凡な日本人の生活との関係を書く、「やさしい解説」は2〜3段落で各2〜3文
- 「例文」は**2文**。日常会話の中でその言葉をどう使うかが小学生でもイメージできる、やさしい例文にする。
  話し言葉は「」で囲み、箇条書き（- ）2つで書く。自然な会話として成立させ、無理に専門用語を詰め込まない
- 「やさしい解説」には**比喩か身近な例を1つだけ**。表・番号付き手順・注意点の列挙は書かない
- 「へえ」と言わせる雑学フック（由来・意外な身近さ・規模感）を1つ入れる
- 難易度の目安: 初級=日常語（アプリ、AI）／中級=IT一般語（データベース、クラウド）／
  上級=開発者語（API、Git）／特級=専門家語（RLS、認証トークン）
- 上位難易度の記事の `related` には、**必ず下位難易度の足場記事を含める**（読者が関連ワードから
  やさしい記事へ降りられるように）
- **em dash（—／―）を使わない**

## 配信物の制約（破らない）

- **外部CDN参照禁止・依存ゼロ・完全静的**。例外はフォントのみ: ブランド統一のためLPと同じ Zen Maru Gothic（Google Fonts）を読み込む
- 記事は `{slug}/index.html` に出るので、assetsへの参照は `../assets/`
- Wiki内リンクは相対パス `../{slug}/`。ローカルの `python3 -m http.server` でも動くこと
- 難易度の色分けは `<body data-difficulty="特級">` + CSS属性セレクタ。
  JavaScriptで色を変えない

## 配信先

`ai-kakekomi.com/wiki/{slug}` （LPリポジトリに submodule として組み込む想定）。
