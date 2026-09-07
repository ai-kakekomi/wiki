---
slug: system-prompt
title: システムプロンプト
yomi: システムプロンプト
english: System Prompt
english_yomi: システム・プロンプト
japanese: 土台の指示文
difficulty: 中級
genres: [AI]
related: [prompt, claude-md, context, chatgpt, llm]
sources:
  - title: Prompting best practices | Claude Docs
    url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
updated: 2026-09-08
---

## ひとことで

会話が始まる前に、AIへ「あなたはこういう役で、こう振る舞う」と渡しておく指示文です。

## なぜ大事?

同じAIが、ある画面では丁寧で、別の画面では砕けていて、また別の画面では医療の話を断る。**その違いを作っているのが、利用者の見えないところに置かれたこの指示文**です。AIの「性格」だと思っているものは、たいていここに書いてあります。

## やさしい解説

役者に渡す台本の、最初のページを想像してください。「あなたは八百屋の店主。お客には敬語。値段の相談は店主に回す」。本番の会話はそのあとに続きます。この最初のページが、システムプロンプトです。

利用者が打つプロンプトと違い、ふつうは画面に出ません。ChatGPT や Claude のようなサービスにも、運営会社が書いた長いものが入っていて、「今日の日付」「できないこと」「話し方」などが書かれています。公式の手引きでも、**役割を1文与えるだけで振る舞いが変わる**とされています。

自分でAIの道具を作るときは、ここに店の事情を書きます。Claude Code の CLAUDE.md は、これを自分で書けるようにしたファイル、と考えるとつながります。

## 例文

- 「このAI、なんで敬語なの?」「システムプロンプトにそう書いてあるんだよ。見えないけど」
- 「AIに役をつけたい」「最初に『あなたは〜です』って一文入れるだけで変わるよ」
