import { DIFFICULTIES } from './frontmatter.mjs';

export const REQUIRED_SECTIONS = ['## ひとことで', '## なぜ大事?', '## やさしい解説'];

const KATAKANA = /^[゠-ヿ・ー・\s]+$/;

// 記事1本を検証してエラー文言の配列を返す（空配列なら合格）。
// ルールは11本。README のルール数と揃えること。
export function validateArticle({ data, body, filename }) {
  const e = [];
  const expectedSlug = filename.replace(/\.md$/, '');

  // 1. slug は英小文字とハイフン、数字のみ
  if (!data.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
    e.push('slug は英小文字・数字・ハイフンのみで書いてください');
  }
  // 2. slug とファイル名が一致
  if (data.slug !== expectedSlug) {
    e.push(`slug (${data.slug}) がファイル名 (${expectedSlug}) と一致しません`);
  }
  // 3. title 必須
  if (!data.title) e.push('title がありません');
  // 4. yomi はカタカナ必須
  if (!data.yomi) e.push('yomi がありません');
  else if (!KATAKANA.test(data.yomi)) e.push('yomi はカタカナで書いてください');
  // 5. english があれば english_yomi 必須（カタカナ）
  if (data.english) {
    if (!data.english_yomi) e.push('english があるので english_yomi が必要です');
    else if (!KATAKANA.test(data.english_yomi)) e.push('english_yomi はカタカナで書いてください');
    // 6. english があれば japanese（和訳）必須
    if (!data.japanese) e.push('english があるので japanese（和訳）が必要です');
  } else {
    if (data.english_yomi) e.push('english がないのに english_yomi があります');
    if (data.japanese) e.push('english がないのに japanese があります');
  }
  // 7. difficulty は4種のみ
  if (!DIFFICULTIES.includes(data.difficulty)) {
    e.push(`difficulty は ${DIFFICULTIES.join('|')} のいずれかです（今: ${data.difficulty}）`);
  }
  // 8. genres は1つ以上の配列
  if (!Array.isArray(data.genres) || data.genres.length === 0) {
    e.push('genres を1つ以上書いてください');
  }
  // 9. related は配列（空でも可）
  if (!Array.isArray(data.related)) e.push('related は配列で書いてください（空なら [] ）');
  // 10. sources は title と url を持つ項目が1つ以上
  if (!Array.isArray(data.sources) || data.sources.length === 0) {
    e.push('sources（一次資料）を1つ以上書いてください');
  } else {
    for (const s of data.sources) {
      if (!s || typeof s !== 'object' || !s.title || !s.url) {
        e.push('sources の各項目には title と url が必要です');
        break;
      }
    }
  }
  // 11. updated は YYYY-MM-DD
  if (!data.updated || !/^\d{4}-\d{2}-\d{2}$/.test(String(data.updated))) {
    e.push('updated は YYYY-MM-DD の形で書いてください');
  }

  // 本文の必須セクション
  for (const sec of REQUIRED_SECTIONS) {
    const re = new RegExp('^' + sec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'm');
    if (!re.test(body)) e.push(`本文に「${sec}」の見出しがありません`);
  }
  // 関連ワード・一次資料は frontmatter から描画するので本文には書かせない
  if (/^##\s*(関連ワード|一次資料|参考文献)\s*$/m.test(body)) {
    e.push('関連ワード・一次資料は frontmatter に書きます（本文に見出しを作らないでください）');
  }

  return e;
}
