---
slug: git
title: Git
yomi: ギット
english: Git
english_yomi: ギット
japanese: 分散型バージョン管理システム
difficulty: 上級
genres: [プログラミング]
related: [repository, commit, branch, merge, database]
sources:
  - title: Git - What is Git? | Pro Git
    url: https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F
  - title: git-commit Documentation | Git
    url: https://git-scm.com/docs/git-commit
updated: 2026-08-16
---

## ひとことで

ファイルの変更を全部記録しておき、いつでも過去の状態に戻れるようにする道具です。

## なぜ大事?

「昨日の状態に戻したい」は誰にでも起きます。複数人で一つの書類を触ると、あとから保存した人の内容だけが残って片方の作業が消える。あの事故を仕組みでなくすのがGitで、今の世の中のソフトはほぼこれで作られています。

## やさしい解説

Gitは、ゲームのセーブ機能に似ています。強敵に挑む前にセーブしておけば、負けてもやり直せます。しかもGitのセーブは何本でも作れて、それぞれに「なぜここで保存したか」のメモが付きます。別ルートを試すための枝分かれまで作れて、失敗しても本編に響きません。

もうひとつの特徴は、参加者全員が履歴の完全な複製を持っていることです。中央の置き場が壊れても、誰か一人の手元が無事なら全部よみがえります。

このGitを作ったのは、基本ソフトLinuxの生みの親であるリーナス・トーバルズです。開発で使っていた道具が使えなくなり、自分たちのために数週間で作りました。その私物の道具が、いまや世界中の開発現場の標準になっています。

## 例文

- 「まちがえて上書きしちゃった」「Gitで記録してるから、前の状態に戻せるよ」
- 「Gitを覚えると、消しちゃったらどうしようって心配がなくなるよ」
