"""
keysso_cluster_services.py

Фильтрует коммерческие ключи из master-union и whitespace CSV,
группирует по типу услуги (liwood-совместимая таксономия),
сохраняет CSV + сводный _summary.md.

Вход:
  seosite/02-keywords/derived/keysso-master-union-2026-05-03.csv
  seosite/02-keywords/derived/keysso-whitespace-2026-05-03.csv

Выход:
  seosite/03-clusters/services-commercial/{cluster}.csv
  seosite/03-clusters/services-commercial/_summary.md
"""

import csv
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DERIVED = ROOT / "02-keywords" / "derived"
OUT_DIR = ROOT / "03-clusters" / "services-commercial"
OUT_DIR.mkdir(parents=True, exist_ok=True)

MASTER_CSV = DERIVED / "keysso-master-union-2026-05-03.csv"
WHITESPACE_CSV = DERIVED / "keysso-whitespace-2026-05-03.csv"

# Таксономия: (slug, label, regex-паттерны ДЛЯ ВКЛЮЧЕНИЯ, regex ДЛЯ ИСКЛЮЧЕНИЯ)
TAXONOMY = [
    # ── АРБОРИСТИКА ─────────────────────────────────────────────────────────
    ("arbo-udalenie", "Удаление деревьев", [
        r"спил|спилить|спиленн|вырубк|вырубить|вырубать|валк|валить|удалени[еяю] дерев|"
        r"снос дерев|аварийн\w* дерев|сухостой|сухостойн|корчеван|раскорчев|"
        r"корчевка|выкорчевать|выкорчевыван",
    ], [
        r"пень|пни|участк|кустарник|борщевик|снег|мусор|демонтаж|снос дач|снос бан",
    ]),

    ("arbo-obrezka", "Обрезка деревьев", [
        r"обрезк\w+ дерев|обрезк\w+ яблон|обрезк\w+ груш|обрезк\w+ слив|"
        r"обрезк\w+ вишн|обрезк\w+ абрикос|обрезк\w+ персик|обрезк\w+ черешн|"
        r"обрезк\w+ плодов|обрезк\w+ хвойн|обрезк\w+ высок|санитарн\w+ обрезк|"
        r"омолаживающ\w+ обрезк|формировочн\w+ обрезк|декоративн\w+ обрезк|"
        r"обрезчик дерев|обрезать дерев|обрезать яблон",
    ], [
        r"кустарник|газон|трава|снег",
    ]),

    ("arbo-kronirovanie", "Кронирование", [
        r"кронирован|кронировать|крон\w+ дерев|формирован\w+ крон",
    ], []),

    ("arbo-pni", "Удаление пней", [
        r"удалени[еяю] пн|удалить пень|корчеван\w+ пн|корчевать пн|"
        r"дроблени[еяю] пн|дробить пн|фрезерован\w+ пн|измельчени[еяю] пн|пень цена|пни цена",
    ], []),

    ("arbo-izmelchenie", "Измельчение веток / щепа", [
        r"измельчени[еяю] ветк|измельчить ветк|аренд\w+ измельчител|"
        r"прокат измельчител|измельчитель ветк|щепа|переработк\w+ ветк|"
        r"порубочн\w+ остатк",
    ], []),

    ("arbo-opyskivanie", "Опрыскивание / защита от короеда", [
        r"короед|защита от короеда|обработк\w+ от короеда|опрыскиван\w+ дерев|"
        r"обработк\w+ дерев от вредителей|борщевик|уничтожени[еяю] борщевик|"
        r"обработк\w+ от вредителей",
    ], [
        r"снег|мусор",
    ]),

    ("arbo-lechenie", "Лечение деревьев", [
        r"лечени[еяю] дерев|инъекции для дерев|капельница для дерев|"
        r"смоляной рак|сухобочин|дупло дерев|дупл\w+ дерев|стволов\w+ инъекц",
    ], []),

    ("arbo-ukreplenie", "Укрепление деревьев (брейсинг)", [
        r"брейсинг|каблинг|укреплени[еяю] дерев|растяжк\w+ для дерев|"
        r"стяжк\w+ для дерев",
    ], []),

    ("arbo-obsledovanie", "Обследование и диагностика", [
        r"дендроплан|обследовани[еяю] дерев|диагностик\w+ дерев|"
        r"лесопатолог|фитопатолог|дендролог\b",
    ], []),

    ("arbo-porubochny", "Порубочный билет", [
        r"порубочн\w+ билет|порубочный|разрешени[еяю] на спил|разрешени[еяю] вырубк",
    ], []),

    # ── УБОРКА ТЕРРИТОРИИ ───────────────────────────────────────────────────
    ("uborka-pokos", "Покос травы / стрижка газона", [
        r"покос трав|покосить трав|стрижк\w+ газон|стрижка трав|косить трав|"
        r"кошение трав|газон покос|триммер трав|скосить трав",
    ], []),

    ("uborka-vyravnivanie", "Выравнивание участка", [
        r"выравнивани[еяю] участк|выровнять участок|планировк\w+ участк|"
        r"грейдирован\w+ участк",
    ], []),

    ("uborka-raschistka", "Расчистка / уборка участка", [
        r"расчистк\w+ участк|уборк\w+ участк|уборк\w+ дачн\w+|расчистить участок|"
        r"раскорчевк\w+ участк|уборк\w+ территори",
    ], [
        r"снег",
    ]),

    ("uborka-kustarniki", "Вырубка кустарников", [
        r"вырубк\w+ кустарник|вырубить кустарник|удалени[еяю] кустарник|"
        r"расчистк\w+ кустарник|кустарник убрать",
    ], []),

    ("uborka-vyvoz-snega", "Вывоз / уборка снега с территории", [
        r"уборк\w+ снег\w+ с участк|вывоз снег\w+ с территори|"
        r"уборк\w+ снег\w+ на территори|механизирован\w+ уборк\w+ снег",
    ], [
        r"крыш|кровл",
    ]),

    # ── ПРОМАЛЬП / КРЫШИ ────────────────────────────────────────────────────
    ("promалп-krysha", "Уборка снега с крыш / чистка кровли", [
        r"чистк\w+ крыш|уборк\w+ снег\w+ с крыш|чистк\w+ кровл|"
        r"очистк\w+ крыш|наледь крыш|сосульк",
    ], []),

    ("promалп-mojka", "Мойка фасадов / окон", [
        r"мойк\w+ фасад|мытье фасад|мойк\w+ окон|мытье окон|"
        r"мойк\w+ высотн|промышленн\w+ мойк",
    ], []),

    ("promалп-vodostoki", "Чистка водостоков", [
        r"чистк\w+ водосток|промывк\w+ водосток|прочистк\w+ водосток",
    ], []),

    # ── ВЫВОЗ МУСОРА ────────────────────────────────────────────────────────
    ("musor-obshiy", "Вывоз мусора (общий)", [
        r"вывоз мусор|вывезти мусор|мусор вывоз|утилизаци[яю] мусор|"
        r"уборк\w+ мусор",
    ], [
        r"снег|стро|строи|сад",
    ]),

    ("musor-kgm", "КГМ / крупногабаритный мусор", [
        r"крупногабарит|кгм\b|вывоз старой мебел|вывоз холодильник|"
        r"вывоз бытов\w+ техник",
    ], []),

    ("musor-stroy", "Строительный мусор", [
        r"строительн\w+ мусор|строймусор|вывоз строймусор|строймусор вывоз|"
        r"вывоз мусора после ремонт|демонтаж и вывоз",
    ], []),

    ("musor-sadovy", "Садовый мусор / порубочные", [
        r"садов\w+ мусор|вывоз садов\w+ мусор|листва вывоз|ветки вывоз|"
        r"вывоз веток|вывоз листьев",
    ], []),

    ("musor-konteyner", "Контейнер для мусора", [
        r"контейнер для мусор|аренд\w+ контейнер|заказать контейнер|"
        r"контейнер 8 м|контейнер 20 м|контейнер 27 м|бункер для мусор",
    ], []),

    # ── ДЕМОНТАЖ ────────────────────────────────────────────────────────────
    ("demontazh-snos-doma", "Снос дома", [
        r"снос дома|снести дом|демонтаж дом\b|демонтировать дом",
    ], [r"дача|баня|гараж"]),

    ("demontazh-snos-dachi", "Снос дачи", [
        r"снос дач|снести дач|демонтаж дач|разборк\w+ дач",
    ], []),

    ("demontazh-banya", "Снос бани / сарая", [
        r"снос бан|снести бан|демонтаж бан|снос сара|демонтаж сара",
    ], []),

    ("demontazh-garazh", "Снос гаража", [
        r"снос гараж|снести гараж|демонтаж гараж",
    ], []),

    ("demontazh-zabor", "Демонтаж забора", [
        r"демонтаж забор|снос забор|разборк\w+ забор|убрать забор",
    ], []),

    ("demontazh-fundament", "Демонтаж фундамента", [
        r"демонтаж фундамент|снос фундамент|разборк\w+ фундамент",
    ], []),
]

COMMERCIAL_INTENTS = {"коммерческий", "коммерческий+локальный"}


def compile_patterns(patterns: list[str]) -> re.Pattern:
    return re.compile("|".join(patterns), re.IGNORECASE | re.UNICODE)


def build_taxonomy():
    compiled = []
    for slug, label, include_pats, exclude_pats in TAXONOMY:
        inc = compile_patterns(include_pats)
        exc = compile_patterns(exclude_pats) if exclude_pats else None
        compiled.append((slug, label, inc, exc))
    return compiled


def classify(keyword: str, taxonomy) -> list[str]:
    hits = []
    for slug, label, inc, exc in taxonomy:
        if inc.search(keyword):
            if exc and exc.search(keyword):
                continue
            hits.append(slug)
    return hits


def load_csv(filepath: Path) -> list[dict]:
    rows = []
    with open(filepath, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def main():
    taxonomy = build_taxonomy()
    slug_to_label = {s: l for s, l, *_ in TAXONOMY}

    # Загружаем master-union
    print("Загружаю master-union...")
    master = load_csv(MASTER_CSV)
    print(f"  Всего строк: {len(master)}")

    # Загружаем whitespace (gap-ключи)
    print("Загружаю whitespace...")
    whitespace_keys = set()
    if WHITESPACE_CSV.exists():
        ws_rows = load_csv(WHITESPACE_CSV)
        whitespace_keys = {r["keyword"] for r in ws_rows}
        print(f"  Whitespace ключей: {len(whitespace_keys)}")

    # Фильтр: коммерческие
    commercial = [
        r for r in master
        if r.get("intent_marker", "").strip() in COMMERCIAL_INTENTS
    ]
    print(f"  Коммерческих ключей: {len(commercial)}")

    # Кластеризация
    clusters: dict[str, list[dict]] = defaultdict(list)
    unclassified = []

    for row in commercial:
        kw = row.get("keyword", "").strip()
        hits = classify(kw, taxonomy)
        if not hits:
            unclassified.append(row)
        else:
            for slug in hits:
                row_copy = dict(row)
                row_copy["is_whitespace"] = "1" if kw in whitespace_keys else "0"
                clusters[slug].append(row_copy)

    print(f"  Классифицировано: {sum(len(v) for v in clusters.values())} вхождений")
    print(f"  Не классифицировано: {len(unclassified)}")

    # Сохраняем CSV по кластерам
    fieldnames = ["keyword", "wsk", "superwsk", "domains_count", "tier_freq",
                  "top_competitor_url", "is_whitespace"]

    cluster_stats = []
    for slug, label in [(s, l) for s, l, *_ in TAXONOMY]:
        rows = clusters.get(slug, [])
        if not rows:
            cluster_stats.append({
                "slug": slug, "label": label, "count": 0,
                "wsk_sum": 0, "whitespace_count": 0,
            })
            continue

        rows_sorted = sorted(rows, key=lambda r: int(r.get("wsk", 0) or 0), reverse=True)
        wsk_sum = sum(int(r.get("wsk", 0) or 0) for r in rows_sorted)
        ws_count = sum(1 for r in rows_sorted if r.get("is_whitespace") == "1")

        out_path = OUT_DIR / f"{slug}.csv"
        with open(out_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows_sorted)

        cluster_stats.append({
            "slug": slug, "label": label,
            "count": len(rows_sorted),
            "wsk_sum": wsk_sum,
            "whitespace_count": ws_count,
        })
        print(f"  {slug}: {len(rows_sorted)} ключей, wsk_sum={wsk_sum:,}, whitespace={ws_count}")

    # Сохраняем сводку
    cluster_stats_sorted = sorted(cluster_stats, key=lambda x: x["wsk_sum"], reverse=True)
    write_summary(cluster_stats_sorted, len(commercial), len(unclassified))
    print(f"\nГотово → {OUT_DIR.relative_to(ROOT.parent)}/")


def write_summary(stats: list[dict], total_commercial: int, unclassified: int):
    lines = [
        "# Коммерческая семантика по типам услуг",
        "",
        f"_Источник: master-union 2026-05-03, коммерческий intent. "
        f"Всего коммерческих ключей: {total_commercial:,}. "
        f"Не классифицировано: {unclassified:,}._",
        "",
        "## RICE-таблица (сортировка по суммарному wsk)",
        "",
        "| # | Кластер | Ключей | Суммарный wsk | Whitespace | Приоритет |",
        "|---|---|---:|---:|---:|---|",
    ]

    priority_thresholds = [(10000, "**P0**"), (3000, "**P1**"), (0, "P2")]

    for i, s in enumerate(stats, 1):
        if s["count"] == 0:
            priority = "—"
        else:
            priority = next(p for threshold, p in priority_thresholds if s["wsk_sum"] >= threshold)

        ws_str = str(s["whitespace_count"]) if s["count"] > 0 else "—"
        wsk_str = f"{s['wsk_sum']:,}" if s["count"] > 0 else "—"
        count_str = str(s["count"]) if s["count"] > 0 else "0"

        lines.append(
            f"| {i} | [{s['label']}]({s['slug']}.csv) | {count_str} "
            f"| {wsk_str} | {ws_str} | {priority} |"
        )

    lines += [
        "",
        "## Что такое Whitespace",
        "",
        "Ключи из `keysso-whitespace-2026-05-03.csv` — у конкурентов есть, у нас нет.",
        "Это зоны роста: создаём страницу → перехватываем трафик.",
        "",
        "## Следующий шаг",
        "",
        "1. Открыть CSV с P0-кластерами — взять топ-20 ключей для H1/H2/FAQ новой страницы.",
        "2. `sa-seo` пишет спеку страницы по этим ключам.",
        "3. `cw` пишет текст.",
    ]

    summary_path = OUT_DIR / "_summary.md"
    summary_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"  Сводка → {summary_path.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main()
