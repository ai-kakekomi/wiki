---
slug: dataset
title: データセット
yomi: データセット
english: Dataset
english_yomi: データセット
japanese: データの集まり
difficulty: 中級
genres: [AI, データ]
related: [training-data, annotation, training, csv, hugging-face, open-source, bias]
sources:
  - title: Hugging Face Datasets
    url: https://huggingface.co/datasets
  - title: e-Stat 政府統計の総合窓口
    url: https://www.e-stat.go.jp/
  - title: データカタログサイト DATA.GO.JP（デジタル庁）
    url: https://www.data.go.jp/
updated: 2026-09-09
---

## ひとことで

同じ形にそろえて、ひとまとめにしたデータの束のことです。

## なぜ大事?

**AIの性能は、どのデータセットで育てたかでほぼ決まります。** 半導体はお金で買えますが、質のよいデータセットは買えないことが多く、いまAIの会社が一番奪い合っているのはこれです。

## やさしい解説

写真が1万枚ばらばらにあるだけでは、データセットとは呼びません。大きさをそろえ、名前の付け方を決め、「これは猫」の札（アノテーション）を付け、表にして初めてデータセットになります。**材料をそろえて下ごしらえまで済ませた状態**、と考えると近いです。

有名なものは名前で呼ばれます。手書き数字の MNIST、写真の ImageNet。研究者は同じデータセットで競い、その点数でAIの進歩を測ってきました。いまは Hugging Face に何十万個ものデータセットが置かれ、誰でも持ってこられます。

日本の役所も出しています。e-Stat には国勢調査から物価まで、DATA.GO.JP には各省庁の表が並び、どれも無料です。団体の企画書で「この地域の高齢者は何人」と書くとき、根拠になるのはこういうデータセットです。

## 例文

- 「AI作るのに何が要るの?」「計算機とデータセットだよ。計算機は借りられるけど、いいデータセットは自分で作るしかないんだ」
- 「うちの区の高齢者の数、どこで分かる?」「e-Stat に国のデータセットがあるよ。国勢調査の表を区ごとに引けるんだ」
