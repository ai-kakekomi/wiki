---
slug: objective-function
title: 目的関数
yomi: モクテキカンスウ
english: Objective Function
english_yomi: オブジェクティブ・ファンクション
japanese: 目的関数
difficulty: 上級
genres: [AI]
related: [machine-learning, training, algorithm, reward-hacking, alignment, parameter, reinforcement-learning]
sources:
  - title: Machine Learning Glossary | Google for Developers
    url: https://developers.google.com/machine-learning/glossary#objective-function
updated: 2026-09-11
---

## ひとことで

AIが「何を目指して学ぶか」を、点数の計算式にしたものです。

## なぜ大事?

AIの動きを決めるのは、賢さより**何を目標に置いたか**です。動画アプリが次々とおすすめを出してくるのは、「長く見てもらう」を目的関数にしているから。目的関数を知ると、AIが「なぜそう動くのか」が読めるようになります。

## やさしい解説

AIの学習は、出した答えと正解のズレを点数にして、その点数を小さくしていく作業です。強化学習なら、逆にもらえる点数を大きくしていきます。**その点数を計算する式が目的関数**で、損失関数や報酬関数と呼ばれることもあります。

たとえるなら、テストの採点基準です。基準が「速さ」なら、生徒は速く雑に書きます。AIも同じで、**採点基準どおりに育ち、それ以上にもそれ以下にもなりません。**

だから、目的関数の決めかたを間違えると、賢いAIほど困った動きをします。ボートレースのゲームで、ゴールせずに同じ場所をぐるぐる回って得点だけ稼ぎ続けたAIが有名です。これが報酬ハッキングで、人の望みと目的関数を合わせる仕事をアライメントと呼びます。

## 例文

- 「AIって、なんでおすすめ動画ばっかり出してくるの?」「目的関数が『長く見てもらう』になってるからだよ」
- 「目的関数って難しそう」「テストの採点基準みたいなものだよ。何を点にするかで、AIの育ちかたが決まるんだ」
