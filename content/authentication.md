---
slug: authentication
title: 認証
yomi: ニンショウ
english: Authentication
english_yomi: オーセンティケーション
japanese: 本人であることの確認
difficulty: 上級
genres: [セキュリティ]
related: [api, database, supabase]
sources:
  - title: NIST SP 800-63B Digital Identity Guidelines: Authentication and Lifecycle Management
    url: https://pages.nist.gov/800-63-3/sp800-63b.html
  - title: NIST SP 800-207 Zero Trust Architecture | NIST
    url: https://csrc.nist.gov/pubs/sp/800/207/final
updated: 2026-08-16
---

## ひとことで

アクセスしてきた相手が本当に本人かどうかを確かめる手続きのことです。

## なぜ大事?

銀行もSNSも写真も、いまは全部ログインの向こう側にあります。そこが破られると中の対策はほとんど効きません。しかも破られ方の大半は、高度な攻撃ではなくパスワードの使い回しです。

## やさしい解説

本人確認の材料は、大きく3種類しかありません。知っているもの（パスワード）、持っているもの（スマホに届くコード）、本人自身（指紋や顔）です。米国のNISTという機関がまとめた指針でも、この3つの分け方が使われています。

このうち2種類以上を組み合わせるのが、多要素認証です。家にたとえるなら、鍵とチェーンの両方がある状態。鍵は落とせば拾われますが、チェーンは中にいる人しか外せません。性質のちがう守りを重ねるのがねらいです。銀行のアプリがログイン後にもう一度コードを聞いてくるのは、これをやっています。

意外なことに、よくある突破口は人間です。仕組みを破るより、電話をかけて確認コードを聞き出すほうが安上がりだからです。コードは誰にも教えない。パスワードは使い回さない。この2つだけでも、かなりの事故は防げます。
