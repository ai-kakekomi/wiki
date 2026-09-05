---
slug: rag
title: RAG
yomi: ラグ
english: Retrieval-Augmented Generation
english_yomi: リトリーバル・オーグメンテッド・ジェネレーション
japanese: 調べてから答えさせる仕組み
difficulty: 上級
genres: [AI]
related: [llm, hallucination, context, prompt, chatgpt, token]
sources:
  - title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks | arXiv
    url: https://arxiv.org/abs/2005.11401
updated: 2026-09-05
---

## ひとことで

AIに答えさせる前に、手元の資料を探して読ませる仕組みです。

## なぜ大事?

AIは覚えていないことを、それらしく作って答えてしまいます。**先に資料を渡してから答えさせれば**、作り話がぐっと減ります。会社や役所が自前の規程をAIに答えさせるとき、ほぼ必ずこの仕組みが使われています。

## やさしい解説

試験にたとえると分かりやすくなります。何も見ずに答えるのが素のAIで、**教科書を開いてから答えるのがこの仕組み**です。うろ覚えで書くより、開いて写したほうが正確なのは人間と同じです。

流れは2段階です。まず質問に近そうな文書を探してきて、次にその文書と質問を一緒にAIへ渡します。AIは渡された範囲を読んで答えます。

弱点もはっきりしています。**探してくる段階で外すと、後ろは全部外れます**。手元の資料が古ければ、古い答えが自信たっぷりに返ってきます。仕組みを入れれば正しくなる、というものではありません。

## 例文

- 「社内規程をAIに答えさせたいんだけど」「RAGだね。規程を先に読ませてから答えさせる形になるよ」
- 「それで間違えなくなる?」「RAGでも、探してくる資料が古いと古い答えが返るよ」
