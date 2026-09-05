---
slug: javascript
title: JavaScript
yomi: ジャバスクリプト
english: JavaScript
english_yomi: ジャバスクリプト
japanese: ブラウザの中で動きを作る言葉
difficulty: 上級
genres: [プログラミング]
related: [html, css, browser, python, vibe-coding]
sources:
  - title: JavaScript | MDN Web Docs
    url: https://developer.mozilla.org/ja/docs/Web/JavaScript
updated: 2026-09-05
---

## ひとことで

ホームページに動きをつけるための言葉です。

## なぜ大事?

**ブラウザの中で動かせる言葉は、事実上これだけです。** 押したら開く、入力したら結果が出る、といったふるまいは全部これ。他の言語がどれだけ優れていても、この場所では代わりになりません。

## やさしい解説

HTMLが骨、CSSが服なら、JavaScriptは動きです。

```javascript
document.getElementById("btn").addEventListener("click", function () {
  alert("押されました");
});
```

「このボタンが押されたら、これを出す」。読めなくても構いませんが、**何かが起きたときに、何をするか**を書いているのだと分かれば十分です。

生まれは1995年で、10日ほどで作られたと言われています。急ごしらえだったため妙な癖が残っていますが、**ブラウザに入っているという一点で他を圧倒しました。** いまでは、ホームページの外でも動きます。

名前にJavaと入っていますが、**Javaという別の言語とは関係ありません。** 当時の流行にあやかっただけです。ここは今でも混乱のもとになっています。

## 例文

- 「ボタンを押しても何も起きない」「JavaScriptのところだね。動きを担当しているから」
- 「JavaとJavaScriptって同じ?」「まったく別だよ。名前だけ似せたんだ」
