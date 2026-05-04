#!/usr/bin/env python3
"""EPIC-SEO-OUTRANK Phase B+C+D — intersect 33 services-конкурентов.

Read: 33 keysso-{domain}-2026-05-03.json + obikhod fallback normalized.csv
Apply: tier_freq (α: ВЧ ≥1000 / СЧ 100-1000 / НЧ <100)
       intent_marker (regex commercial / informational / location)
       cluster_hint (5 directions: vyvoz-musora / arbo / uborka-snega / demontazh-b2c / landshaft)
Write: 4 CSV in seosite/02-keywords/derived/
       - keysso-master-union-2026-05-03.csv (all keywords, 13 columns)
       - keysso-intersect-multi-2026-05-03.csv (domains_count >= 2)
       - keysso-whitespace-2026-05-03.csv (нет у нас, у >= 3 конкурентов)
       - keysso-per-domain-unique-2026-05-03.csv (top-30 unique каждого)
"""
from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "02-keywords" / "raw"
DERIVED_DIR = ROOT / "02-keywords" / "derived"
DERIVED_DIR.mkdir(parents=True, exist_ok=True)

TAG = "2026-05-03"
PULL_MANIFEST = RAW_DIR / f"keysso-pull-manifest-{TAG}.json"
NORMALIZED_CSV = ROOT / "02-keywords" / "normalized.csv"

# ───────── Phase D — Тир α (operator approved 2026-05-03) ─────────
TIER_VCH_MIN = 1000  # ВЧ
TIER_SCH_MIN = 100   # СЧ
# < 100 = НЧ


def tier_classify(wsk: int, superwsk: int | None) -> str:
    """α-классика. Adjust noisy ВЧ → СЧ если superwsk/wsk < 0.5."""
    if wsk >= TIER_VCH_MIN:
        if superwsk is not None and wsk > 0 and (superwsk / wsk) < 0.5:
            return "СЧ"  # noisy ВЧ → демоут
        return "ВЧ"
    if wsk >= TIER_SCH_MIN:
        return "СЧ"
    return "НЧ"


# ───────── Phase C — Commercial filter ─────────
RE_COMMERCIAL = re.compile(
    r"\b("
    r"купить|заказ\w*|цен[аыу]|стоимост\w*|сколько стоит|прайс|услуг[аи]|"
    r"срочно|недорог\w+|д[еёе]шев\w+|онлайн|с доставкой|вызв\w+|нанять|"
    r"подряд|расценк\w+|тариф\w*|смет\w+|оформить|оплат\w+|"
    r"вывез\w*|вывоз\w*|спил\w*|удал\w*|снос\w*|разобр\w*|почист\w*|"
    r"демонтир\w*|корчев\w*|обрез\w*|посад\w*|посадк\w*|"
    r"компани[яи]|фирм[аы]|организаци[яи]"
    r")\b",
    re.IGNORECASE,
)
RE_LOCATION = re.compile(
    r"\b("
    r"москв[аеу]|мо\b|московск\w+|подмоск\w+|"
    r"раменск\w+|жуковск\w+|балаших\w+|мытищ\w+|подольск\w+|одинцов\w+|"
    r"красногорск\w+|химк\w+|зеленоград\w*|долгопрудн\w+|реутов|люберц\w+|"
    r"сергиев[\s-]?посад|клин\b|солнечногорск|ногинск|щ[её]лково|пушкин\w+|"
    r"истр[аеу]|видное|домодедов\w+|дмитров|серпухов\w*"
    r")\b",
    re.IGNORECASE,
)
RE_INFORMATIONAL = re.compile(
    r"\b("
    r"как|сколько|когда|зачем|почему|чем\b|каки[еми]|какой|какая|какие|"
    r"отзыв\w*|инструкци\w+|своими руками|самостоятельно|"
    r"википеди\w+|определени\w+|значени\w+|что такое|что значит"
    r")\b",
    re.IGNORECASE,
)


def intent_classify(keyword: str) -> str:
    has_comm = bool(RE_COMMERCIAL.search(keyword))
    has_loc = bool(RE_LOCATION.search(keyword))
    has_info = bool(RE_INFORMATIONAL.search(keyword))
    if has_info and not has_comm:
        return "информационный"
    if has_comm and has_loc:
        return "коммерческий+локальный"
    if has_comm:
        return "коммерческий"
    if has_loc:
        return "локальный"
    return "общий"


# ───────── Phase E — Cluster hint (5 directions) ─────────
RE_VYVOZ = re.compile(
    r"\b(мусор\w*|хлам\w*|отход\w*|тбо|тко|строймусор|стройотход\w*|"
    r"строительн\w+ мусор\w*|бытов\w+ мусор\w*|вывоз\w*|"
    r"контейнер\w*|газел\w+|самосвал\w*|крупногабарит\w+|кгм\b)\b",
    re.IGNORECASE,
)
RE_ARBO = re.compile(
    r"\b(спил\w*|удал\w+\s*дерев\w*|дерев\w+|пень|пнь[ея]|пни\b|"
    r"корчев\w+|кронир\w+|обрезк\w+\s*деревь\w+|обрезк\w+\s*кустарник\w*|"
    r"арборист\w*|арбо\b|вырубк\w+|выкорчев\w+|"
    r"щепа\b|дробилк\w+|щепорез\w+)\b",
    re.IGNORECASE,
)
RE_SNEG = re.compile(
    r"\b(снег\w*|снегоуборк\w+|сугроб\w*|нал[её]д\w*|сосульк\w+|сосульи\b|"
    r"чистк\w+\s*кры\w+|кры[шж]\w+\s*от снега|"
    r"уборк\w+\s*снега|вывоз\w+\s*снега|механизированн\w+\s*уборк\w+|"
    r"чистк\w+\s*кровл\w+|кровл\w+\s*от снега)\b",
    re.IGNORECASE,
)
RE_DEMONT = re.compile(
    r"\b(снос\w*|демонтаж\w*|разборк\w+|демонтир\w+|"
    r"снос\w+\s*дома|снос\w+\s*дач\w+|разборк\w+\s*бани|снос\w+\s*забор\w+|"
    r"демонтаж\w*\s*сара\w+|снос\w+\s*гараж\w+|демонтаж\w*\s*теплиц\w+|"
    r"разборк\w+\s*веранд\w+)\b",
    re.IGNORECASE,
)
RE_DEMONT_NEGATIVE = re.compile(
    r"\b(промышленн\w+|завод\w*|цех\w*|торгов\w+\s*центр\w*|тц\b|"
    r"бизнес[\s-]центр|складск\w+\s*комплекс)\b",
    re.IGNORECASE,
)
RE_LANDSHAFT = re.compile(
    r"\b(ландшафтн\w+|благоустройств\w+|газон\w*|"
    r"посадк\w+\s*деревь\w+|посадк\w+\s*кустарник\w+|"
    r"мал\w+\s*форм\w+|вертикальн\w+\s*озелен\w+|"
    r"проект\w*\s*участк\w+|план\s*участк\w+|"
    r"дренаж\w*\s*участк\w+|альпинари\w+|водо[её]м\w*|"
    r"озелен\w+|клумб\w+|цветник\w+|рулонн\w+\s*газон|"
    r"мощен\w+|тротуарн\w+\s*плитк\w+\s*участк\w+)\b",
    re.IGNORECASE,
)


def cluster_classify(keyword: str) -> tuple[list[str], bool]:
    """Returns (matched_directions[], multi_cluster_flag)."""
    matched: list[str] = []
    if RE_VYVOZ.search(keyword):
        matched.append("vyvoz-musora")
    if RE_ARBO.search(keyword):
        matched.append("arboristika")
    if RE_SNEG.search(keyword):
        matched.append("uborka-snega")
    if RE_DEMONT.search(keyword) and not RE_DEMONT_NEGATIVE.search(keyword):
        matched.append("demontazh-b2c")
    if RE_LANDSHAFT.search(keyword):
        matched.append("landshaft")
    return matched, len(matched) > 1


# ───────── Load fallback normalized.csv для our_position ─────────


def load_our_keywords() -> dict[str, dict]:
    """obikhod.ru pull was 404; fallback на discovery normalized.csv (1601 ключ).
    Возвращаем dict[normalized_keyword → {intent, cluster_pillar}]."""
    if not NORMALIZED_CSV.exists():
        return {}
    out: dict[str, dict] = {}
    with NORMALIZED_CSV.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            kw = (row.get("keyword") or row.get("phrase") or "").strip().lower()
            if kw:
                out[kw] = {
                    "intent": row.get("intent", ""),
                    "cluster": row.get("cluster", "") or row.get("pillar", ""),
                }
    return out


# ───────── Main ─────────


def normalize_kw(kw: str) -> str:
    return (kw or "").strip().lower()


def main():
    print(f"[load] manifest {PULL_MANIFEST}")
    manifest = json.loads(PULL_MANIFEST.read_text())

    # Phase B step 1+2 — load all 33 JSON, build long-format
    rows: list[dict] = []
    domains_loaded = []
    for entry in manifest["domains"]:
        domain = entry["domain"]
        if domain == "obikhod.ru":
            continue  # обрабатываем через fallback ниже
        if entry["kw_count"] == 0:
            continue
        path = RAW_DIR / entry["file"]
        data = json.loads(path.read_text())
        for k in data["keywords"]:
            rows.append(
                {
                    "domain": domain,
                    "keyword": normalize_kw(k.get("word", "")),
                    "ws": k.get("ws", 0) or 0,
                    "wsk": k.get("wsk", 0) or 0,
                    "superwsk": k.get("superwsk"),
                    "pos": k.get("pos", 999) or 999,
                    "url": k.get("url", "") or "",
                }
            )
        domains_loaded.append(domain)
    print(f"[loaded] {len(domains_loaded)} domains, {len(rows)} rows long-format")

    # Phase B step 3 — pivot to keyword-level
    bykw: dict[str, dict] = defaultdict(
        lambda: {
            "ws_max": 0,
            "wsk_max": 0,
            "superwsk_max": 0,
            "domains": set(),
            "domains_top10": set(),
            "min_pos": 999,
            "first_url": "",
        }
    )
    for r in rows:
        kw = r["keyword"]
        if not kw:
            continue
        b = bykw[kw]
        if r["ws"] > b["ws_max"]:
            b["ws_max"] = r["ws"]
        if r["wsk"] > b["wsk_max"]:
            b["wsk_max"] = r["wsk"]
        sw = r["superwsk"]
        if sw is not None and sw > b["superwsk_max"]:
            b["superwsk_max"] = sw
        b["domains"].add(r["domain"])
        if r["pos"] <= 10:
            b["domains_top10"].add(r["domain"])
        if r["pos"] < b["min_pos"]:
            b["min_pos"] = r["pos"]
            b["first_url"] = r["url"]
    print(f"[pivot] {len(bykw)} unique keywords")

    # Phase B step 4 — fallback our_position через normalized.csv
    our = load_our_keywords()
    print(f"[fallback] our_keywords from normalized.csv: {len(our)}")

    # Phase B step 5+6+7 — apply classifiers and build master rows
    master: list[dict] = []
    for kw, b in bykw.items():
        wsk = b["wsk_max"]
        sw = b["superwsk_max"] if b["superwsk_max"] > 0 else None
        tier = tier_classify(wsk, sw)
        intent = intent_classify(kw)
        clusters, multi = cluster_classify(kw)
        # our_position fallback: если ключ есть в normalized.csv → "planned"
        our_match = our.get(kw)
        master.append(
            {
                "keyword": kw,
                "ws": b["ws_max"],
                "wsk": wsk,
                "superwsk": b["superwsk_max"],
                "domains_count": len(b["domains"]),
                "domains_list": ";".join(sorted(b["domains"])),
                "domains_top10_count": len(b["domains_top10"]),
                "our_status": "planned" if our_match else "not_planned",
                "our_intent": our_match["intent"] if our_match else "",
                "our_cluster": our_match["cluster"] if our_match else "",
                "min_competitor_pos": b["min_pos"],
                "top_competitor_url": b["first_url"],
                "tier_freq": tier,
                "intent_marker": intent,
                "cluster_hint": ";".join(clusters) if clusters else "",
                "multi_cluster": multi,
            }
        )
    # sort by wsk desc
    master.sort(key=lambda r: -r["wsk"])

    # Phase B step 8 — write 4 CSV
    fields_master = [
        "keyword",
        "ws",
        "wsk",
        "superwsk",
        "domains_count",
        "domains_list",
        "domains_top10_count",
        "our_status",
        "our_intent",
        "our_cluster",
        "min_competitor_pos",
        "top_competitor_url",
        "tier_freq",
        "intent_marker",
        "cluster_hint",
        "multi_cluster",
    ]
    master_path = DERIVED_DIR / f"keysso-master-union-{TAG}.csv"
    with master_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields_master)
        w.writeheader()
        w.writerows(master)
    print(f"[saved] {master_path} ({len(master)} rows)")

    # Multi-intersect: domains_count >= 2
    multi_rows = [r for r in master if r["domains_count"] >= 2]
    multi_path = DERIVED_DIR / f"keysso-intersect-multi-{TAG}.csv"
    with multi_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields_master)
        w.writeheader()
        w.writerows(multi_rows)
    print(f"[saved] {multi_path} ({len(multi_rows)} rows)")

    # Whitespace: not_planned & domains_count >= 3
    whitespace = []
    for r in master:
        if r["our_status"] == "not_planned" and r["domains_count"] >= 3:
            # priority A1 / A2 / B
            if r["tier_freq"] == "ВЧ" and r["domains_count"] >= 5:
                pri = "A1"
            elif r["tier_freq"] == "СЧ" and r["domains_count"] >= 3:
                pri = "A2"
            elif r["tier_freq"] == "ВЧ" and r["domains_count"] >= 3:
                pri = "A2"
            else:
                pri = "B"
            row = dict(r)
            row["priority"] = pri
            whitespace.append(row)
    fields_white = fields_master + ["priority"]
    white_path = DERIVED_DIR / f"keysso-whitespace-{TAG}.csv"
    with white_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields_white)
        w.writeheader()
        w.writerows(whitespace)
    print(f"[saved] {white_path} ({len(whitespace)} rows)")

    # Per-domain unique: top-30 каждого где domains_count==1
    by_domain: dict[str, list[dict]] = defaultdict(list)
    for r in master:
        if r["domains_count"] == 1:
            domain = r["domains_list"]
            row = dict(r)
            row["domain"] = domain
            by_domain[domain].append(row)
    unique_rows = []
    for d, rs in by_domain.items():
        rs.sort(key=lambda x: -x["wsk"])
        unique_rows.extend(rs[:30])
    unique_rows.sort(key=lambda r: (r["domain"], -r["wsk"]))
    fields_unique = ["domain"] + fields_master
    unique_path = DERIVED_DIR / f"keysso-per-domain-unique-{TAG}.csv"
    with unique_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields_unique)
        w.writeheader()
        w.writerows(unique_rows)
    print(f"[saved] {unique_path} ({len(unique_rows)} rows; per-domain ≤30)")

    # Summary stats
    tier_counts = defaultdict(int)
    intent_counts = defaultdict(int)
    direction_counts = defaultdict(int)
    for r in master:
        tier_counts[r["tier_freq"]] += 1
        intent_counts[r["intent_marker"]] += 1
        if r["cluster_hint"]:
            for c in r["cluster_hint"].split(";"):
                direction_counts[c] += 1
        else:
            direction_counts["_unmatched"] += 1
    print()
    print(f"[stats] tier_freq: {dict(tier_counts)}")
    print(f"[stats] intent_marker: {dict(intent_counts)}")
    print(f"[stats] cluster_hint: {dict(direction_counts)}")
    print(
        f"[stats] whitespace: A1={sum(1 for r in whitespace if r['priority']=='A1')} "
        f"A2={sum(1 for r in whitespace if r['priority']=='A2')} "
        f"B={sum(1 for r in whitespace if r['priority']=='B')}"
    )


if __name__ == "__main__":
    main()
