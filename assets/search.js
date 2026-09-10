/* かけこみ辞典 絞り込み。依存ゼロ・外部通信なし */
(function () {
  'use strict';

  var cardsWrap = document.getElementById('cards');
  var countEl = document.getElementById('count');
  var emptyEl = document.getElementById('empty');
  if (!cardsWrap) return;

  var cards = Array.prototype.slice.call(cardsWrap.querySelectorAll('.card'));
  var state = { difficulty: '', genre: '', q: '' };

  // scripts/text.mjs の normalize と同じ規則。カタカナ→ひらがな、小文字化、区切り記号と長音を捨てる
  function normalize(s) {
    return String(s).normalize('NFKC')
      .replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); })
      .toLowerCase()
      .replace(/[・･・\s　ー-]/g, '');
  }

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var ok = true;
      if (state.q && (card.getAttribute('data-key') || '').indexOf(state.q) === -1) ok = false;
      if (state.difficulty && card.getAttribute('data-difficulty') !== state.difficulty) ok = false;
      if (state.genre) {
        var genres = (card.getAttribute('data-genres') || '').split(',');
        if (genres.indexOf(state.genre) === -1) ok = false;
      }
      card.hidden = !ok;
      if (ok) shown++;
    });

    // グループ内に言葉が1つも残らないときは見出しごと隠す
    Array.prototype.forEach.call(cardsWrap.querySelectorAll('.word-group'), function (group) {
      group.hidden = !group.querySelector('.card:not([hidden])');
    });

    if (countEl) {
      var active = state.difficulty || state.genre || state.q;
      countEl.hidden = !active;
      countEl.textContent = shown + ' 件の言葉が見つかりました';
    }
    if (emptyEl) emptyEl.hidden = shown !== 0;
  }

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

  var q = document.getElementById('q');
  if (q) {
    q.addEventListener('input', function () {
      state.q = normalize(q.value);
      apply();
    });
    // Enter で候補が1つなら、その記事へ
    q.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var left = cards.filter(function (c) { return !c.hidden; });
      if (left.length === 1) location.href = left[0].getAttribute('href');
    });
  }

  apply();
})();
