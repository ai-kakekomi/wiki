#!/usr/bin/env node
// content/*.md を読み、記事HTML・トップページ・検索インデックスを生成する。
// 生成物はリポジトリにそのままコミットする（配信は完全静的・依存ゼロ）。

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { marked } from 'marked';
import { parseFrontmatter, DIFFICULTIES } from './frontmatter.mjs';
import { validateArticle } from './validate.mjs';
import { escapeHtml, summarize } from './text.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function loadArticles(contentDir = join(ROOT, 'content')) {
  const files = readdirSync(contentDir).filter((f) => f.endsWith('.md')).sort();
  const articles = [];
  const errors = [];
  for (const filename of files) {
    const raw = readFileSync(join(contentDir, filename), 'utf8');
    let parsed;
    try {
      parsed = parseFrontmatter(raw);
    } catch (err) {
      errors.push(`${filename}: ${err.message}`);
      continue;
    }
    const errs = validateArticle({ ...parsed, filename });
    if (errs.length) errors.push(...errs.map((m) => `${filename}: ${m}`));
    articles.push({ ...parsed.data, body: parsed.body, filename });
  }
  return { articles, errors };
}

export function buildSearchIndex(articles) {
  return articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    yomi: a.yomi,
    english: a.english || '',
    difficulty: a.difficulty,
    genres: a.genres || [],
    summary: summarize(a.body),
  }));
}

// related のうち、自分より一段やさしい記事を返す（なければ空）
export function stepDownTargets(article, bySlug) {
  const myRank = DIFFICULTIES.indexOf(article.difficulty);
  return (article.related || [])
    .map((s) => bySlug.get(s))
    .filter((r) => r && DIFFICULTIES.indexOf(r.difficulty) < myRank)
    .sort(
      (a, b) => DIFFICULTIES.indexOf(b.difficulty) - DIFFICULTIES.indexOf(a.difficulty)
    );
}

const chips = (genres) =>
  (genres || []).map((g) => `<span class="chip">${escapeHtml(g)}</span>`).join('');

// 「## ひとことで」の1文をヒーロー表示用に切り出し、本文からは除く
export function splitHitokoto(body) {
  const m = body.match(/##\s*ひとことで\s*\n+([\s\S]*?)(?=\n##\s|$)/);
  const hitokoto = m ? m[1].trim() : '';
  const rest = m ? body.replace(m[0], '').trim() : body;
  return { hitokoto, rest };
}


function englishBlock(a) {
  if (!a.english) return '';
  return `<p class="english"><span class="en">${escapeHtml(a.english)}</span>` +
    `<span class="en-yomi">${escapeHtml(a.english_yomi)}</span>` +
    `<span class="en-ja">${escapeHtml(a.japanese)}</span></p>`;
}

function relatedBlock(a, bySlug, warn) {
  const items = [];
  for (const slug of a.related || []) {
    const r = bySlug.get(slug);
    if (!r) {
      warn(`${a.filename}: related の "${slug}" はまだ記事がないので表示しません`);
      continue;
    }
    items.push(
      `<li><a href="../${r.slug}/"><span class="badge badge-inline" data-difficulty="${escapeHtml(r.difficulty)}">${escapeHtml(r.difficulty)}</span>${escapeHtml(r.title)}</a></li>`
    );
  }
  if (!items.length) return '';
  return `<section class="related"><h2>関連ワード</h2><ul class="related-list">${items.join('')}</ul></section>`;
}

function sourcesBlock(a) {
  const items = (a.sources || [])
    .map((s) => `<li><a href="${escapeHtml(s.url)}" rel="noopener nofollow" target="_blank">${escapeHtml(s.title)}</a></li>`)
    .join('');
  return `<section class="sources"><h2>一次資料</h2><ul>${items}</ul></section>`;
}

export function renderArticle(a, bySlug, template, warn = () => {}) {
  const { hitokoto, rest } = splitHitokoto(a.body);
  const body = marked.parse(rest);
  const desc = summarize(a.body, 110);
  return template
    .replaceAll('{{HITOKOTO}}', escapeHtml(hitokoto))
    .replaceAll('{{SLUG}}', escapeHtml(a.slug))
    .replaceAll('{{TITLE}}', escapeHtml(a.title))
    .replaceAll('{{YOMI}}', escapeHtml(a.yomi))
    .replaceAll('{{DIFFICULTY}}', escapeHtml(a.difficulty))
    .replaceAll('{{DESCRIPTION}}', escapeHtml(desc))
    .replaceAll('{{UPDATED}}', escapeHtml(a.updated))
    .replaceAll('{{ENGLISH_BLOCK}}', englishBlock(a))
    .replaceAll('{{GENRE_CHIPS}}', chips(a.genres))
    .replaceAll('{{RELATED_BLOCK}}', relatedBlock(a, bySlug, warn))
    .replaceAll('{{SOURCES_BLOCK}}', sourcesBlock(a))
    .replaceAll('{{BODY}}', body);
}

// トップの大分類。ジャンルから1つに割り当てる(未来・社会を先に判定し、残りは技術)
export function wordGroup(a) {
  const g = a.genres || [];
  if (g.includes('未来')) return '未来のことば';
  if (g.includes('社会')) return '社会のことば';
  if (g.includes('プログラミング')) return 'プログラミングのことば';
  return '技術のことば';
}

const WORD_GROUPS = ['社会のことば', '技術のことば', 'プログラミングのことば', '未来のことば'];

export function renderIndex(articles) {
  const genres = [...new Set(articles.flatMap((a) => a.genres || []))].sort();
  const wordPill = (a) => {
    // 読み仮名は英字タイトルのみ(日本語の語に全部付けると一覧がうるさい)
    const yomi = /[A-Za-z]/.test(a.title)
      ? `<span class="w-yomi">${escapeHtml(a.yomi)}</span>`
      : '';
    return `      <a class="card" href="${escapeHtml(a.slug)}/" data-difficulty="${escapeHtml(a.difficulty)}" data-genres="${escapeHtml((a.genres || []).join(','))}"><i class="w-dot"></i><span class="w-title">${escapeHtml(a.title)}</span>${yomi}</a>`;
  };
  const sorted = articles
    .slice()
    .sort((a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty) || a.slug.localeCompare(b.slug));
  const cards = WORD_GROUPS.map((name) => {
    const pills = sorted.filter((a) => wordGroup(a) === name).map(wordPill).join('\n');
    if (!pills) return '';
    return `    <section class="word-group">
      <h2 class="group-title">${name}</h2>
      <div class="word-list">
${pills}
      </div>
    </section>`;
  }).filter(Boolean).join('\n');

  const difficultyButtons = ['すべて', ...DIFFICULTIES]
    .map(
      (d, i) => `<button type="button" class="filter-btn${i === 0 ? ' is-on' : ''}" data-difficulty="${d === 'すべて' ? '' : d}">${d}</button>`
    )
    .join('');
  const genreButtons = ['すべて', ...genres]
    .map(
      (g, i) => `<button type="button" class="filter-btn${i === 0 ? ' is-on' : ''}" data-genre="${escapeHtml(g === 'すべて' ? '' : g)}">${escapeHtml(g)}</button>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>かけこみ辞典 | AIかけこみ寺</title>
<meta name="description" content="AI・プログラミング・社会・未来のことばを、誰でも読める短い日本語で説明する辞典です。むずかしいことばに出会ったら、ここにかけこんでください。">
<meta property="og:type" content="website">
<meta property="og:title" content="かけこみ辞典 | AIかけこみ寺">
<meta property="og:description" content="AI・プログラミング・社会・未来のことばを、誰でも読める短い日本語で説明する辞典です。">
<meta property="og:url" content="https://ai-kakekomi.com/wiki/">
<meta property="og:site_name" content="かけこみ辞典">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/wiki.css">
</head>
<body>
<header class="brand-bar">
  <div class="container">
    <a class="brand" href="./">かけこみ辞典</a>
    <a class="brand-home" href="https://ai-kakekomi.com/">AIかけこみ寺</a>
  </div>
</header>

<main>
<div class="container">
  <div class="page-head">
    <h1>かけこみ辞典</h1>
    <p class="lead">AI・プログラミング・社会・未来の言葉を、短くやさしい日本語で。</p>
  </div>

  <div class="toolbar">
    <input id="q" type="search" class="search-box" placeholder="言葉をさがす" aria-label="言葉をさがす" autocomplete="off">
    <div class="filters">
      <div class="filter-row">${difficultyButtons}</div>
      <div class="filter-row">${genreButtons}</div>
    </div>
    <p class="result-count" id="count" hidden></p>
  </div>

  <div id="cards">
${cards}
  </div>
  <p class="empty" id="empty" hidden>あてはまる言葉が見つかりませんでした。ひらがなや英語でも試してみてください。</p>
</div>
</main>

<footer class="site-footer">
  <div class="container">
    <p>かけこみ辞典 は <a href="https://ai-kakekomi.com/">AIかけこみ寺</a> のことばの辞典です。</p>
    <p class="license">記事本文は CC BY 4.0 / サイトのプログラムは MIT ライセンスで公開しています。</p>
  </div>
</footer>
<script src="assets/search.js"></script>
</body>
</html>
`;
}

export function build({ root = ROOT, quiet = false } = {}) {
  const log = quiet ? () => {} : (m) => console.log(m);
  const warnings = [];
  const warn = (m) => {
    warnings.push(m);
    if (!quiet) console.warn(`  警告: ${m}`);
  };

  const { articles, errors } = loadArticles(join(root, 'content'));
  if (errors.length) {
    const err = new Error('記事の検証に失敗しました:\n  - ' + errors.join('\n  - '));
    err.errors = errors;
    throw err;
  }

  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const template = readFileSync(join(root, 'templates', 'article.html'), 'utf8');

  for (const a of articles) {
    const dir = join(root, a.slug);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), renderArticle(a, bySlug, template, warn));
    log(`  生成: ${a.slug}/index.html`);
  }

  writeFileSync(join(root, 'index.html'), renderIndex(articles));
  log('  生成: index.html');

  const index = buildSearchIndex(articles);
  writeFileSync(join(root, 'search-index.json'), JSON.stringify(index, null, 2) + '\n');
  log('  生成: search-index.json');

  return { articles, warnings, index };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try {
    console.log('かけこみ辞典 をビルドします');
    const { articles, warnings } = build();
    console.log(`完了: 記事 ${articles.length} 本 / 警告 ${warnings.length} 件`);
  } catch (err) {
    console.error('ビルド失敗');
    console.error(err.message);
    process.exit(1);
  }
}
