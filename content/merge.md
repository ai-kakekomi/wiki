---
slug: merge
title: マージ
yomi: マージ
english: Merge
english_yomi: マージ
japanese: 変更の統合
difficulty: 上級
genres: [プログラミング]
related: [branch, git, pull-request, commit, database]
sources:
  - title: git-merge Documentation | Git
    url: https://git-scm.com/docs/git-merge
  - title: Git - Branches in a Nutshell | Pro Git
    url: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
updated: 2026-08-16
---

## ひとことで

別々に進めていた作業を、ひとつにまとめ直す操作です。

## なぜ大事?

私たちが毎日使っているアプリやサイトは、たいてい何人もの手で少しずつ直されています。その別々の直しを事故なく合流させる作業が、マージです。

## やさしい解説

グループで文集を作る場面を思いうかべてください。Aさんが1章を、Bさんが2章を書いたなら、まとめるのは簡単です。触った場所がちがうからです。

困るのは、ふたりとも同じ段落を書き直してきたときです。どちらを残すか、混ぜるかは、中身を読める人にしか決められません。マージも同じで、重なっていなければ機械が自動でまとめてくれますが、同じ行がぶつかると作業を止めて人間に判断をゆだねます。

ここが親切な設計で、機械は迷ったとき勝手に片方を捨てません。この「ぶつかった状態」はコンフリクト、つまり衝突と呼ばれます。ちなみに衝突を減らす一番の方法は技術ではなく、作業を長く抱えこまないことです。一週間分より一日分のほうが、ぶつかる面積が小さくて済みます。
