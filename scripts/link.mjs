#!/usr/bin/env node
// note原稿など任意のMarkdownに、かけこみWikiの用語リンクを「初出だけ」埋め込む。
//   node scripts/link.mjs <原稿.md>            結果を標準出力へ（ファイルは書き換えない）
//   node scripts/link.mjs <原稿.md> --dry-run  変更行だけを差分風に表示
// どちらの場合も、未収録らしき専門用語の候補を標準エラーに一覧表示する。

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const WIKI_BASE = 'https://ai-kakekomi.com/wiki/';

export function loadVocabulary(indexPath = join(ROOT, 'search-index.json')) {
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const terms = [];
  for (const e of index) {
    terms.push({ term: e.title, slug: e.slug });
    if (e.english) terms.push({ term: e.english, slug: e.slug });
  }
  // 長い語を先に当てる（「プルリクエスト」が「プル」に食われないように）
  return terms.sort((a, b) => b.term.length - a.term.length);
}

// 保護したい範囲（コードブロック・インラインコード・見出し行・既存リンク・URL・画像）
function protectedRanges(text) {
  const ranges = [];
  const patterns = [
    /```[\s\S]*?```/g,
    /~~~[\s\S]*?~~~/g,
    /`[^`\n]*`/g,
    /^#{1,6}[^\n]*$/gm,
    /!?\[[^\]]*\]\([^)]*\)/g,
    /<[^>\n]+>/g,
    /https?:\/\/\S+/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) ranges.push([m.index, m.index + m[0].length]);
  }
  return ranges;
}

const inRanges = (ranges, start, end) =>
  ranges.some(([s, e]) => start < e && end > s);

export function linkify(text, vocabulary) {
  const ranges = protectedRanges(text);
  const taken = []; // すでに長い語が押さえた範囲（短い語が食い込むのを防ぐ）
  const used = new Set();
  const candidates = new Map(); // slug -> 一番早く出てきた箇所
  const edits = [];

  for (const { term, slug } of vocabulary) {
    if (!term) continue;
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const hits = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (inRanges(ranges, start, end)) continue;
      if (inRanges(taken, start, end)) continue;
      // 英単語は語の途中に食い込ませない
      if (/^[A-Za-z]/.test(term)) {
        const before = text[start - 1] || ' ';
        const after = text[end] || ' ';
        if (/[A-Za-z0-9]/.test(before) || /[A-Za-z0-9]/.test(after)) continue;
      }
      hits.push({ start, end, matched: m[0] });
    }
    if (!hits.length) continue;
    // 見つかった箇所はすべて確保し（短い語に食わせない）、候補として貯める
    for (const h of hits) taken.push([h.start, h.end]);
    const prev = candidates.get(slug);
    if (!prev || hits[0].start < prev.start) candidates.set(slug, hits[0]);
  }

  // 同じ語につきリンクは1つだけ。原稿の中で一番早く出てきた箇所に付ける
  for (const [slug, hit] of candidates) {
    edits.push({
      start: hit.start,
      end: hit.end,
      text: `[${hit.matched}](${WIKI_BASE}${slug})`,
      slug,
      term: hit.matched,
    });
    used.add(slug);
  }

  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return { text: out, edits: edits.slice().reverse() };
}

// 未収録らしき専門用語の候補（3字以上のカタカナ語 / 大文字が2字以上続く英字語）
export function findCandidates(text, vocabulary) {
  const ranges = protectedRanges(text);
  const known = new Set(vocabulary.map((v) => v.term.toLowerCase()));
  const counts = new Map();
  const patterns = [/[ァ-ヶー]{3,}/g, /\b[A-Z][A-Za-z]*[A-Z][A-Za-z]*\b/g, /\b[A-Z]{2,}\b/g];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      if (inRanges(ranges, m.index, m.index + m[0].length)) continue;
      const w = m[0];
      if (known.has(w.toLowerCase())) continue;
      counts.set(w, (counts.get(w) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([term, count]) => ({ term, count }));
}

function diffLines(before, after) {
  const a = before.split('\n');
  const b = after.split('\n');
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      if (a[i] !== undefined) out.push(`- ${a[i]}`);
      if (b[i] !== undefined) out.push(`+ ${b[i]}`);
    }
  }
  return out.join('\n');
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('使い方: node scripts/link.mjs <原稿.md> [--dry-run]');
    process.exit(1);
  }
  const source = readFileSync(file, 'utf8');
  const vocabulary = loadVocabulary();
  const { text, edits } = linkify(source, vocabulary);

  if (dryRun) {
    console.log(`リンクを付けた語: ${edits.length} 個`);
    for (const e of edits) console.log(`  ${e.term} -> ${WIKI_BASE}${e.slug}`);
    console.log('');
    console.log(diffLines(source, text) || '（変更なし）');
  } else {
    process.stdout.write(text);
  }

  const candidates = findCandidates(text, vocabulary);
  if (candidates.length) {
    console.error('\n--- Wiki未収録の用語候補（記事化を検討） ---');
    for (const c of candidates.slice(0, 30)) console.error(`  ${c.term} (${c.count}回)`);
  }
}
