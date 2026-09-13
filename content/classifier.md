---
slug: classifier
title: 分類器
yomi: ブンルイキ
english: Classifier
english_yomi: クラシファイア
japanese: 分類器（入ってきたものを、どの箱に入れるか決める仕組み）
difficulty: 中級
genres: [AI]
related: [machine-learning, training-data, guardrail, phishing, face-recognition, generative-ai]
sources:
  - title: Classification | Machine Learning Crash Course | Google for Developers
    url: https://developers.google.com/machine-learning/crash-course/classification
  - title: Constitutional Classifiers | Anthropic
    url: https://www.anthropic.com/research/constitutional-classifiers
updated: 2026-09-13
---

## ひとことで

入ってきたものを見て「これはAの箱、これはBの箱」と振り分けるAIの部品です。

## なぜ大事?

迷惑メールが勝手に別フォルダへ行くのも、写真アプリが「これは猫」と当てるのも、分類器の仕事です。**AIの便利さの半分くらいは、じつは「生成」ではなく「仕分け」でできています。**

## やさしい解説

分類器は、たくさんの「見本と正解」の組を見て、仕分けの基準を自分で身につけます。迷惑メールなら、何万通ものメールと「迷惑か、そうでないか」の札を見せて、怪しい言い回しや送り方の癖を覚えるという具合です。新しいメールが来たら、覚えた基準に照らして「迷惑の確率92%」のように答えます。

たとえるなら、郵便局の仕分け担当です。宛先を読んで地域ごとの棚に放り込む。ひとつひとつは単純でも、量と速さで人間にはかないません。

ChatGPTのような文章を作るAIの中でも、分類器は裏方として働いています。**質問が危ない内容かどうかを先に見張り、答えを出す前に止める**のは、生成AI本体ではなく、その前後に置かれた分類器です。ときどき無害な質問まで止めてしまうのは、この仕分けが少し厳しめに調整されているからです。

## 例文

- 「迷惑メールって、誰が仕分けてるの?」「分類器っていうAIだよ。何万通も見て、怪しい癖を覚えてるんだ」
- 「AIに普通の質問したのに断られたんだけど」「本体じゃなくて、手前の分類器が厳しめに止めたんだと思うよ」
