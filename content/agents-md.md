---
slug: agents-md
title: AGENTS.md
yomi: エージェンツエムディー
english: AGENTS.md
english_yomi: エージェンツ・ドット・エムディー
proper_noun: true
difficulty: 上級
genres: [AI, プログラミング]
related: [claude-md, codex, ai-agent, markdown, readme]
sources:
  - title: AGENTS.md
    url: https://agents.md/
  - title: How Claude remembers your project | Claude Code Docs
    url: https://code.claude.com/docs/en/memory
updated: 2026-09-08
---

## ひとことで

AIの道具に読ませる「決まりごと」のファイルの、会社をまたいだ共通の名前です。

## なぜ大事?

AIの道具は会社ごとに違う名前の決まりごとファイルを読みます。**同じ中身を道具の数だけ書き直すのは無駄**なので、ひとつの名前に揃えようという動きが起きました。それが AGENTS.md です。

## やさしい解説

人に渡す説明書が README なら、AIに渡す説明書が AGENTS.md です。中身は CLAUDE.md と同じで、この場所は何で、何を守り、何をしてはいけないかを、ふつうの文章で書きます。

もともとは OpenAI の Codex や Cursor など、複数の会社がそれぞれ別の名前で始めたものを、ひとつに寄せた名前です。いまは Linux Foundation のもとで管理されていて、特定の会社のものではありません。

Claude Code は `AGENTS.md` を直接は読まず `CLAUDE.md` を読みますが、`CLAUDE.md` の中に「AGENTS.md を読んで」と1行書けば、同じ中身を両方の道具で使えます。名前が2つあるだけで、書くことは1つです。

## 例文

- 「CLAUDE.md と AGENTS.md、両方要るの?」「中身は同じ。片方に『もう片方を読んで』と書けばいい」
- 「AGENTS.md って誰が決めたの?」「いろんな会社が寄せた共通の名前。いまは Linux Foundation の下」
