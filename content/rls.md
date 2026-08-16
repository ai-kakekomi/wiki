---
slug: rls
title: RLS
yomi: アールエルエス
english: Row Level Security
english_yomi: ロウ・レベル・セキュリティ
japanese: 行単位のアクセス制御
difficulty: 特級
genres: [データベース, セキュリティ]
related: [database, supabase]
sources:
  - title: Row Level Security | Supabase Docs
    url: https://supabase.com/docs/guides/database/postgres/row-level-security
  - title: Row Security Policies | PostgreSQL Documentation
    url: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
updated: 2026-08-16
---

## ひとことで

同じ表を見ても人によって見える行がちがう、という仕組みです。

## なぜ大事?

あなたが使っているアプリの中では、あなたのデータも他人のデータも、実はひとつの大きな表に並んで入っています。そこで自分の行だけが見えているのは当たり前ではなく、誰かが仕掛けを入れているからです。その仕掛けが外れた日が、個人情報の流出事故になります。

## やさしい解説

学校の全校生徒の成績が、1冊のノートにまとまっているとします。これを机に置いて「自分のページだけ見てね」とお願いするのが、いちばん危ないやり方です。ルールを守る人ばかりなら平気ですが、一度めくられたら終わりです。

RLSは、そのノートに司書さんをつけるようなものです。誰かが見に来ると、司書さんが本人かどうか確かめて、その人のページだけを開いて渡します。他のページは、頼まれても開きません。お願いではなく、そもそも手が届かないようにする。ここが肝心なところです。

行という言葉は、表の横一列のこと。データベースの世界では、ひとりぶんの記録がちょうど一行になっていることが多く、だから「行ごとの守り」という名前がついています。
