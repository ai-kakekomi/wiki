---
slug: api
title: API
yomi: エーピーアイ
english: Application Programming Interface
english_yomi: アプリケーション・プログラミング・インターフェース
japanese: プログラム同士の連絡窓口
difficulty: 上級
genres: [プログラミング]
related: [database, generative-ai, authentication]
sources:
  - title: About the REST API | GitHub Docs
    url: https://docs.github.com/en/rest/about-the-rest-api/about-the-rest-api
  - title: Models | OpenAI API Docs
    url: https://developers.openai.com/api/docs/models
updated: 2026-08-16
---

## ひとことで

プログラムが別のプログラムに用事を頼むための、決まった形の窓口です。

## なぜ大事?

スマホのアプリで地図を見て、そのまま店を予約して支払う。この一連の流れは、実は別々の会社のプログラムが裏でつながって動いています。そのつなぎ目がAPIです。

## やさしい解説

APIは、レストランの注文窓口だと思ってください。客は厨房に入りません。メニューを見て、決まった料理名を伝えるだけです。厨房が何人で回っていようと客には関係ありませんが、逆にメニューにない料理は頼めません。

このメニューにあたるものが、APIの仕様書です。何を頼めるか、どう伝えるか、どんな形で返ってくるかが書いてあります。返事は人間向けの見やすいページではなく、機械が読みやすい素っ気ないデータの形で戻ってきます。

面白いのは、多くのアプリが他社のAPIを呼んでいるだけ、という点です。地図の描き方を一切知らなくても地図を表示できる。だから少人数でも本格的なサービスが作れます。頼むときは合言葉のような鍵を一緒に送るのが普通で、これを他人に見られると、勝手に使われて料金を請求される事故につながります。

## 例文

- 「この料理アプリ、地図も出るんだね」「地図会社のAPIを借りてるからだよ」
- 「APIの鍵は誰にも見せちゃだめだよ。勝手に使われちゃうから」
