/* ===== 読んだ言葉をおぼえておく =====
 *
 * この端末の中だけに残します。サーバーへは何も送りません。
 * 使えない設定（プライベートウィンドウなど）でも、ふつうに読めるようにしてあります。
 *
 * 数を見せるのは、義務にするためではなく、
 * 「こんなに知らない言葉を覚えたのか」と気づいてもらうためです。
 * だから残りの数は出しません。増えた数だけを出します。 */
(function () {
  var KEY = "kakekomi-read";

  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Object.prototype.toString.call(v) === "[object Array]" ? v : [];
    } catch (_) {
      return [];      /* 読めなくても止まらない */
    }
  }

  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (_) { /* 保存できなくても読める */ }
  }

  /* ---------- 記事のページ：開いたら覚える ---------- */
  var slug = document.body.getAttribute("data-slug");
  if (slug) {
    var seen = load();
    if (seen.indexOf(slug) < 0) {
      seen.push(slug);
      save(seen);
    }
    return;
  }

  /* ---------- 一覧のページ：読んだものに印をつけて、数を出す ---------- */
  var box = document.getElementById("progress");
  if (!box) return;

  var cards = document.querySelectorAll(".card");
  var read = load();
  var done = 0;

  Array.prototype.forEach.call(cards, function (card) {
    var s = (card.getAttribute("href") || "").replace(/\/$/, "");
    if (read.indexOf(s) < 0) return;
    card.classList.add("is-read");
    done++;
  });

  if (!done) return;    /* 1つも読んでいないうちは、何も出さない */

  var total = cards.length;
  var pct = Math.round(done / total * 100);

  var word = done >= total ? "ぜんぶ読みました。おつかれさまでした。"
    : done >= 50 ? "半分近くまで来ました。"
    : done >= 20 ? "だいぶ増えてきました。"
    : done >= 5  ? "この調子です。"
    : "ここから増えていきます。";

  box.hidden = false;
  box.innerHTML =
    '<div class="progress-head">' +
      '<strong class="progress-num">' + done + '</strong>' +
      '<span class="progress-unit">語 読みました</span>' +
      '<span class="progress-word">' + word + '</span>' +
      '<button type="button" class="progress-reset" id="progress-reset">記録を消す</button>' +
    '</div>' +
    '<div class="progress-bar"><i style="width:' + pct + '%"></i></div>';

  document.getElementById("progress-reset").addEventListener("click", function () {
    if (!window.confirm("読んだ記録を消します。よろしいですか?")) return;
    try { localStorage.removeItem(KEY); } catch (_) { /* 消せなくても続ける */ }
    location.reload();
  });
})();
