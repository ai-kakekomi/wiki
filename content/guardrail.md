---
slug: guardrail
title: ガードレール
yomi: ガードレール
english: Guardrail
english_yomi: ガードレール
japanese: 防護柵
difficulty: 中級
genres: [AI, セキュリティ]
related: [hallucination, prompt-injection, system-prompt, ai-agent, claude-md]
sources:
  - title: Reduce hallucinations | Claude Docs
    url: https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
  - title: Japan AISI（AIセーフティ・インスティテュート）
    url: https://aisi.go.jp/
updated: 2026-09-08
---

## ひとことで

AIが道を外れないように、あらかじめ置いておく柵のことです。

## なぜ大事?

AIは、頼めばたいてい何でもやろうとします。**だから「やらないこと」を先に決めておかないと、いつか事故が起きます。**知らないことを知っている風に答える、渡してはいけない情報を渡す、勝手に買い物をする。柵は、そうなる前に止めるためのものです。

## やさしい解説

山道の崖側にある柵と同じです。ふだんは意識しませんが、ハンドルを切り損ねたときに命を守ります。AIの柵も、ふつうの会話では見えず、AIが変な方向に行きかけたときだけ効きます。

柵にはいくつか種類があります。「知らないときは知らないと言う」と指示してハルシネーションを減らす。読ませた文章の中の命令に従わないようにしてプロンプトインジェクションを防ぐ。お金や個人情報を扱う操作は、AIの判断に関係なく人の確認を挟む。**最後の1つがいちばん確実**で、指示文は破られることがあっても、仕組みで止めたものは破られません。

日本では AIセーフティ・インスティテュート（AISI）が、安全性を評価する観点をまとめています。AIかけこみ寺でも、名簿は決まった手順でしか触れないようにして、指示より仕組みで止めています。

## 例文

- 「AIに任せて大丈夫?」「ガードレール次第。やらないことを先に決めて、大事なところは人が確認する」
- 「『やるな』って書いたのにやった」「書くだけの柵は破られる。仕組みで止めるのが本物の柵」
