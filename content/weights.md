---
slug: weights
title: 重み
yomi: オモミ
english: Weights
english_yomi: ウェイツ
japanese: 重み
difficulty: 上級
genres: [AI, プログラミング]
related: [parameter, neural-network, training, hugging-face, open-source, meta, deepseek]
sources:
  - title: Google Machine Learning Glossary（weight）
    url: https://developers.google.com/machine-learning/glossary
  - title: Hugging Face Hub のモデル
    url: https://huggingface.co/docs/hub/models-the-hub
updated: 2026-09-09
---

## ひとことで

AIの中身そのものである、トレーニングで決まった数字の集まりのことです。

## なぜ大事?

**「AIを公開する」とは、この数字のファイルを配ることです。** ニュースで「オープンウェイト」「重みを公開」と出てきたら、誰でもそのAIを自分の機械で動かせるようになった、という意味です。

## やさしい解説

ニューラルネットワークは、たくさんの点が線でつながった網です。線の一本一本に「この信号をどれくらい強く次へ渡すか」の数字が付いていて、それが重みです。トレーニングは、この数字を少しずつ直す作業でした。**終わったあとに残るのは、この数字の山だけ**で、AIの賢さは全部ここに入っています。

だから重みのファイルが、AIの本体です。大きなものは数百GBあり、Hugging Face から持ってくれば、ChatGPT のような会社のサーバーを通さずに手元で動かせます。Meta や DeepSeek が「重みを公開した」と言うのはこれで、研究者や会社が自分用に手直しできるようになります。

ただし重みは数字の羅列なので、人が読んでも何も分かりません。「AIがなぜその答えを出したか説明できない」と言われるのは、中身がこの形だからです。公開されていてもレシピ（学習データや作り方）までは分からないことが多く、オープンソースとは区別して「オープンウェイト」と呼びます。

## 例文

- 「AIを公開したって、何を配ったの?」「重みだよ。AIの中身の数字のファイル。それがあれば自分の機械でも動くんだ」
- 「重みを見れば、AIの考えが分かる?」「分からないんだ。ただの数字の山だから。そこが重みの不思議なところだね」
