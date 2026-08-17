/* かけこみ辞典 絞り込み。依存ゼロ・外部通信なし */
(function () {
  'use strict';

  var cardsWrap = document.getElementById('cards');
  var countEl = document.getElementById('count');
  var emptyEl = document.getElementById('empty');
  if (!cardsWrap) return;

  var cards = Array.prototype.slice.call(cardsWrap.querySelectorAll('.card'));
  var state = { difficulty: '', genre: '' };

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var ok = true;
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
      var active = state.difficulty || state.genre;
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

  apply();
})();
