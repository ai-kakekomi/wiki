---
slug: pull-request
title: プルリクエスト
yomi: プルリクエスト
english: Pull Request
english_yomi: プル・リクエスト
japanese: 変更の取り込み依頼
difficulty: 特級
genres: [プログラミング]
related: [fork, branch, merge, open-source, git, database]
sources:
  - title: About pull requests | GitHub Docs
    url: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests
  - title: About forks | GitHub Docs
    url: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks
updated: 2026-08-16
---

## ひとことで

「この変更を取り込んでください」とお願いし、入れる前にみんなで確認するための仕組みです。

## なぜ大事?

世界中の見知らぬ人が同じソフトを直しあえるのは、この仕組みがあるからです。技術というより、他人を信用しきれない前提で協力するための知恵です。

## やさしい解説

学級新聞にたとえてみます。書いた人がいきなり印刷所に持ちこむのではなく、まず原稿を回覧します。ほかのメンバーが読んで「この表現は誤解される」「数字を確認して」と書きこみ、直して、納得できたら掲載が決まります。

プルリクエストの画面で起きているのも同じことです。どの行が増えてどの行が消えたかが色分けで並び、そこにコメントがつきます。指摘を直せば内容は自動で更新され、みんなが良しとしたところで本体に取りこまれます。

ちなみに、これはプログラムを管理する道具そのものの機能ではなく、あとから人間の都合に合わせて足された仕組みです。「誰でも提案できるが、入る前に必ず誰かの目を通る」。この中間の状態を作ったことが、開けた協力を成り立たせています。

## 例文

- 「その直し、そのまま入れるの?」「プルリクエストを出して見てもらうよ」
- 「プルリクエストにコメントもらったから、直してから入れるね」
