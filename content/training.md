---
slug: training
title: トレーニング
yomi: トレーニング
english: Training
english_yomi: トレーニング
japanese: 訓練、学習
difficulty: 中級
genres: [AI]
related: [training-data, machine-learning, inference, parameter, gpu, fine-tuning, data-center]
sources:
  - title: Google Machine Learning Crash Course
    url: https://developers.google.com/machine-learning/crash-course
  - title: Google Machine Learning Glossary
    url: https://developers.google.com/machine-learning/glossary
updated: 2026-09-09
---

## ひとことで

AIに大量の例を見せて、答えを当てられるように中身の数字を直していく工程のことです。

## なぜ大事?

**AIが「賢い」と言うとき、賢さはこの工程で決まっています。** 使うときのAIは、できあがった頭を動かしているだけ。電気代や半導体不足のニュースの大半は、この工程の話です。

## やさしい解説

AIの中身はパラメータと呼ばれる数字の山です。最初はでたらめな数字で、何を聞いても見当違いを返します。そこに学習データを一つ見せ、答えを出させ、正解とのずれの分だけ数字を少し直す。これを何兆回も繰り返すのがトレーニングです。人が「こう考えろ」と教えるのではなく、**ずれを減らす方向へ数字が勝手に寄っていく**のがミソです。

料理人の修行に似ています。レシピを暗記させるのではなく、作らせて食べさせて「もう少し塩を」と直す。それを何年も繰り返すと、レシピに無い料理も作れるようになる。AIも同じで、トレーニングの後は見たことのない質問に答えられます。

一番大きなAIのトレーニングは、GPU を何万台も並べて数か月かかり、電気代だけで数百億円と言われます。だから作れる組織が世界に数えるほどしかなく、いったん作ったものを皆で使う形になっています。使う側の工程は推論と呼び、区別します。

## 例文

- 「AIって毎日賢くなってるの?」「使ってる間は変わらないよ。賢くなるのはトレーニングのときだけなんだ」
- 「トレーニングってそんなにお金かかるの?」「GPU を何万台も何か月も回すからね。だから作れる会社が数えるほどしか無いんだよ」
