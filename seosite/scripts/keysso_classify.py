#!/usr/bin/env python3
"""Intent + pillar classification for EPIC-SEO-COMPETE-3 US-1.

Reads raw Keys.so JSONs, unions + dedupes keywords across 3 domains,
classifies each by intent (lead/pricing/info/local/other) and pillar
(vyvoz-musora/arboristika/demontazh/uborka-snega/uborka-territorii/other).
Outputs CSV ready for Just-Magic deeper clustering.
"""
import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "seosite" / "02-keywords" / "raw"
OUT_DIR = ROOT / "seosite" / "02-keywords"
DERIVED = OUT_DIR / "derived"
DERIVED.mkdir(parents=True, exist_ok=True)

# ─── Intent classifiers (regex-based, applied in order; first match wins) ────
INTENT_PATTERNS = [
    ("lead", re.compile(
        r"\b("
        r"заказ|заказать|вызов|вызвать|услуг[аи]|нанять|подать|оставить заявк|"
        r"в москве|в мо|в подмосковье|в моск\.? обл|"
        r"специалист|компани[яи]|подрядчик|бригад"
        r")\b", re.IGNORECASE)),
    ("pricing", re.compile(
        r"\b("
        r"цен[аы]|стоимост|стоит|сколько|тариф|расценк|прайс|"
        r"калькулятор|расчет|расчёт|посчитать|"
        r"дёшев|дешёв|недорого|бюджет"
        r")\b", re.IGNORECASE)),
    ("local", re.compile(
        r"\b("
        r"рядом|у дома|поблизости|возле|"
        r"раменск|жуковск|мытищ|подольск|балаших|химк|королёв|королев|"
        r"люберц|одинцов|красногорск|домодедов|пушкин|щёлков|щелков|"
        r"электросталь|серпухов|ногинск|сергиев посад|солнечногорск|"
        r"клин|чехов|истр|воскресенск|дмитров|кашир|коломн|лобн|"
        r"наро-фоминск|пушкино|реутов|видн|фрязин|долгопрудн|"
        r"москва|московск"
        r")", re.IGNORECASE)),
    ("info", re.compile(
        r"\b("
        r"как|почему|что такое|чем|зачем|когда|где|"
        r"инструкция|правила|способы|метод|вид[ыа]?|"
        r"можно ли|нужно ли|разрешен|обязате|закон|"
        r"причин|признак|совет|рекомендац"
        r")\b", re.IGNORECASE)),
]

# ─── Pillar classifiers ──────────────────────────────────────────────────────
PILLAR_PATTERNS = [
    ("uborka-snega-i-chistka-krysh", re.compile(
        r"\b(снег|сосульк|наледь|лёд на крыш|чистка крыш|снегоплавил)\b",
        re.IGNORECASE)),
    ("vyvoz-musora", re.compile(
        r"\b(мусор|тбо|кгм|крупногаб|строймусор|стройотход|контейнер|"
        r"ситуация с отход|вывоз отход|свалк)\b", re.IGNORECASE)),
    ("arboristika", re.compile(
        r"\b(дерев|спил|удаление|вырубк|кронирован|обрезка|обрезк|"
        r"арборист|короед|пень|пни|корчеван|опиловк|"
        r"кустарник|сада|сад[еау]?\b|порубочн|лесник|лесн|"
        r"вальщик|валк[аи]|селитр|измельчитель веток)\b", re.IGNORECASE)),
    ("demontazh", re.compile(
        r"\b(демонтаж|снос|разбор|разрушен|сломать|"
        r"забор|сарай|гараж|постройк|здани|строен|"
        r"бетон|кирпич|стен[ыа])\b", re.IGNORECASE)),
    ("uborka-territorii", re.compile(
        r"\b(уборк[аи]\s+(территори|участка|двор|земельн)|"
        r"раcчистка|расчистк|выравниван|пок[ао]с\s+трав|"
        r"уборка дачн|уборка после|уборка строит|"
        r"вывоз порубочн|вывоз веток|подготовк[аи]\s+(участка|территор))",
        re.IGNORECASE)),
]


def classify_intent(word: str) -> str:
    for label, pat in INTENT_PATTERNS:
        if pat.search(word):
            return label
    return "other"


def classify_pillar(word: str) -> str:
    for label, pat in PILLAR_PATTERNS:
        if pat.search(word):
            return label
    return "other"


def load_raw(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    domain = data["meta"]["domain"]
    keywords = data.get("keywords") or []
    return domain, keywords


def main():
    if not RAW_DIR.exists():
        print(f"ERROR: {RAW_DIR} missing", file=sys.stderr)
        sys.exit(2)

    # union all keywords across domains, track which domain(s) hold each
    word_table: dict[str, dict] = {}
    domain_counts: dict[str, int] = {}

    for raw in sorted(RAW_DIR.glob("*.json")):
        domain, keywords = load_raw(raw)
        domain_counts[domain] = len(keywords)
        for kw in keywords:
            word = kw.get("word") or kw.get("keyword") or ""
            if not word:
                continue
            entry = word_table.setdefault(word, {
                "word": word,
                "ws": kw.get("ws", 0),
                "wsk": kw.get("wsk", 0),
                "best_pos": kw.get("pos", 999),
                "domains": set(),
                "ranking_urls": set(),
            })
            entry["ws"] = max(entry["ws"], kw.get("ws", 0))
            entry["wsk"] = max(entry["wsk"], kw.get("wsk", 0))
            pos = kw.get("pos", 999)
            if pos and pos < entry["best_pos"]:
                entry["best_pos"] = pos
            entry["domains"].add(domain)
            url = kw.get("url")
            if url:
                entry["ranking_urls"].add(f"{domain}{url}")

    # write union CSV
    union_path = DERIVED / "union-3-competitors.csv"
    intent_pillar_summary: dict[tuple[str, str], int] = defaultdict(int)
    with open(union_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "word", "ws", "wsk", "best_pos", "intent", "pillar",
            "domains_count", "domains", "ranking_urls"
        ])
        for entry in sorted(word_table.values(),
                            key=lambda x: (-x["wsk"], x["word"])):
            intent = classify_intent(entry["word"])
            pillar = classify_pillar(entry["word"])
            intent_pillar_summary[(intent, pillar)] += 1
            w.writerow([
                entry["word"],
                entry["ws"],
                entry["wsk"],
                entry["best_pos"] if entry["best_pos"] < 999 else "",
                intent,
                pillar,
                len(entry["domains"]),
                ",".join(sorted(entry["domains"])),
                "; ".join(sorted(entry["ranking_urls"]))[:500],
            ])
    print(f"  union → {union_path.relative_to(ROOT)} ({len(word_table)} unique keywords)")

    # write intersect (3 domains share)
    intersect_path = DERIVED / "intersect-3-competitors.csv"
    with open(intersect_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["word", "ws", "wsk", "intent", "pillar"])
        intersect_count = 0
        for entry in sorted(word_table.values(),
                            key=lambda x: (-x["wsk"], x["word"])):
            if len(entry["domains"]) < 3:
                continue
            intersect_count += 1
            w.writerow([
                entry["word"], entry["ws"], entry["wsk"],
                classify_intent(entry["word"]),
                classify_pillar(entry["word"]),
            ])
    print(f"  intersect-3way → {intersect_path.relative_to(ROOT)} ({intersect_count} keywords)")

    # write whitespace (only 1 domain has it)
    whitespace_path = DERIVED / "whitespace-1-domain.csv"
    with open(whitespace_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["word", "ws", "wsk", "intent", "pillar", "single_domain"])
        ws_count = 0
        for entry in sorted(word_table.values(),
                            key=lambda x: (-x["wsk"], x["word"])):
            if len(entry["domains"]) != 1:
                continue
            ws_count += 1
            w.writerow([
                entry["word"], entry["ws"], entry["wsk"],
                classify_intent(entry["word"]),
                classify_pillar(entry["word"]),
                next(iter(entry["domains"])),
            ])
    print(f"  whitespace-1domain → {whitespace_path.relative_to(ROOT)} ({ws_count} keywords)")

    # summary table
    print(f"\n=== Domain raw counts ===")
    for d, c in domain_counts.items():
        print(f"  {d}: {c} keywords")

    print(f"\n=== Intent × Pillar matrix ===")
    intents = ["lead", "pricing", "local", "info", "other"]
    pillars = ["vyvoz-musora", "arboristika", "demontazh",
               "uborka-snega-i-chistka-krysh", "uborka-territorii", "other"]
    print(f"  {'intent':<10}", *(f"{p[:18]:>20}" for p in pillars), "  total")
    for intent in intents:
        row_total = sum(intent_pillar_summary[(intent, p)] for p in pillars)
        cells = [f"{intent_pillar_summary[(intent, p)]:>20}" for p in pillars]
        print(f"  {intent:<10}", *cells, f"  {row_total:>5}")
    print()

    return union_path


if __name__ == "__main__":
    main()
