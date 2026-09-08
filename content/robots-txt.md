---
slug: robots-txt
title: robots.txt
yomi: ロボッツテキスト
english: robots.txt
english_yomi: ロボッツ・テキスト
proper_noun: true
difficulty: 上級
genres: [プログラミング, AI]
related: [seo, google, training-data, ai-copyright, url, cloudflare]
sources:
  - title: robots.txt の概要 | Google 検索セントラル
    url: https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=ja
  - title: RFC 9309 Robots Exclusion Protocol | RFC Editor
    url: https://www.rfc-editor.org/rfc/rfc9309
updated: 2026-09-08
---

## ひとことで

「うちのサイトのここは読まないで」と、機械に向けて貼っておく紙のことです。

## なぜ大事?

ホームページには人だけでなく、Google の巡回機械や、AIの学習用に文章を集める機械が毎日来ています。**この紙は、その機械に「入っていい場所」を伝える唯一の共通の決まり**です。最近は「AIの学習には使わないで」と書く手段としても注目されています。ただし、あくまでお願いで、鍵ではありません。

## やさしい解説

店の入口に「関係者以外立入禁止」の貼り紙を出すようなものです。サイトの決まった場所に `robots.txt` という名前の小さな文字のファイルを置き、「この機械は、この場所に入らないで」と書きます。1994年からある古い習慣で、2022年に正式な国際標準（RFC 9309）になりました。

守るかどうかは機械の側の礼儀に任されています。Google のような大手は守りますが、守らない機械もあります。Google 自身の説明でも、これはページを検索結果から隠す手段ではない、とされています。本当に見せたくないものは、貼り紙ではなく鍵（ログイン）で守ります。

AIの時代になって、この紙に「AIの学習用の機械は入らないで」と書くサイトが増えました。逆に、かけこみ辞典のように「誰でも読んで、使ってよい」と決めたサイトは、あえて何も書きません。どちらにするかは、サイトを持つ人が決める話です。

## 例文


- 「うちのサイト、AIに学習されたくない」「robots.txt に書けるよ。ただしお願いだから、本気で守るなら鍵をかけてね」
- 「robots.txt で隠せば検索に出ない?」「出ないとは限らないよ。隠すための紙じゃなくて、入る場所を伝える紙なんだ」
