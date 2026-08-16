// 依存ゼロの最小YAMLフロントマター読み取り。
// 対応する書き方は wiki の記事で使うものだけに絞ってある。
//   key: value
//   key: [a, b]
//   key:
//     - title: ...
//       url: ...

export const DIFFICULTIES = ['初級', '中級', '上級', '特級'];

export function splitFrontmatter(raw) {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) {
    throw new Error('フロントマター（先頭の --- ブロック）がありません');
  }
  const end = text.indexOf('\n---\n', 3);
  if (end === -1) {
    throw new Error('フロントマターが --- で閉じられていません');
  }
  return {
    frontmatter: text.slice(4, end + 1),
    body: text.slice(end + 5).trim() + '\n',
  };
}

function stripQuotes(v) {
  const s = v.trim();
  if (s.length >= 2 && ((s[0] === '"' && s.at(-1) === '"') || (s[0] === "'" && s.at(-1) === "'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function parseInlineArray(v) {
  const inner = v.trim().slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(',').map((s) => stripQuotes(s)).filter((s) => s !== '');
}

export function parseFrontmatter(raw) {
  const { frontmatter, body } = splitFrontmatter(raw);
  const data = {};
  const lines = frontmatter.split('\n');
  let key = null;
  let list = null;

  const flush = () => {
    if (key && list) data[key] = list;
    list = null;
  };

  for (const line of lines) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const itemStart = line.match(/^\s{2,}-\s+(\w+):\s*(.*)$/);
    if (itemStart && list) {
      list.push({ [itemStart[1]]: stripQuotes(itemStart[2]) });
      continue;
    }
    const itemCont = line.match(/^\s{3,}(\w+):\s*(.*)$/);
    if (itemCont && list && list.length) {
      list[list.length - 1][itemCont[1]] = stripQuotes(itemCont[2]);
      continue;
    }
    const plainItem = line.match(/^\s{2,}-\s+(.*)$/);
    if (plainItem && list) {
      list.push(stripQuotes(plainItem[1]));
      continue;
    }

    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) throw new Error(`フロントマターの書式が読めません: ${line}`);
    flush();
    key = kv[1];
    const value = kv[2].trim();
    if (value === '') {
      list = [];
    } else if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = parseInlineArray(value);
    } else {
      data[key] = stripQuotes(value);
    }
  }
  flush();
  return { data, body };
}
