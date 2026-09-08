---
slug: harness
title: ハーネス
yomi: ハーネス
english: Harness
english_yomi: ハーネス
japanese: 馬具、引き具
difficulty: 上級
genres: [AI, プログラミング]
related: [ai-agent, sandbox, guardrail, claude-code, skill, claude-md, subagent]
sources:
  - title: Effective harnesses for long-running agents | Anthropic
    url: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
  - title: Demystifying evals for AI agents | Anthropic
    url: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
updated: 2026-09-08
---

## ひとことで

AIを「考える頭」から「働く手足つきの道具」にするための、まわりの仕組み全部のことです。

## なぜ大事?

同じAIの頭でも、ハーネスが違えば、できることも事故の起きやすさもまるで違います。**Claude Code が ChatGPT の画面と違って、ファイルを直したり命令を実行したりできるのは、頭が違うのではなく、ハーネスが違うから**です。AIの道具を選ぶ、作る、任せる、のどの場面でも、見るべきは頭よりここです。

## やさしい解説

もとは馬につける引き具のことです。馬そのもの（AIの頭）がどれだけ強くても、引き具が無ければ荷車は引けません。引き具が良ければ、同じ馬でもまっすぐ、安全に、長く働けます。

Anthropic の説明では、ハーネスは入力を受け取り、道具の呼び出しをさばき、結果を返す仕組み、とされています。具体的には、AIが使える道具の一覧（ファイルを読む、命令を実行する、ネットを見る）、毎回読ませる決まりごと（CLAUDE.md）、危ないことを止める柵（ガードレール）、間違えても外に影響が出ない囲い（サンドボックス）。この束がハーネスです。

大事な考え方が1つあります。**ハーネスの部品は、それぞれ「AIはこれを自分でできない」という前提で置かれている。**AIの頭が賢くなると、その前提は古くなります。去年は必要だった手すりが、今年は邪魔になることがある。だからハーネスは、作って終わりではなく、頭の進化に合わせて外したり足したりし続けるものです。

## 例文


- 「Claude Code と ChatGPT、何が違うの?」「頭は近いよ。違うのはハーネス。ファイルを触れる手足と、それを縛る柵がついてるんだ」
- 「AIに任せる仕組み、去年作ったまま」「ハーネスは頭の進化で古くなるんだよね。要らなくなった手すりが無いか、見直しどきだよ」
