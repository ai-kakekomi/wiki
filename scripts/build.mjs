#!/usr/bin/env node
// content/*.md を読み、記事HTML・トップページ・検索インデックスを生成する。
// 生成物はリポジトリにそのままコミットする（配信は完全静的・依存ゼロ）。

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { marked } from 'marked';

/* 公開先。canonical・sitemap・構造化データで使う */
const SITE = 'https://ai-kakekomi.com';
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

/* 強調（**…**）を、marked に渡す前に <strong> へ置き換える。
 *
 * CommonMark には、記号の両隣に何があるかで開閉を決める規則がある。
 * 日本語の全角括弧や句点が ** に接すると、開けない・閉じられないことがあり、
 * 記号がそのまま画面に出る。
 *
 *   ✗ **違いは「早さ」と「見えかた」**にあります   （閉じられない）
 *   ✗ つまり**「バブルだった」とはなりません**    （開けない）
 *
 * 書く側が毎回それを避けるより、機械が確実に処理するほうがよい。
 * 書きたいまま書けば、そのとおりに出る。
 *
 * コードの中（``` … ``` と `…`）は触らない。記号として見せたいものがあるため。 */
export function toStrong(md) {
  const kept = [];
  const hidden = String(md).replace(/```[\s\S]*?```|`[^`\n]*`/g, (m) => {
    kept.push(m);
    return '\u0000' + (kept.length - 1) + '\u0000';
  });
  const converted = hidden.replace(/\*\*(?!\s)([^\n*]+?)(?<!\s)\*\*/g, '<strong>$1</strong>');
  return converted.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[Number(i)]);
}

export function renderArticle(a, bySlug, template, warn = () => {}) {
  const { hitokoto, rest } = splitHitokoto(a.body);
  const body = marked.parse(toStrong(rest));

  /* 強調の記号が、記号のまま残っていないか見る。
     CommonMark では、閉じる ** の直前が句読点や全角の閉じ括弧だと、
     閉じ記号として認められない（**「見えかた」**にあります が通らない）。
     markedの不具合ではなく仕様どおりの動きで、日本語では踏みやすい。
     括弧や句点を強調の外に出せば直る。 */
  const leftover = body.replace(/<code>[\s\S]*?<\/code>/g, '');
  if (leftover.includes('**')) {
    /* toStrong が対になったものは処理する。ここに残るのは、
       対になっていない ** だけ。書き間違いなので失敗にする */
    throw new Error(
      `${a.slug}.md: 対になっていない ** があります。` +
      `記号としてそのまま見せたいなら、backtick で囲んでください`);
  }
  const desc = summarize(a.body, 110);

  /* 用語辞典であることを機械にも伝える。
     schema.org の DefinedTerm は、まさに辞典の1項目のための型。
     検索結果での見え方が変わることがある */
  const jsonld = [
    '<script type="application/ld+json">',
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: a.title,
      description: desc,
      url: `${SITE}/wiki/${a.slug}/`,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'かけこみ辞典',
        url: `${SITE}/wiki/`
      }
    }),
    '</script>'
  ].join('');

  /* この団体の中の言葉には、最初に断りを入れる。
     世の中で広く使われている言いかただと誤解されないようにするため。
     辞典としての信用は、ここを正直にしておけるかで決まる */
  const kakekomiNote = (a.genres || []).includes('かけこみ用語')
    ? '<p class="kakekomi-note"><span class="kakekomi-note-em" aria-hidden="true">🏮</span>' +
      /* 文はひとつの入れ物に入れる。flex の中に直接置くと、
         strong が別の箱として扱われ、文が分断される */
      '<span class="kakekomi-note-text">' +
      'これは<strong>AIかけこみ寺</strong>の活動や、その中で使っている言いかたについての項目です。' +
      '世の中で広く使われている言葉ではありません。</span></p>'
    : '';

  return template
    .replaceAll('{{KAKEKOMI_NOTE}}', kakekomiNote)
    .replaceAll('{{JSONLD}}', jsonld)
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

/* トップの束。ジャンルではなく話題で切る。
   ジャンル（AI・社会・プログラミング…）は絞り込みに使い、
   並べる順はこちらで決める。AIだけで何十本もあるので、
   会社と人、半導体、道具、を分けないと探せない。

   ここに無い記事はビルドが警告する。書き足したら必ずどこかへ入れる。 */
const GROUPS = [
  { name: 'スマホとインターネット', slugs: [
    'account', 'login', 'password', 'two-factor-auth', 'phishing', 'malware',
    'app', 'install', 'update', 'browser', 'wifi', 'tethering', 'cloud', 'subscription'
  ]},
  { name: 'AIのことば', slugs: [
    'generative-ai', 'llm', 'transformer', 'machine-learning', 'deep-learning',
    'neural-network', 'prompt', 'token', 'context', 'skill', 'ai-agent', 'chatbot',
    'image-generation-ai', 'deepfake', 'ai-literacy', 'chatgpt', 'claude', 'gemini', 'grok'
  ]},
  { name: 'AIをつくる会社と人', slugs: [
    'openai', 'google', 'anthropic', 'hugging-face', 'deepseek', 'alibaba', 'bytedance',
    'sam-altman', 'dario-amodei', 'demis-hassabis', 'elon-musk'
  ]},
  { name: '半導体とインフラ', slugs: [
    'semiconductor', 'semiconductor-equipment', 'gpu', 'data-center', 'moores-law',
    'nvidia', 'tsmc', 'asml', 'tokyo-electron', 'kioxia', 'ajinomoto-abf', 'huawei',
    'jensen-huang', 'masayoshi-son', 'softbank'
  ]},
  { name: 'つくるためのことば', slugs: [
    'vibe-coding', 'claude-code', 'cli', 'markdown',
    'html', 'css', 'javascript', 'python'
  ]},
  { name: 'GitとGitHub', slugs: [
    'git', 'github', 'repository', 'clone', 'commit', 'branch', 'merge', 'conflict',
    'push', 'pull', 'pull-request', 'fork', 'diff', 'issue', 'readme', 'gitignore',
    'github-actions', 'open-source', 'oss-license'
  ]},
  { name: 'データと安全のことば', slugs: [
    'api', 'database', 'supabase', 'rls', 'csv',
    'authentication', 'oauth', 'vulnerability', 'cloudflare-zero-trust'
  ]},
  { name: '団体と制度のことば', slugs: [
    'npo', 'teikan', 'riji', 'rijicho', 'kanji-auditor', 'hojinkaku', 'ippan-shadan',
    'hojokin', 'koen-meigi', 'trademark', 'copyright', 'ai-copyright', 'idea-expression',
    'ai-suishin-ho', 'shakyo', 'shogai-gakushu-center', 'hands-on', 'joho-ryoiki'
  ]},
  { name: '社会と経済のことば', slugs: [
    'digital-divide', 'externality', 'market-failure', 'basic-income',
    'ai-bubble', 'supercycle'
  ]},
  { name: '未来のことば', slugs: [
    'singularity', 'agi', 'asi', 'intelligence-explosion', 'exponential-growth',
    'law-of-accelerating-returns', 'longevity-escape-velocity', 'humanoid-robot',
    'ray-kurzweil'
  ]},
  { name: 'かけこみ寺のことば', slugs: [
    'ai-kakekomi', 'kakekomi-jiten', 'kakekomi-app', 'zero-trust-accounting'
  ]}
];
const GROUP_OF = new Map(GROUPS.flatMap((g) => g.slugs.map((s) => [s, g.name])));

export function wordGroup(a) {
  return GROUP_OF.get(a.slug) || null;
}

const WORD_GROUPS = GROUPS.map((g) => g.name);

export function renderIndex(articles) {
  const genres = [...new Set(articles.flatMap((a) => a.genres || []))].sort();
  const wordPill = (a) =>
    `      <a class="card" href="${escapeHtml(a.slug)}/" data-difficulty="${escapeHtml(a.difficulty)}" data-genres="${escapeHtml((a.genres || []).join(','))}"><span class="w-badge">${escapeHtml(a.difficulty)}</span><span class="w-title">${escapeHtml(a.title)}</span></a>`;
  const sorted = articles
    .slice()
    .sort((a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty) || a.slug.localeCompare(b.slug));
  const homeless = articles.filter((a) => !wordGroup(a)).map((a) => a.slug);
  if (homeless.length) {
    console.warn('  警告: どの束にも入っていない記事があります → ' + homeless.join(', ') +
      '（scripts/build.mjs の GROUPS に足してください）');
  }

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
      (d, i) => `<button type="button" class="filter-btn${i === 0 ? ' is-on' : ''}" data-difficulty="${d === 'すべて' ? '' : d}">${d === 'すべて' ? '' : '<i class="f-dot"></i>'}${d}</button>`
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
<meta property="og:image" content="https://ai-kakekomi.com/wiki/assets/ogp.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${SITE}/wiki/">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'かけこみ辞典',
  description: 'AI・プログラミング・社会・未来のことばを、誰でも読める短い日本語で説明する辞典です。',
  url: `${SITE}/wiki/`,
  inLanguage: 'ja',
  hasDefinedTerm: articles.slice().sort((x, y) => x.slug.localeCompare(y.slug)).map((a) => ({
    '@type': 'DefinedTerm',
    name: a.title,
    url: `${SITE}/wiki/${a.slug}/`
  }))
})}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/wiki.css">
</head>
<body>
<main>
<div class="container">
  <div class="page-head">
    <h1>かけこみ辞典</h1>
    <p class="lead">AI・プログラミング・社会・未来の言葉を、短くやさしい日本語で。</p>
  </div>

  <div class="progress" id="progress" hidden></div>

  <div class="toolbar">
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
<script src="assets/read.js"></script>
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

  /* sitemap。120本あると、リンクをたどるだけでは拾い切ってもらえない。
     更新日は記事の updated をそのまま使う */
  const urls = [
    `  <url><loc>${SITE}/wiki/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    ...articles
      .slice()
      .sort((x, y) => x.slug.localeCompare(y.slug))
      .map((a) => `  <url><loc>${SITE}/wiki/${a.slug}/</loc><lastmod>${a.updated}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`)
  ];
  writeFileSync(
    join(root, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') + '\n</urlset>\n'
  );
  log(`  生成: sitemap.xml (${urls.length}件)`);
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
