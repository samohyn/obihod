"""
keysso_analyze_structure.py

Анализирует реальные URL-структуры конкурентов из Keys.so JSON-выгрузок.
Извлекает поле `url` из каждого ключа, группирует по пути, считает плотность ключей.

Вход:  seosite/02-keywords/raw/keysso-{domain}-2026-05-03.json
Выход: seosite/01-competitors/url-structure-top3.md
"""

import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "02-keywords" / "raw"
OUT_FILE = ROOT / "01-competitors" / "url-structure-top3.md"

DOMAINS = {
    "liwood.ru":      "keysso-liwood_ru-2026-05-03.json",
    "arborist.su":    "keysso-arborist_su-2026-05-03.json",
    "arboristik.ru":  "keysso-arboristik_ru-2026-05-03.json",
}

TOP_N = 25  # сколько URL выводить на домен


def load_keywords(filepath: Path) -> list[dict]:
    with open(filepath, encoding="utf-8") as f:
        data = json.load(f)
    return data.get("keywords", [])


def normalize_url(raw_url: str) -> str:
    """Убирает query-string и trailing slash, оставляет только path."""
    if not raw_url:
        return "/"
    parsed = urlparse(raw_url)
    path = parsed.path.rstrip("/") or "/"
    return path


def analyze_domain(domain: str, filename: str) -> dict:
    filepath = RAW_DIR / filename
    if not filepath.exists():
        return {"domain": domain, "total_keywords": 0, "urls": []}

    keywords = load_keywords(filepath)
    total = len(keywords)

    url_kw = defaultdict(list)
    for kw in keywords:
        url = normalize_url(kw.get("url", ""))
        url_kw[url].append({
            "word": kw.get("word", ""),
            "wsk": kw.get("wsk", 0),
            "pos": kw.get("pos", 99),
        })

    # Группируем по первому сегменту пути (тип раздела)
    section_counts = Counter()
    for path in url_kw:
        parts = path.strip("/").split("/")
        section = "/" + parts[0] + "/" if parts and parts[0] else "/"
        section_counts[section] += len(url_kw[path])

    # Сортируем URL по числу ключей
    sorted_urls = sorted(url_kw.items(), key=lambda x: len(x[1]), reverse=True)

    url_list = []
    for path, kws in sorted_urls[:TOP_N]:
        top5 = sorted(kws, key=lambda k: k["wsk"], reverse=True)[:5]
        url_list.append({
            "path": path,
            "kw_count": len(kws),
            "pct": round(len(kws) / total * 100, 1) if total else 0,
            "top_kws": [k["word"] for k in top5],
            "avg_pos": round(sum(k["pos"] for k in kws) / len(kws), 1),
        })

    return {
        "domain": domain,
        "total_keywords": total,
        "sections": dict(section_counts.most_common(10)),
        "urls": url_list,
    }


def render_md(results: list[dict]) -> str:
    lines = [
        "# URL-структуры конкурентов (Keys.so)",
        "",
        f"_Источник: Keys.so выгрузки 2026-05-03, топ-{TOP_N} URL по плотности ключей._",
        "",
    ]

    for r in results:
        domain = r["domain"]
        total = r["total_keywords"]
        lines += [
            f"## {domain}",
            "",
            f"**Ключей в выгрузке:** {total}",
            "",
        ]

        if not r["urls"]:
            lines += ["_Данные отсутствуют._", ""]
            continue

        # Секции
        if r.get("sections"):
            lines.append("**Разделы сайта (по числу ключей):**")
            lines.append("")
            for sec, cnt in list(r["sections"].items())[:6]:
                pct = round(cnt / total * 100, 1) if total else 0
                lines.append(f"- `{sec}` — {cnt} ключей ({pct}%)")
            lines.append("")

        # Таблица URL
        lines += [
            f"**Топ-{TOP_N} URL по числу ключей:**",
            "",
            "| URL | Ключей | % | Ср. позиция | Топ-5 ключей |",
            "|---|---:|---:|---:|---|",
        ]
        for u in r["urls"]:
            top_kws = ", ".join(u["top_kws"][:3])
            lines.append(
                f"| `{u['path']}` | {u['kw_count']} | {u['pct']}% "
                f"| {u['avg_pos']} | {top_kws} |"
            )
        lines.append("")

    return "\n".join(lines)


def main():
    results = []
    for domain, filename in DOMAINS.items():
        print(f"  Анализирую {domain}...")
        r = analyze_domain(domain, filename)
        print(f"    {r['total_keywords']} ключей, {len(r['urls'])} уникальных URL")
        results.append(r)

    md = render_md(results)
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(md, encoding="utf-8")
    print(f"\nГотово → {OUT_FILE.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main()
