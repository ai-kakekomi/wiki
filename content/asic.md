---
slug: asic
title: ASIC
yomi: エーシック
english: Application Specific Integrated Circuit
english_yomi: アプリケーション・スペシフィック・インテグレーテッド・サーキット
japanese: 用途を決めて作る集積回路
difficulty: 上級
genres: [半導体, AI]
related: [gpu, semiconductor, transistor, nvidia, data-center, google]
sources:
  - title: Cloud TPU の概要 | Google Cloud
    url: https://cloud.google.com/tpu/docs/intro-to-tpu?hl=ja
updated: 2026-09-08
---

## ひとことで

「この仕事だけ」と用途を決めて作る半導体のことです。何でもできるかわりに遅い汎用の部品と対になります。

## なぜ大事?

AIの計算は、いま NVIDIA の GPU がほぼ独占しています。**その独占を崩そうとしている相手が ASIC です。**Google も Amazon も Microsoft も、自分のAIのためだけの半導体を作り始めました。ニュースで「自社設計のAI半導体」と出たら、それはこれのことです。

## やさしい解説

包丁にたとえると、何でも切れる三徳包丁が汎用の部品（CPU や GPU）、刺身だけを引く柳刃が ASIC です。柳刃で野菜は切れませんが、刺身なら三徳より速く、きれいに、力も要らない。用途を絞るほど、同じ電気で多くの計算ができます。

Google の TPU がその代表で、AIの計算に出てくる「かけ算と足し算の繰り返し」だけを、ものすごい数並べた作りです。Google の説明でも、TPU は機械学習のために特別に設計された集積回路、と書かれています。ビットコインを掘る専用機も ASIC です。

弱点は、用途が変わると使えなくなることと、設計に何年と数百億円がかかること。だから、計算の中身が固まったところから順に ASIC に置き換わり、まだ変わり続けるところは GPU が残ります。AIの計算がどこまで固まったか。ASIC の広がり方は、その目安です。

## 例文

- 「Google が自分で半導体作ってるって?」「TPU。AI専用の ASIC。柳刃包丁みたいに、その仕事だけ速い」
- 「NVIDIA は安泰?」「ASIC が増えるほど、決まった計算は取られる。まだ変わる計算は GPU に残る」
