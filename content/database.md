---
slug: database
title: データベース
yomi: データベース
english: Database
english_yomi: データベース
japanese: 整理して保管されたデータの集まり
difficulty: 中級
genres: [データベース]
related: [supabase, rls, api]
sources:
  - title: What Is PostgreSQL? | PostgreSQL Documentation
    url: https://www.postgresql.org/docs/current/intro-whatis.html
  - title: Architecture | Supabase Docs
    url: https://supabase.com/docs/guides/getting-started/architecture
updated: 2026-08-16
---

## ひとことで

たくさんの情報を、あとから一瞬で探し出せる形にして保管しておく仕組みです。

## なぜ大事?

コンビニの在庫も、銀行の残高も、病院のカルテも、置き場所はデータベースです。あなたがATMでお金をおろせるのも、その裏で残高が正しく守られているからです。

## やさしい解説

データベースは、図書館のようなものです。本を段ボールに詰めて倉庫に積むだけなら、十箱までは探せます。一万箱になるとお手上げです。図書館は棚を分類で分け、背表紙にラベルを貼り、目録を別に持っています。だから何十万冊あっても数十秒で一冊にたどり着けます。

情報は表の形で持つのが基本です。一行が一件、一列が一項目。名前の列、学年の列、といった具合です。この表に「三年生だけ見せて」と話しかける専用の言葉があり、英語に近い形なので慣れると読めます。

ただし、速く取り出せることと、正しい人にだけ渡せることは別の仕事です。名前や連絡先を預かる以上、誰がどの行を見てよいかを決めておかないと、便利さがそのまま事故になります。

## 例文

- 「この図書館、本がすぐ見つかるね」「データベースで管理してるからだよ」
- 「名簿をデータベースに入れるなら、誰が見ていいかも決めようね」
