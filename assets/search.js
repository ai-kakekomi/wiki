/* かけこみWiki 検索。依存ゼロ・外部通信なし（同じフォルダの search-index.json だけを読む） */
(function () {
  'use strict';

  var input = document.getElementById('q');
  var cardsWrap = document.getElementById('cards');
  var countEl = document.getElementById('count');
  var emptyEl = document.getElementById('empty');
  if (!input || !cardsWrap) return;

  var cards = Array.prototype.slice.call(cardsWrap.querySelectorAll('.card'));
  var index = [];
  var state = { q: '', difficulty: '', genre: '' };

  function toHiragana(s) {
    return String(s).replace(/[ァ-ヶ]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0x60);
    });
  }
  function normalize(s) {
    return toHiragana(String(s)).toLowerCase().replace(/[・･·\s　ー-]/g, '');
  }

  // 部分一致でヒットしたら 1点、前方一致なら 3点、完全一致なら 5点
  function fieldScore(field, q) {
    var f = normalize(field);
    if (!f || !q) return 0;
    if (f === q) return 5;
    if (f.indexOf(q) === 0) return 3;
    if (f.indexOf(q) !== -1) return 1;
    return 0;
  }

  function score(entry, q) {
    var s = 0;
    s += fieldScore(entry.title, q) * 3;
    s += fieldScore(entry.yomi, q) * 3;
    s += fieldScore(entry.english || '', q) * 2;
    (entry.genres || []).forEach(function (g) { s += fieldScore(g, q); });
    return s;
  }

  function apply() {
    var q = normalize(state.q);
    var scores = {};
    if (q) {
      index.forEach(function (e) { scores[e.slug] = score(e, q); });
    }

    var shown = 0;
    var ranked = cards.map(function (card) {
      var slug = card.getAttribute('href').replace(/\/$/, '');
      var ok = true;
      if (state.difficulty && card.getAttribute('data-difficulty') !== state.difficulty) ok = false;
      if (state.genre) {
        var genres = (card.getAttribute('data-genres') || '').split(',');
        if (genres.indexOf(state.genre) === -1) ok = false;
      }
      var sc = q ? (scores[slug] || 0) : 0;
      if (q && sc === 0) ok = false;
      card.hidden = !ok;
      if (ok) shown++;
      return { card: card, score: sc };
    });

    if (q) {
      ranked.sort(function (a, b) { return b.score - a.score; });
      ranked.forEach(function (r) { cardsWrap.appendChild(r.card); });
    }

    if (countEl) {
      countEl.textContent = shown + ' 件の言葉が見つかりました';
    }
    if (emptyEl) emptyEl.hidden = shown !== 0;
  }

  input.addEventListener('input', function () {
    state.q = input.value;
    apply();
  });

  Array.prototype.forEach.call(document.querySelectorAll('.filter-btn'), function (btn) {
    btn.addEventListener('click', function () {
      var isDifficulty = btn.hasAttribute('data-difficulty');
      var key = isDifficulty ? 'difficulty' : 'genre';
      state[key] = isDifficulty ? btn.getAttribute('data-difficulty') : btn.getAttribute('data-genre');
      var group = isDifficulty ? '.filter-btn[data-difficulty]' : '.filter-btn[data-genre]';
      Array.prototype.forEach.call(document.querySelectorAll(group), function (b) {
        b.classList.remove('is-on');
      });
      btn.classList.add('is-on');
      apply();
    });
  });

  fetch('search-index.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { index = data; apply(); })
    .catch(function () { /* 検索インデックスが読めなくても一覧はそのまま使える */ });

  apply();
})();
