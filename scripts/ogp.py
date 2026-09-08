#!/usr/bin/env python3
"""記事ごとの OGP 画像（1200×630）を作る。

SNS や LINE に記事のアドレスを貼ったとき、言葉と「ひとことで」が絵で出るようにする。
辞典の共通画像（assets/ogp.png）1枚より、言葉ごとの絵のほうが押される。

入力: search-index.json（build.mjs が書く。slug / title / yomi / difficulty / summary）
出力: assets/ogp/<slug>.png

中身が同じなら描き直さない（summary と title のハッシュを PNG のそばに残す）。
Pillow が無い環境では警告だけ出して終わる。画像が無い記事は共通画像にたおれる。

フォントは Zen Maru Gothic（SIL Open Font License）を scripts/fonts/ に同梱。
サイトの見た目と同じ書体にするため。
"""

import hashlib
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
INDEX = os.path.join(ROOT, "search-index.json")
OUT = os.path.join(ROOT, "assets", "ogp")
FONT_B = os.path.join(HERE, "fonts", "ZenMaruGothic-Bold.ttf")
FONT_R = os.path.join(HERE, "fonts", "ZenMaruGothic-Regular.ttf")

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("  OGP: Pillow が無いので記事ごとの画像は作りません（pip install Pillow）", file=sys.stderr)
    sys.exit(0)

W, H = 1200, 630
BG = (253, 248, 240)          # --warm-bg
INK = (44, 44, 44)            # --text
SUB = (90, 90, 90)            # --text-light
GREEN = (45, 106, 79)         # --primary
ACCENT = (231, 111, 81)       # --accent
BAR = [(45, 106, 79), (82, 183, 136), (244, 162, 97)]   # 下の帯（緑→黄緑→橙）
# 級の色。サイトの .badge（wiki.css の --d-*-vivid）と同じ
LEVEL = {"初級": (47, 180, 95), "中級": (46, 143, 224), "上級": (245, 158, 11), "特級": (139, 92, 246)}


def wrap(draw, text, font, max_w):
    """日本語は単語の切れ目が無いので、1文字ずつ足して幅で折る。"""
    lines, cur = [], ""
    for ch in text:
        if ch == "\n":
            lines.append(cur); cur = ""; continue
        if draw.textlength(cur + ch, font=font) > max_w and cur:
            lines.append(cur); cur = ch
        else:
            cur += ch
    if cur:
        lines.append(cur)
    return lines


def glow(im):
    """右上のやわらかい橙のにじみ。共通画像と同じ雰囲気にする。"""
    from PIL import ImageFilter
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse((820, -220, 1420, 380), fill=(244, 162, 97, 70))
    layer = layer.filter(ImageFilter.GaussianBlur(120))
    im.alpha_composite(layer)


def render(a):
    im = Image.new("RGBA", (W, H), BG + (255,))
    glow(im)
    d = ImageDraw.Draw(im)

    # 上の小さな行：辞典名
    f_eye = ImageFont.truetype(FONT_R, 26)
    d.text((96, 92), "かけこみ辞典", font=f_eye, fill=ACCENT)

    # 言葉。長い言葉は少し小さく。級のピルを右隣に置く（サイトの見出しと同じ並び）
    title = a["title"]
    level = a.get("difficulty", "")
    f_pill = ImageFont.truetype(FONT_B, 34)
    pill_w = int(d.textlength(level, font=f_pill)) + 48 if level else 0
    size = 112 if len(title) <= 8 else (88 if len(title) <= 12 else 68)
    f_title = ImageFont.truetype(FONT_B, size)
    lines = wrap(d, title, f_title, W - 96 * 2 - pill_w - 24)
    y = 140
    for i, ln in enumerate(lines[:2]):
        d.text((96, y), ln, font=f_title, fill=INK)
        if i == 0 and level:
            tw = d.textlength(ln, font=f_title)
            px = 96 + tw + 24
            py = y + int(size * 0.62) - 26
            d.rounded_rectangle((px, py, px + pill_w, py + 52), radius=26, fill=LEVEL.get(level, ACCENT))
            # 文字はピルの真ん中に。anchor="mm" で文字の中心を指定する
            # （左上基準だと、日本語フォントの余白ぶん下に寄る）
            d.text((px + pill_w / 2, py + 26), level, font=f_pill, fill=(255, 255, 255), anchor="mm")
        y += int(size * 1.22)

    # よみ
    yomi = a.get("yomi") or ""
    if yomi and yomi != title:
        f_yomi = ImageFont.truetype(FONT_R, 28)
        d.text((100, y + 4), yomi, font=f_yomi, fill=SUB)
        y += 48

    # ひとことで。3行まで
    f_sum = ImageFont.truetype(FONT_R, 36)
    s_lines = wrap(d, a.get("summary", ""), f_sum, W - 96 * 2)
    y += 26
    for ln in s_lines[:3]:
        d.text((96, y), ln, font=f_sum, fill=INK)
        y += 54

    # 下：団体名とアドレス
    f_foot = ImageFont.truetype(FONT_R, 24)
    d.ellipse((96, 556, 110, 570), fill=ACCENT)
    d.text((122, 548), "AIかけこみ寺", font=f_foot, fill=SUB)
    url = "ai-kakekomi.com/wiki/" + a["slug"]
    tw = d.textlength(url, font=f_foot)
    d.text((W - 96 - tw, 548), url, font=f_foot, fill=SUB)

    # 帯
    for x in range(W):
        t = x / (W - 1)
        if t < 0.5:
            c = tuple(int(BAR[0][i] + (BAR[1][i] - BAR[0][i]) * t * 2) for i in range(3))
        else:
            c = tuple(int(BAR[1][i] + (BAR[2][i] - BAR[1][i]) * (t - 0.5) * 2) for i in range(3))
        d.line((x, H - 14, x, H), fill=c)

    return im.convert("RGB")


def main():
    with open(INDEX, encoding="utf-8") as f:
        items = json.load(f)
    os.makedirs(OUT, exist_ok=True)
    made = kept = 0
    for a in items:
        key = hashlib.sha1(json.dumps(
            [a.get("title"), a.get("yomi"), a.get("difficulty"), a.get("summary")],
            ensure_ascii=False).encode("utf-8")).hexdigest()[:12]
        png = os.path.join(OUT, a["slug"] + ".png")
        stamp = png + ".sha"
        if os.path.exists(png) and os.path.exists(stamp) and open(stamp).read().strip() == key:
            kept += 1
            continue
        render(a).save(png, optimize=True)
        with open(stamp, "w") as f:
            f.write(key)
        made += 1
    # 消えた記事の画像は片付ける
    slugs = {a["slug"] for a in items}
    for name in os.listdir(OUT):
        base = name.split(".")[0]
        if base not in slugs:
            os.remove(os.path.join(OUT, name))
    print("  OGP: 作成 %d / そのまま %d" % (made, kept))


if __name__ == "__main__":
    main()
