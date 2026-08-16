// 文字の正規化まわり。ブラウザ側 assets/search.js と同じ規則をNode側でも使う。

export function toHiragana(s) {
  return String(s).replace(/[ァ-ヶ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60)
  );
}

export function normalize(s) {
  return toHiragana(String(s))
    .toLowerCase()
    .replace(/[・･・\s　ー-]/g, '');
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 「## ひとことで」直後の本文から先頭80字を取り出す（検索結果とカードの説明文）
export function summarize(body, max = 80) {
  const m = body.match(/^##\s*ひとことで\s*$([\s\S]*?)(?=^##\s|\Z)/m);
  const chunk = m ? m[1] : body;
  const plain = chunk
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? plain.slice(0, max) + '…' : plain;
}
