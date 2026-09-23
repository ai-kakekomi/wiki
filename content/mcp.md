---
slug: mcp
title: MCP
yomi: エムシーピー
english: Model Context Protocol
english_yomi: モデル・コンテキスト・プロトコル
japanese: モデル文脈規約（AIと外の道具をつなぐ共通の差込口）
difficulty: 上級
genres: [AI, プログラミング]
related: [ai-agent, api, claude-code, context, skill, generative-ai]
sources:
  - title: What is the Model Context Protocol (MCP)?
    url: https://modelcontextprotocol.io/
  - title: Introducing the Model Context Protocol | Anthropic
    url: https://www.anthropic.com/news/model-context-protocol
updated: 2026-09-18
---

## ひとことで

AIと、外にある道具やデータをつなぐための、共通の差込口の規格です。

## なぜ大事?

AIが「賢く答える」段階から「**あなたの代わりに手を動かす**」段階に進むのが、この規格の上です。カレンダーを見て予定を入れる、表計算を開いて計算する。そういう当たり前が、来年あたり普通になります。

## やさしい解説

公式の説明は「**AIにとってのUSB-C**」です。かつて携帯電話の充電器はメーカーごとにバラバラで、機種を替えるたびに買い直していました。いまはUSB-Cが1つあれば、どの機器にも挿さります。

AIも同じでした。カレンダーにつなぐ、地図につなぐ、社内のデータにつなぐ。相手ごとに専用の配線を書く必要があり、組み合わせの数だけ手間がかかっていました。MCPという形を決めておけば、道具の側は1回作れば、どのAIからも使ってもらえます。

2024年11月にAnthropicが公開し、誰でも使える形にしたところ、ChatGPTや開発ツールも次々に対応しました。**規格を独り占めせず手放したことで、かえって広まった**という例です。

## 例文

- 「AIがカレンダーを見られるって、どうやってるの?」「MCPっていう共通の差込口があるんだよ。USB-Cみたいなものだね」
- 「便利そうだけど、勝手に予定を入れられたら困るな」「だから、どの道具を使わせるかは自分で選ぶ仕組みになってるんだ」
