import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseFrontmatter, splitFrontmatter } from '../scripts/frontmatter.mjs';
import { validateArticle } from '../scripts/validate.mjs';
import { normalize, toHiragana, summarize, escapeHtml } from '../scripts/text.mjs';
import { ROOT, loadArticles, buildSearchIndex, stepDownTargets, renderArticle, renderIndex } from '../scripts/build.mjs';
import { linkify, findCandidates } from '../scripts/link.mjs';

const SAMPLE = `---
slug: demo
title: デモ
yomi: デモ
difficulty: 中級
genres: [テスト]
related: [rls, nowhere]
sources:
  - title: 公式ドキュメント
    url: https://example.com/doc
updated: 2026-08-16
---

## ひとことで

ためしの記事です。

## なぜ大事?

テストのため。

## やさしい解説

たとえ話。
`;

test('frontmatter: 本文とメタを分けられる', () => {
  const { frontmatter, body } = splitFrontmatter(SAMPLE);
  assert.match(frontmatter, /slug: demo/);
  assert.match(body, /^## ひとことで/);
});

test('frontmatter: 配列・オブジェクト配列を読める', () => {
  const { data } = parseFrontmatter(SAMPLE);
  assert.deepEqual(data.genres, ['テスト']);
  assert.deepEqual(data.related, ['rls', 'nowhere']);
  assert.equal(data.sources[0].url, 'https://example.com/doc');
});

test('frontmatter: --- がなければ落ちる', () => {
  assert.throws(() => splitFrontmatter('# 見出しだけ\n'), /フロントマター/);
});

test('validate: 正しい記事はエラーゼロ', () => {
  const { data, body } = parseFrontmatter(SAMPLE);
  assert.deepEqual(validateArticle({ data, body, filename: 'demo.md' }), []);
});

test('validate: ファイル名と slug の不一致を検出', () => {
  const { data, body } = parseFrontmatter(SAMPLE);
  const errs = validateArticle({ data, body, filename: 'other.md' });
  assert.ok(errs.some((e) => e.includes('一致しません')));
});

test('validate: difficulty が4種以外なら落ちる', () => {
  const { data, body } = parseFrontmatter(SAMPLE.replace('difficulty: 中級', 'difficulty: ふつう'));
  const errs = validateArticle({ data, body, filename: 'demo.md' });
  assert.ok(errs.some((e) => e.includes('difficulty')));
});

test('validate: english があるのに english_yomi と japanese がなければ落ちる', () => {
  const { data, body } = parseFrontmatter(SAMPLE.replace('yomi: デモ', 'yomi: デモ\nenglish: Demo'));
  const errs = validateArticle({ data, body, filename: 'demo.md' });
  assert.ok(errs.some((e) => e.includes('english_yomi')));
  assert.ok(errs.some((e) => e.includes('japanese')));
});

test('validate: yomi がひらがなだと落ちる', () => {
  const { data, body } = parseFrontmatter(SAMPLE.replace('yomi: デモ', 'yomi: でも'));
  const errs = validateArticle({ data, body, filename: 'demo.md' });
  assert.ok(errs.some((e) => e.includes('カタカナ')));
});

test('validate: 必須セクションが欠けたら落ちる', () => {
  const { data, body } = parseFrontmatter(SAMPLE.replace('## なぜ大事?', '## どうして'));
  const errs = validateArticle({ data, body, filename: 'demo.md' });
  assert.ok(errs.some((e) => e.includes('なぜ大事?')));
});

test('validate: 本文に一次資料の見出しを書いたら落ちる', () => {
  const { data, body } = parseFrontmatter(SAMPLE + '\n## 一次資料\n\n- なにか\n');
  const errs = validateArticle({ data, body, filename: 'demo.md' });
  assert.ok(errs.some((e) => e.includes('frontmatter')));
});

test('text: カタカナをひらがなに正規化する', () => {
  assert.equal(toHiragana('アールエルエス'), 'あーるえるえす');
  assert.equal(normalize('ロウ・レベル・セキュリティ'), normalize('ろうれべるせきゅりてぃ'));
  assert.equal(normalize('Row Level Security'), 'rowlevelsecurity');
});

test('text: ひとことで から80字の要約を取る', () => {
  const { body } = parseFrontmatter(SAMPLE);
  assert.equal(summarize(body), 'ためしの記事です。');
  assert.ok(summarize('## ひとことで\n\n' + 'あ'.repeat(200)).length <= 81);
});

test('text: HTML特殊文字をエスケープする', () => {
  assert.equal(escapeHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('content/ の全記事が検証を通る', () => {
  const { articles, errors } = loadArticles();
  assert.deepEqual(errors, []);
  assert.ok(articles.length >= 1);
});

test('search-index の各項目が必要なキーを持つ', () => {
  const { articles } = loadArticles();
  const index = buildSearchIndex(articles);
  for (const e of index) {
    for (const key of ['slug', 'title', 'yomi', 'english', 'difficulty', 'genres', 'summary']) {
      assert.ok(key in e, `${key} がありません`);
    }
    assert.ok(e.summary.length <= 81);
  }
});

test('ステップダウン先は自分より下の難易度だけ', () => {
  const easy = { slug: 'a', difficulty: '初級' };
  const mid = { slug: 'b', difficulty: '中級' };
  const bySlug = new Map([['a', easy], ['b', mid]]);
  const hard = { slug: 'c', difficulty: '特級', related: ['a', 'b'] };
  const targets = stepDownTargets(hard, bySlug);
  assert.deepEqual(targets.map((t) => t.slug), ['b', 'a']);
  assert.deepEqual(stepDownTargets(easy, bySlug), []);
});

test('記事HTML: 難易度属性・よみ・英語併記・相対パスが入る', () => {
  const { articles } = loadArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const template = readFileSync(join(ROOT, 'templates', 'article.html'), 'utf8');
  const rls = bySlug.get('rls');
  const warnings = [];
  const html = renderArticle(rls, bySlug, template, (m) => warnings.push(m));

  assert.match(html, /<body data-difficulty="特級">/);
  assert.match(html, /アールエルエス/);
  assert.match(html, /Row Level Security/);
  assert.match(html, /ロウ・レベル・セキュリティ/);
  assert.match(html, /行単位のアクセス制御/);
  assert.match(html, /href="\.\.\/assets\/wiki\.css"/);
  assert.doesNotMatch(html, /\{\{[A-Z_]+\}\}/);
  // 未収録 slug は警告のうえ本文に出さない
  assert.ok(warnings.some((w) => w.includes('database') || w.includes('supabase')));
  assert.doesNotMatch(html, /href="\.\.\/database\//);
});

test('記事HTML: OGP と description を持つ', () => {
  const { articles } = loadArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const template = readFileSync(join(ROOT, 'templates', 'article.html'), 'utf8');
  const html = renderArticle(bySlug.get('rls'), bySlug, template);
  assert.match(html, /<meta name="description" content="[^"]+">/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:url" content="https:\/\/ai-kakekomi\.com\/wiki\/rls\/"/);
});

test('トップページ: カード・検索欄・絞り込みが入る', () => {
  const { articles } = loadArticles();
  const html = renderIndex(articles);
  assert.match(html, /id="q"/);
  assert.match(html, /class="card" href="rls\/"/);
  assert.match(html, /data-difficulty="特級"/);
  assert.match(html, /data-genre="データベース"/);
  assert.match(html, /assets\/search\.js/);
});

test('配信物に外部CDNの読み込みがない', () => {
  const files = ['assets/wiki.css', 'assets/search.js', 'templates/article.html'];
  for (const f of files) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    assert.doesNotMatch(src, /https?:\/\/(cdn|unpkg|fonts|ajax|cdnjs)\./, `${f} が外部CDNを参照しています`);
  }
});

test('em dash を使っていない', () => {
  for (const f of ['content/rls.md', 'assets/wiki.css', 'scripts/build.mjs']) {
    assert.doesNotMatch(readFileSync(join(ROOT, f), 'utf8'), /[—―]/, `${f} に em dash があります`);
  }
});

const VOCAB = [
  { term: 'プルリクエスト', slug: 'pull-request' },
  { term: 'プル', slug: 'pull' },
  { term: 'RLS', slug: 'rls' },
];

test('link: 長い語を優先し、初出だけリンクにする', () => {
  const src = 'プルリクエストを送る。プルリクエストはもう一度出てくる。';
  const { text } = linkify(src, VOCAB);
  assert.equal(text.match(/\]\(https/g).length, 1);
  assert.match(text, /\[プルリクエスト\]\(https:\/\/ai-kakekomi\.com\/wiki\/pull-request\)/);
});

test('link: コードブロック・見出し・既存リンクの中は書き換えない', () => {
  const src = '# RLS の話\n\n```\nRLS\n```\n\n`RLS`\n\n[RLS](https://example.com)\n';
  const { text } = linkify(src, VOCAB);
  assert.equal(text, src);
});

test('link: 英単語の一部には食い込まない', () => {
  const src = 'CURLS は関係ない語です。\n';
  const { text } = linkify(src, VOCAB);
  assert.equal(text, src);
});

test('link: 未収録の専門用語候補を拾う', () => {
  const cands = findCandidates('スケーラビリティとRLSとプルの話。スケーラビリティは大事。', VOCAB).map((c) => c.term);
  assert.ok(cands.includes('スケーラビリティ'));
  assert.ok(!cands.includes('RLS'));
});
