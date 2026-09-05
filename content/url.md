---
slug: url
title: URL
yomi: ユーアールエル
english: Uniform Resource Locator
english_yomi: ユニフォーム・リソース・ロケーター
japanese: ネット上の住所
difficulty: 初級
genres: [スマホ, セキュリティ]
related: [browser, internet, phishing, qr-code, provider]
sources:
  - title: RFC 3986 - Uniform Resource Identifier (URI) | IETF
    url: https://datatracker.ietf.org/doc/html/rfc3986
updated: 2026-09-05
---

## ひとことで

インターネット上の「どこにあるか」を示す住所です。

## なぜ大事?

偽サイトを見破る手がかりが、ここにしかありません。見た目はいくらでも本物そっくりに作れますが、**住所だけは他人のものを使えない**からです。どこを見ればいいかを知っているかどうかで、被害に遭う確率が変わります。

## やさしい解説

読む場所は決まっています。`https://` のすぐ後ろから、**最初の「/」までの間**。ここが相手の正体です。それより後ろは、相手が自由に書ける部分なので、いくら本物らしい文字が並んでいても意味がありません。

たとえば `https://ai-kakekomi.com/apply` なら、`ai-kakekomi.com` が正体です。もし `https://ai-kakekomi.com.abc123.net/` なら、正体は `abc123.net` のほうです。**後ろに行くほど嘘をつきやすい**と覚えてください。

住所の書きかたは、1994年に決められた世界共通の取り決めに沿っています。国も会社も関係なく同じ形なので、どの国のサイトでも同じ読みかたが通じます。

## 例文

- 「このURL、本物かな?」「最初のスラッシュまでを見てみて。そこが相手の正体だよ」
- 「長くて読めないよ」「後ろは無視していいの。URLは前のほうだけ見れば分かるんだ」
