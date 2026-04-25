#!/usr/bin/env python3
"""US-4 Wave 2 — нормализация результата кластеризации и раскладка по pillar.

Вход: seosite/03-clusters/raw-justmagic-*.csv (gzip-csv, табы, UTF-8 BOM)
Выход:
  - seosite/02-keywords/normalized.csv — единая таблица всех ключей с частотами,
    регионом, intent, source, кластером
  - seosite/03-clusters/<pillar>.md — раскладка кластеров по 7 файлам:
       arboristika.md, chistka-krysh.md, vyvoz-musora.md, demontazh.md,
       b2b.md, tools-and-docs.md, neuro-info.md
  - seosite/03-clusters/orphans.md — крупные кластеры, не попавшие в URL-tree

Также вычисляет ответ на Q-2 (чистка vs очистка крыш) по реальным wsfreq.
"""
from __future__ import annotations

import csv
import gzip
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KW_DIR = ROOT / "02-keywords"
CL_DIR = ROOT / "03-clusters"

# === Pillar routing rules ===
# Каждый ключ относим к одному pillar по первому совпадению (приоритет сверху вниз).

PILLAR_RULES = [
    # Brand / навигационные брендовые → neuro-info (но особо помечаем)
    (
        "neuro-info",
        [
            r"\b4\s?-?\s?в\s?-?\s?1\b",
            r"\bобиход",
            r"\bпорядок\sпод\sключ",
            r"\bкомплексн.*4\s?в\s?1",
        ],
    ),
    # B2B (имеет приоритет — содержит наши B2B-маркеры)
    (
        "b2b",
        [
            r"\b(уk|ук|тсж|жск|жэк|управляющ.*компан)\b",
            r"\bмкд\b",
            r"\bоати\b|\bгжи\b",
            r"\bштраф",
            r"\bб2б\b|\bb2b\b",
            r"\bдоговор\sна\sсезон",
            r"\bкомплексн.*обслужив",
            r"\bкомплексн.*подрядч",
            r"\bаутсорсин",
            r"\bтехническое\sобслуживан",
            r"\bобслуживан.*здан",
            r"\bобслуживан.*территор",
            r"\bобслуживан.*коттеджн",
            r"\bтоо\sживотн",
            r"\bсодержание\s(общ|двор|террит)",
            r"\bговор\sтсж|\bговор\sук",
            r"\bgoсзаказ|\bгосзак",
            r"\bбюджет",
            r"\bтендер",
            r"\b44\s?-?\s?ф\s?з|\b223\s?-?\s?ф\s?з",
            r"\bпп\s?1018|\bпостановлен.*1018",
            r"\bоат[ит]\b",
            r"\bгжи\b",
            r"\bжк[ху]\b",
        ],
    ),
    # Документы / регуляторика / аренда техники / промальп
    (
        "tools-and-docs",
        [
            r"\bпорубочн",
            r"\bпорубочн.*билет",
            r"\bбилет.*поруб",
            r"\bпорубочн.*остат",
            r"\bаренд[аы]",
            r"\bавтовышк",
            r"\bпромальп|\bпром.*альпин",
            r"\bпромышленн.*альпин",
            r"\bальпинизм\sпромышленн|\bпромышленн.*альпин",
            r"\bальпинист(?!.*спил)",  # альпинист как услуга (не спил)
            r"\bизмельчит",
            r"\bдробильн",
            r"\bминитрактор|\bмини.*трактор|\bтрактор\sаренд",
            r"\bсамосвал.*аренд|\bаренд.*самосвал",
            r"\bфкко\b",
            r"\bокпд|\bосгу|\bоквэд",
            r"\bбензопил.*аренд",
            r"\bтехник[аи]\sаренд",
            r"\bпарк\sтехник",
            r"\bаренда\s+бул|\bбульдозер|\bэкскаватор",
        ],
    ),
    # Информационные / нейро-цитируемые
    (
        "neuro-info",
        [
            r"\bкак\sполучить",
            r"\bкак\s(делают|делать|выбрать|правил|часто|спил|сделать|подготов|проверить)",
            r"\bкуда\s(сообщ|звонить|обращат|сдат|подат)",
            r"\bкто\s(сноcит|пилит|обяз|должен|отвеч)",
            r"\bпочему\b|\bзачем\b",
            r"\bчто\sтакое\b",
            r"\bсколько\s(стоит|раз|время|дн)",
            r"\bкогда\s(можно|нужно|нельз|спил|обреза|чистят)",
            r"\bможно\sли",
            r"\bнужно\sли",
            r"\bопасное\s(дерево|обреза)",
            r"\bответственн",
            r"\bправил[оа]\b",
            r"\bнорматив",
            r"\bтехнологи",
            r"\bссн\sкод|\bкод\sокп",
            r"\bинструкц",
            r"\bработа\sна\s+высот",  # охрана труда — info
            r"\bпринцип\sработ",
        ],
    ),
    # Чистка крыш / снег / наледь / кровля
    (
        "chistka-krysh",
        [
            r"\bкрыш",
            r"\bкровл",
            r"\bснег",
            r"\bналед",
            r"\bсосульк",
            r"\bзимн.*убор",
            r"\bснегоубор",
            r"\bсбивани[ея]\s+сосул",
        ],
    ),
    # Мусор / вывоз / контейнер
    (
        "vyvoz-musora",
        [
            r"\bмусор",
            r"\bхлам",
            r"\bстройм",
            r"\bконтейнер",
            r"\bсамосвал(?!.*аренд)",
            r"\bгазел.*мусор|\bмусор.*газел",
            r"\bвывоз\s(меб|стар|порубоч|садов|бытов|круп|листв)",
            r"\bкгм\b|\bтко\b|\bтбо\b",
            r"\bпорубочн.*остат",
            r"\bвывоз\s+вет(в|ок|вя)",
        ],
    ),
    # Демонтаж / снос
    (
        "demontazh",
        [
            r"\bдемонта[жз]",
            r"\bснос(?!.*забор.*сетк)",
            r"\bснести",
            r"\bснимать.*стар.*дом",
            r"\bразбор(?:ка)?\s+(дома|бани|сарая|зданий|постр)",
            r"\bоснов.*сноса",
            r"\bсамоснос",
            r"\bдемонтиро",
        ],
    ),
    # Арбористика — спил, удаление, обрезка, кронирование, пни, расчистка
    (
        "arboristika",
        [
            r"\bспил",
            r"\bудален.*дерев",
            r"\bвырубк",
            r"\bвалк[аи]\b",
            r"\bкрон[иу]р|\bкронир",
            r"\bобрезк",
            r"\bобреза(ть|ние|ния|ем|ете|ют)",
            r"\bдерев",
            r"\bпн(е|ю|я|и|ями|ей)\b",
            r"\bкорчев",
            r"\bкорчёв",
            r"\bраскорчев",
            r"\bвет(в|ка|ки|вя|ок|ями|ке)",
            r"\bкустарник",
            r"\bпорос(л|ль|ли|лей)",
            r"\bкаблинг",
            r"\bсуч[еья]",
            r"\bлесоруб",
            r"\bвалить\s+дерев",
            r"\bпилить\s+дерев",
            r"\bпокос|\bпокос\s+трав",
            r"\bбурьян",
            r"\bрасчистк.*участ",
            r"\bрасчистк.*зарос",
            r"\bвыравниван.*участ",
            r"\bвыров.*участ",
            r"\bподготов.*участ.*стро",
            r"\bвалк",
            r"\bкорень.*дерев|\bдеревья\s+корни",
            r"\bуборк[аи]\sдачн",
            r"\bкосит[ье]\s+трав|\bкосим\sтрав",
            r"\bландшафт\w*\s(дизайн|ремонт)",
            r"\bблагоустро",
            r"\bгазон|\bдерн",
        ],
    ),
]
PILLAR_COMPILED = [(name, [re.compile(p, re.IGNORECASE) for p in pats]) for name, pats in PILLAR_RULES]

PILLAR_TITLES = {
    "arboristika": "Арбористика — спил, удаление, обрезка, пни",
    "chistka-krysh": "Чистка крыш, снег, наледь, сосульки",
    "vyvoz-musora": "Вывоз мусора, хлама, стройотходов",
    "demontazh": "Демонтаж и снос построек",
    "b2b": "B2B — УК / ТСЖ / FM / застройщики / госзаказ",
    "tools-and-docs": "Документы и техника (порубочный билет, аренда, промальп)",
    "neuro-info": "Информационные / нейро-цитируемые запросы",
    "_orphan": "Орфаны — крупные кластеры без URL-маршрута",
}

# === Intent rules ===
COMMERCIAL_TRIGGERS = re.compile(
    r"\bцена\b|\bстоимост\b|\bкуп\w+\b|\bзаказа\b|\bзаказать\b|"
    r"\bнедорого\b|\bдешев\w+|\bпрайс\b|\bсметa?\b|\bрасчет\sстоимост\b|"
    r"\bне\sдорого\b|\bу\s+нас\b",
    re.IGNORECASE,
)
LOCAL_TRIGGERS = re.compile(
    r"\bмосква\b|\bмо\b|\bмосковск\w+\b|\bподмоско\b|"
    r"\bодинцов\w*\b|\bкрасногорск\w*\b|\bмытищ\w*\b|\bхимк\w*\b|"
    r"\bистр\w*\b|\bпушкин\w*\b|\bраменск\w*\b|\bжуковск\w*\b|"
    r"\bдомодедов\w*\b|\bподольск\w*\b|\bкоролёв\w*\b|\bкоролев\w*\b|"
    r"\bбалаших\w*\b",
    re.IGNORECASE,
)
INFO_TRIGGERS = re.compile(
    r"\bкак\b|\bпочему\b|\bкогда\b|\bкуда\b|\bчто\sтакое\b|"
    r"\bсколько\sраз\b|\bсколько\sстоит\b|\bправил\w*\b|\bнорматив\w*\b|"
    r"\bответственн\w*\b|\bштраф\w*\b|\bинструкц\w*\b|\bклассифик",
    re.IGNORECASE,
)


def detect_intent(kw: str) -> str:
    """коммерческий / локальный / информационный / нейро / общий"""
    is_comm = bool(COMMERCIAL_TRIGGERS.search(kw))
    is_local = bool(LOCAL_TRIGGERS.search(kw))
    is_info = bool(INFO_TRIGGERS.search(kw))

    if is_comm and is_local:
        return "коммерческий+локальный"
    if is_comm:
        return "коммерческий"
    if is_local:
        return "локальный"
    if is_info:
        return "информационный"
    return "общий"


def route_to_pillar(kw: str) -> str:
    for name, patterns in PILLAR_COMPILED:
        for p in patterns:
            if p.search(kw):
                return name
    return "_orphan"


def safe_int(v) -> int:
    try:
        return int(float(str(v).replace(",", ".")))
    except (ValueError, TypeError):
        return 0


def read_clusters_csv(path: Path) -> tuple[list[str], list[dict]]:
    """Читаем gzip-csv (TSV) от Just-Magic.

    Колонки: key, grp1, grp2, grp3, grp4, частот. WordStat, "частот. WordStat",
             "!частот. !WordStat", mord, tema. У JM кавычки — часть имени
    колонки, а не quote-char. Парсим ручным split('\t') чтобы не съедать кавычки.
    """
    raw = path.read_bytes()
    if raw[:2] == b"\x1f\x8b":
        text = gzip.decompress(raw).decode("utf-8-sig", errors="replace")
    else:
        text = raw.decode("utf-8-sig", errors="replace")
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if not lines:
        return [], []
    header = lines[0].split("\t")
    out = []
    for ln in lines[1:]:
        cols = ln.split("\t")
        if len(cols) < len(header):
            cols = cols + [""] * (len(header) - len(cols))
        out.append(dict(zip(header, cols)))
    return header, out


def main():
    # Объединяем все raw-justmagic-*.csv (включая батчи)
    raw_files = sorted(CL_DIR.glob("raw-justmagic-*.csv"))
    if not raw_files:
        print("[FATAL] no raw-justmagic-*.csv in 03-clusters/", file=sys.stderr)
        sys.exit(1)
    print(f"[input] {len(raw_files)} files: {[p.name for p in raw_files]}", flush=True)

    # Стратегия сборки:
    # 1) Сначала читаем «реальные» JM-csv (раз-justmagic-test*, raw-justmagic-batch*).
    #    Их данные приоритетнее (есть TOP-10 SERP кластеры + точные частоты).
    # 2) Затем читаем localFALLBACK — но добавляем только те key, которых ещё нет.
    header = None
    rows: list[dict] = []
    seen_kw: set[str] = set()
    batch_files_used: list[str] = []
    sorted_files = sorted(
        raw_files,
        key=lambda p: (
            "localFALLBACK" in p.name,  # fallback идёт последним
            p.name,
        ),
    )
    for path in sorted_files:
        h, r = read_clusters_csv(path)
        if not r:
            continue
        batch_tag = path.stem.replace("raw-justmagic-", "")
        added = 0
        for rec in r:
            kw = (rec.get("key") or "").strip().lower().replace("ё", "е")
            kw = re.sub(r"\s+", " ", kw)
            if not kw or kw in seen_kw:
                continue
            seen_kw.add(kw)
            for g in ("grp1", "grp2", "grp3", "grp4"):
                if g in rec and rec[g]:
                    rec[g] = f"{batch_tag}:{rec[g]}"
            rows.append(rec)
            added += 1
        if header is None:
            header = h
        batch_files_used.append(f"{path.name} (+{added})")
    print(f"[csv] merged header={header}, rows={len(rows)}", flush=True)
    print(f"[csv] batches used: {batch_files_used}", flush=True)

    # Угадаем колонки. У Just-Magic стандартные имена примерно такие:
    # «Группа», «Запрос», «Частота» / «Wordstat» / «WS_(...)» / «Тематика»
    # Найдём ключевые поля
    def find_col(*candidates: str) -> str | None:
        norm_header = [(h, h.lower().strip()) for h in header]
        for cand in candidates:
            for orig, low in norm_header:
                if cand in low:
                    return orig
        return None

    col_kw = find_col("key", "запрос", "ключев", "фраза", "keyword")
    # У JM есть grp1..grp4 (разные threshold). Используем grp3 — стандартный hard-clustering
    # с порогом ТОП-3 совпадений (золотая середина). grp1 — слишком жёстко, grp4 — мягко.
    col_group = "grp3" if "grp3" in header else find_col("групп", "кластер", "group", "cluster")
    # «частот. WordStat» (без кавычек) — общая
    col_freq_std = next(
        (h for h in header if h.strip() == "частот. WordStat"), None
    ) or find_col("частот", "ws", "wordstat")
    col_freq_q = next(
        (h for h in header if h.strip() == '"частот. WordStat"'), None
    )
    col_freq_qv = next(
        (h for h in header if h.strip() == '"!частот. !WordStat"'), None
    )
    col_temakl = find_col("tema")
    col_mord = find_col("mord")

    print(
        f"[cols] kw={col_kw} group={col_group} freq_std={col_freq_std} "
        f"freq_q={col_freq_q} freq_qv={col_freq_qv} temakl={col_temakl} mord={col_mord}",
        flush=True,
    )

    # Загружаем pool-stats и Keys.so источники
    keysso_domains: dict[str, set[str]] = defaultdict(set)
    for p in (ROOT / "02-keywords" / "raw").glob("keysso-*.json"):
        try:
            j = json.loads(p.read_text())
            d = j["domain"]
            for o in j.get("keywords", []):
                w = o.get("word") or o.get("keyword")
                if w:
                    n = w.strip().lower().replace("ё", "е")
                    n = re.sub(r"\s+", " ", n)
                    keysso_domains[n].add(d)
        except Exception:
            pass

    # Группируем по cluster_id (= группа)
    clusters: dict[str, list[dict]] = defaultdict(list)
    keywords_norm: list[dict] = []

    for r in rows:
        kw = (r.get(col_kw) or "").strip()
        if not kw:
            continue
        n = kw.lower().replace("ё", "е")
        n = re.sub(r"\s+", " ", n).strip()
        group = (r.get(col_group) or "").strip() or "__no_group__"
        f_std = safe_int(r.get(col_freq_std)) if col_freq_std else 0
        f_q = safe_int(r.get(col_freq_q)) if col_freq_q else 0
        f_qv = safe_int(r.get(col_freq_qv)) if col_freq_qv else 0
        temakl = (r.get(col_temakl) or "").strip() if col_temakl else ""
        intent = detect_intent(n)
        pillar = route_to_pillar(n)

        sources = []
        if n in keysso_domains:
            sources.append("keysso:" + ",".join(sorted(keysso_domains[n])))
        # Прочее: seed/sugpar — определим, был ли в seed.txt
        sources.append("jm")

        rec = {
            "keyword": n,
            "cluster": group,
            "pillar": pillar,
            "intent": intent,
            "freq_std": f_std,
            "freq_q": f_q,
            "freq_qv": f_qv,
            "temakl": temakl,
            "source": ";".join(sources),
        }
        keywords_norm.append(rec)
        clusters[group].append(rec)

    # === normalized.csv ===
    norm_path = KW_DIR / "normalized.csv"
    with norm_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(
            [
                "keyword",
                "cluster",
                "pillar",
                "intent",
                "freq_wordstat_total_msk_mo",
                "freq_quotes_phrase",
                "freq_exclam_exact",
                "tematic_classifier",
                "source",
            ]
        )
        for rec in sorted(
            keywords_norm, key=lambda r: (-r["freq_std"], r["pillar"], r["keyword"])
        ):
            w.writerow(
                [
                    rec["keyword"],
                    rec["cluster"],
                    rec["pillar"],
                    rec["intent"],
                    rec["freq_std"],
                    rec["freq_q"],
                    rec["freq_qv"],
                    rec["temakl"],
                    rec["source"],
                ]
            )
    print(f"[saved] {norm_path} ({len(keywords_norm)} kw, {len(clusters)} clusters)")

    # === Q-2 sanity: чистка vs очистка крыш ===
    q2_data = {"chistka": 0, "ochistka": 0, "chistka_count": 0, "ochistka_count": 0}
    chistka_re = re.compile(r"\bчистка\s+(крыш|кровл)", re.IGNORECASE)
    ochistka_re = re.compile(r"\bочистка\s+(крыш|кровл)", re.IGNORECASE)
    for rec in keywords_norm:
        if chistka_re.search(rec["keyword"]):
            q2_data["chistka"] += rec["freq_std"]
            q2_data["chistka_count"] += 1
        if ochistka_re.search(rec["keyword"]):
            q2_data["ochistka"] += rec["freq_std"]
            q2_data["ochistka_count"] += 1
    (CL_DIR / "_q2_signal.json").write_text(json.dumps(q2_data, ensure_ascii=False, indent=2))
    print(f"[Q-2] {q2_data}")

    # === pillar files ===
    by_pillar = defaultdict(list)
    for cl_id, members in clusters.items():
        # Pillar кластера = pillar большинства его ключей
        from collections import Counter

        pillar_counter = Counter(m["pillar"] for m in members)
        cluster_pillar, _ = pillar_counter.most_common(1)[0]
        # Если орфан (cluster большой, но pillar=_orphan), считаем орфаном
        by_pillar[cluster_pillar].append((cl_id, members))

    for pillar, cluster_list in by_pillar.items():
        # сортируем кластеры по сумме wsfreq убыв.
        cluster_list.sort(key=lambda c: -sum(m["freq_std"] for m in c[1]))
        write_pillar_md(pillar, cluster_list)

    # Орфаны — отдельный файл
    if "_orphan" in by_pillar:
        write_orphans_md(by_pillar["_orphan"])

    # Q-2 в начало chistka-krysh.md
    inject_q2_header(q2_data)

    # Сводка
    summary = {
        pillar: {
            "clusters": len(cluster_list),
            "keywords": sum(len(m) for _, m in cluster_list),
            "total_freq_msk_mo": sum(
                sum(m["freq_std"] for m in mm) for _, mm in cluster_list
            ),
        }
        for pillar, cluster_list in by_pillar.items()
    }
    (CL_DIR / "_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2)
    )
    print(f"[summary] {json.dumps(summary, ensure_ascii=False)}")


def write_pillar_md(pillar: str, cluster_list: list[tuple[str, list[dict]]]) -> None:
    """Записать seosite/03-clusters/<pillar>.md."""
    if pillar == "_orphan":
        return
    out = CL_DIR / f"{pillar}.md"
    title = PILLAR_TITLES.get(pillar, pillar)
    lines = []
    lines.append(f"# {title}")
    lines.append("")
    lines.append(f"**Pillar:** `{pillar}`")
    lines.append("**Wave 2 версия:** v0.5 (передаётся seo1 для финализации).")
    lines.append("**Кластеризация:**")
    lines.append("- 50 ключей — Just-Magic `grp_onl` (Yandex TOP-10, ya_lr=213, ya_lrws=1, threshold grp3).")
    lines.append("- ~1550 ключей — локальная морфо-кластеризация (`local_cluster.py`),")
    lines.append("  потому что Just-Magic API упорно возвращал 503 на тяжёлые POST в окне сессии.")
    lines.append("- Полная кластеризация: запустить `seosite/scripts/jm_cluster_batched.py`")
    lines.append("  когда JM-сервис восстановится (`info`-ping → 200 → submit мелкими батчами).")
    lines.append("**Частоты wsfreq:**")
    lines.append("- ~200 ключей с реальными wsfreq (Just-Magic `wsfreq`, Москва+МО).")
    lines.append("- Остальные 1400+ — `freq=0` означает «не запрошено», не «нет частоты».")
    lines.append(
        "  Дозабор: `seosite/scripts/jm_wsfreq_micro.py` (50-kw батчи, ~1₽/батч)."
    )
    lines.append("**Канон seed:** см. [seosite/02-keywords/seed.txt](../02-keywords/seed.txt) (184 запроса).")
    lines.append("**Pool:** [seosite/02-keywords/pool.txt](../02-keywords/pool.txt) (1600 уникальных).")
    lines.append("**Полная таблица:** [seosite/02-keywords/normalized.csv](../02-keywords/normalized.csv).")
    lines.append("")
    total_freq = sum(sum(m["freq_std"] for m in mm) for _, mm in cluster_list)
    total_kw = sum(len(m) for _, m in cluster_list)
    lines.append(f"**Pillar totals:** clusters={len(cluster_list)}, keywords={total_kw}, sum_freq_msk_mo={total_freq}")
    lines.append("")
    lines.append("---")
    lines.append("")

    for idx, (cl_id, members) in enumerate(cluster_list, 1):
        members.sort(key=lambda r: -r["freq_std"])
        canon = members[0]["keyword"]
        cluster_freq = sum(m["freq_std"] for m in members)
        lines.append(f"## Cluster {idx}: «{canon}»")
        lines.append("")
        lines.append(f"- **Cluster id (Just-Magic):** `{cl_id}`")
        lines.append(f"- **Keywords:** {len(members)}")
        lines.append(f"- **Sum wsfreq (МСК+МО):** {cluster_freq}")
        # Подсказка target URL — не привязка, а гипотеза для seo1
        lines.append(f"- **Target URL hint:** см. {pillar}/{cluster_url_hint(canon, pillar)}")
        intents = sorted({m["intent"] for m in members})
        lines.append(f"- **Intents:** {', '.join(intents)}")
        # топ-15 ключей
        lines.append("")
        lines.append("| Запрос | wsfreq (МСК+МО) | \"фраза\" | \"!фраза\" | intent |")
        lines.append("|---|---:|---:|---:|---|")
        for m in members[:30]:
            lines.append(
                f"| {m['keyword']} | {m['freq_std']} | {m['freq_q']} | {m['freq_qv']} | {m['intent']} |"
            )
        if len(members) > 30:
            lines.append(f"")
            lines.append(f"_…и ещё {len(members) - 30} ключей в normalized.csv (cluster=`{cl_id}`)._")
        lines.append("")

    out.write_text("\n".join(lines))
    print(f"[saved] {out}")


def write_orphans_md(cluster_list: list[tuple[str, list[dict]]]) -> None:
    out = CL_DIR / "orphans.md"
    cluster_list.sort(key=lambda c: -sum(m["freq_std"] for m in c[1]))
    lines = ["# Орфаны — крупные кластеры без URL-маршрута", ""]
    lines.append(
        "Кластеры, для которых правила pillar-routing не нашли совпадения. "
        "Передать seo1 для решения: добавить в существующий pillar / расширить sitemap / "
        "выделить в новый pillar / отбросить как нерелевантный."
    )
    lines.append("")
    for cl_id, members in cluster_list:
        if len(members) < 2 and sum(m["freq_std"] for m in members) < 100:
            continue  # мелкие пропускаем
        members.sort(key=lambda m: -m["freq_std"])
        canon = members[0]["keyword"]
        lines.append(f"## «{canon}» ({len(members)} kw, sum wsfreq={sum(m['freq_std'] for m in members)})")
        lines.append("")
        lines.append(f"- **Cluster id:** `{cl_id}`")
        for m in members[:15]:
            lines.append(f"  - {m['keyword']} — wsfreq={m['freq_std']}")
        lines.append("")
    out.write_text("\n".join(lines))
    print(f"[saved] {out}")


def cluster_url_hint(canon: str, pillar: str) -> str:
    """Грубая подсказка URL — для guidance, не для канона. seo1 принимает решение."""
    n = canon.lower()
    if pillar == "arboristika":
        if "пн" in n or "корчев" in n:
            return "udalenie-pnya/"
        if "крон" in n:
            return "kronirovanie/"
        if "обрезк" in n:
            return "sanitarnaya-obrezka/"
        if "альпин" in n:
            return "spil-alpinistami/"
        if "автовышк" in n:
            return "spil-s-avtovyshki/"
        if "удален" in n or "спил" in n or "вырубк" in n or "валк" in n:
            return "spil-dereviev/"
        if "пень" in n or "пни" in n:
            return "udalenie-pnya/"
        if "поруб" in n or "ветв" in n or "вет" in n:
            return "izmelchenie-vetok/"
        if "расчист" in n or "раскорч" in n:
            return "raschistka-uchastka/"
        return "spil-dereviev/"
    if pillar == "chistka-krysh":
        if "мкд" in n or "многоквартирн" in n:
            return "chistka-krysh-mkd/"
        if "сосульк" in n or "налед" in n:
            return "sbivanie-sosulek/"
        if "террит" in n or "уборк" in n:
            return "uborka-territorii-zima/"
        if "частн" in n:
            return "chistka-krysh-chastnyy-dom/"
        return "ot-snega/"
    if pillar == "vyvoz-musora":
        if "стро" in n:
            return "vyvoz-stroymusora/"
        if "садов" in n or "ветв" in n or "поруб" in n:
            return "vyvoz-sadovogo-musora/"
        if "контейнер" in n:
            return "kontejner/"
        if "уборк" in n and "участ" in n:
            return "uborka-uchastka/"
        if "ук" in n or "тсж" in n:
            return "dlya-uk-tszh/"
        return ""
    if pillar == "demontazh":
        if "дач" in n:
            return "demontazh-dachi/"
        if "бан" in n:
            return "demontazh-bani/"
        if "сарай" in n:
            return "demontazh-saraya/"
        if "гараж" in n:
            return "snos-garazha/"
        if "забор" in n:
            return "snos-zabora/"
        if "дом" in n:
            return "snos-doma/"
        return ""
    if pillar == "b2b":
        if "штраф" in n or "оати" in n or "гжи" in n:
            return "shtrafy-gzhi-oati/"
        if "ук" in n or "тсж" in n:
            return "uk-tszh/"
        if "fm" in n:
            return "fm-operatoram/"
        if "застройщ" in n:
            return "zastrojschikam/"
        if "госзак" in n or "44" in n or "223" in n:
            return "goszakaz/"
        if "договор" in n:
            return "dogovor/"
        return ""
    if pillar == "tools-and-docs":
        if "поруб" in n or "билет" in n:
            return "porubochnyj-bilet/"
        if "автовышк" in n:
            return "arenda-tehniki/avtovyshka/"
        if "измельчит" in n:
            return "arenda-tehniki/izmelchitel-vetok/"
        if "минитрактор" in n:
            return "arenda-tehniki/minitraktor/"
        if "самосвал" in n:
            return "arenda-tehniki/samosval/"
        if "альпин" in n or "промальп" in n:
            return "promyshlennyj-alpinizm/"
        return ""
    if pillar == "neuro-info":
        return "blog/<slug>/"
    return ""


def inject_q2_header(q2: dict) -> None:
    md = CL_DIR / "chistka-krysh.md"
    if not md.exists():
        return
    body = md.read_text().splitlines()

    chistka_freq = q2.get("chistka", 0)
    ochistka_freq = q2.get("ochistka", 0)
    has_freq = chistka_freq > 0 or ochistka_freq > 0

    if has_freq:
        verdict_line = (
            "**Победитель по wsfreq:** "
            + ("«чистка»" if chistka_freq >= ochistka_freq else "«очистка»")
        )
        ratio = (
            chistka_freq / max(ochistka_freq, 1)
            if chistka_freq >= ochistka_freq
            else ochistka_freq / max(chistka_freq, 1)
        )
        ratio_line = f"**Ratio (по wsfreq МСК+МО):** {ratio:.2f}x"
    else:
        # JM был недоступен → используем count подсказок Yandex как proxy-сигнал
        verdict_line = (
            "**Сигнал по подсказкам Yandex (JM sug_par + Keys.so, count):** "
            + (
                "«чистка» имеет больше уникальных подсказок"
                if q2["chistka_count"] >= q2["ochistka_count"]
                else "«очистка» имеет больше уникальных подсказок"
            )
        )
        ratio = (
            q2["chistka_count"] / max(q2["ochistka_count"], 1)
            if q2["chistka_count"] >= q2["ochistka_count"]
            else q2["ochistka_count"] / max(q2["chistka_count"], 1)
        )
        ratio_line = (
            f"**Ratio (по count подсказок):** {ratio:.2f}x. **Wsfreq не получен** — "
            "Just-Magic был в downtime во время прогона; финальное решение примет "
            "seo1 после восстановления JM (запустить `seosite/scripts/jm_wsfreq_micro.py` "
            "и пересобрать таблицу)."
        )

    insert = [
        "## Q-2 ANSWER (для seo1 + оператор → ADR)",
        "",
        "Решение по slug: `chistka-krysh` или `ochistka-krysh`?",
        "",
        f"- **«чистка крыш/кровл»**: {q2['chistka_count']} уникальных ключей, "
        f"sum wsfreq МСК+МО = **{chistka_freq}**",
        f"- **«очистка крыш/кровл»**: {q2['ochistka_count']} уникальных ключей, "
        f"sum wsfreq МСК+МО = **{ochistka_freq}**",
        "",
        verdict_line,
        "",
        ratio_line,
        "",
        "**Рекомендация re:**",
        "1. Если по wsfreq победила «чистка» — мигрировать pillar slug на "
        "`chistka-krysh` через Redirects-коллекцию (текущий канон в БД — "
        "`ochistka-krysh`). Title/H1/мета на «чистка крыш».",
        "2. Если победила «очистка» — оставить как есть, но в текстах посадочных "
        "использовать оба корня (LSI), не злоупотреблять «очистка».",
        "3. По текущему counts-сигналу подсказок — «чистка» лидирует "
        f"({q2['chistka_count']} vs {q2['ochistka_count']}). Это слабый proxy, "
        "финальное решение — после пересчёта wsfreq.",
        "",
        "---",
        "",
    ]
    # Вставляем после первой `---` (после метаданных pillar)
    out = []
    inserted = False
    sep_count = 0
    for line in body:
        out.append(line)
        if line.strip() == "---":
            sep_count += 1
            if sep_count == 1 and not inserted:
                out.extend(insert)
                inserted = True
    md.write_text("\n".join(out))


if __name__ == "__main__":
    main()
