---
slug: backend
title: バックエンド
yomi: バックエンド
english: Back End
english_yomi: バック・エンド
japanese: 後ろ側
difficulty: 上級
genres: [プログラミング]
related: [frontend, database, api, cloud, supabase, tech-stack, authentication]
sources:
  - title: クライアント・サーバーの概要 | MDN Web Docs
    url: https://developer.mozilla.org/ja/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview
  - title: サーバーサイドの概要 | MDN Web Docs
    url: https://developer.mozilla.org/ja/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction
updated: 2026-09-08
---

## ひとことで

アプリやサイトのうち、画面には見えない、裏でデータを預かったり計算したりする部分のことです。

## なぜ大事?

「ログインできる」「みんなで同じものを見られる」「あとで開いても残っている」。**この3つのどれかが欲しくなった瞬間、バックエンドが要ります。**そして、バックエンドができた瞬間から、人のデータを預かる責任も生まれます。作れるかより、預かれるかで決める場所です。

## やさしい解説

お店の裏側です。倉庫、帳簿、金庫。お客さんからは見えませんが、売り場（フロントエンド）が「この商品ある?」と聞くと、倉庫が答えます。この「聞いて、答える」のやりとりが、ネットの上では絶えず起きています。

バックエンドは、あなたの端末ではなく、どこかのサーバーで動いています。データベースにデータをしまい、誰が見てよいかを確かめ、必要な形にして画面へ返す。ホームページの申し込みフォームに名前を入れて「送信」を押したあと、その名前が向かう先がここです。

だから、バックエンドがある道具は「入力した内容がどこかに送られる」道具です。悪いことではありませんが、預かる側には守る義務が生まれます。AIかけこみ寺が小さな道具をフロントエンドだけで作り、名簿や掲示板のように本当に必要なものにだけバックエンドを置くのは、この責任を最小にするためです。

## 例文

- 「みんなで同じ予定表を見たい」「それはバックエンドが要る。データを預かる場所ができるってこと」
- 「フォームに入れた名前はどこ行くの?」「バックエンドのデータベース。だから預かる側は守る義務がある」
