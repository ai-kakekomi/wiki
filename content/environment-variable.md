---
slug: environment-variable
title: 環境変数
yomi: カンキョウヘンスウ
english: Environment Variable
english_yomi: エンバイロンメント・バリアブル
japanese: 動かす場所ごとの設定値
difficulty: 上級
genres: [プログラミング, セキュリティ]
related: [gitignore, api, backend, deploy, github, password, vibe-coding]
sources:
  - title: The Twelve-Factor App III. 設定
    url: https://12factor.net/ja/config
  - title: GitHub Actions でのシークレットの使用 | GitHub Docs
    url: https://docs.github.com/ja/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
updated: 2026-09-08
---

## ひとことで

プログラムの外側に置いておく設定値のことです。合言葉や接続先のように、プログラム本体には書きたくないものを入れます。

## なぜ大事?

AIにアプリを作らせると、必ずここに行き当たります。**AIの鍵やデータベースの合言葉を、プログラムの中にそのまま書いてしまう事故**が、初心者のいちばん多い失敗です。GitHub に公開した瞬間に世界中から読まれ、数時間で高額請求が来ることがあります。環境変数は、それを防ぐ置き場です。

## やさしい解説

家の合鍵を、玄関のドアに貼っておく人はいません。鍵は別の場所に持っていて、必要なときに使う。プログラムでも同じで、「本体」と「その場所でだけ使う値」を分けます。値のほうが環境変数です。

同じプログラムでも、自分のパソコンで試すときと、本番のサーバーで動かすときでは、つなぐ先も合言葉も違います。プログラムに書き込むと、場所ごとに書き換えなければならず、うっかり本番の合言葉を公開してしまう。外に置けば、プログラムは1つのまま、値だけ場所ごとに差し替えられます。The Twelve-Factor App という有名な指針でも、設定は環境変数に格納する、と定めています。

実際には `.env` という名前のファイルに書き、それを `.gitignore` で公開対象から外すのが定番です。AIに「.env に入れて、gitignore に書いて」と一言添えるだけで、事故の大半は防げます。

## 例文

- 「AIの鍵、どこに書けばいい?」「環境変数。.env に入れて、.gitignore で公開から外す。プログラムには書かない」
- 「GitHub に上げたら請求が来た」「鍵を本体に書いてたでしょ。環境変数に出しておけば起きなかった」
