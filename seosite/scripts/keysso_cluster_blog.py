"""
keysso_cluster_blog.py

Фильтрует информационные / уточняющие ключи из master-union,
группирует по темам для блога, сохраняет blog-semantic-clusters.md.

Вход:  seosite/02-keywords/derived/keysso-master-union-2026-05-03.csv
Выход: seosite/05-content-plan/blog-semantic-clusters.md

Магазин / питомник — вне скопа.
"""

import csv
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DERIVED = ROOT / "02-keywords" / "derived"
OUT_FILE = ROOT / "05-content-plan" / "blog-semantic-clusters.md"

MASTER_CSV = DERIVED / "keysso-master-union-2026-05-03.csv"

INFO_INTENTS = {"информационный", "уточняющий", "clarifying", "информационный+локальный"}

# Темы блога: (slug, label, include_patterns, exclude_patterns)
BLOG_TAXONOMY = [
    # АРБОРИСТИКА — законы и документы
    ("blog-zakon-spil", "Законодательство: спил и вырубка деревьев", [
        r"можно ли спилить|можно ли вырубить|разрешение на спил|разрешение на вырубку|"
        r"закон о вырубке|штраф за спил|штраф за вырубку|незаконная вырубка|"
        r"ст 260|статья 260|ответственность за вырубку|ответственность за спил|"
        r"порубочный билет что это|порубочный билет как получить",
    ], []),

    ("blog-obrezka-info", "Обрезка деревьев: когда и как", [
        r"когда обрезать|как обрезать|обрезка яблони|обрезка груши|обрезка сливы|"
        r"обрезка вишни|обрезка абрикоса|обрезка черешни|обрезка персика|"
        r"обрезка плодовых деревьев|обрезка хвойных|обрезка весной|обрезка осенью|"
        r"виды обрезки|санитарная обрезка что такое",
    ], [r"цена|стоимость|заказать|нанять"]),

    ("blog-bolezni-derevev", "Болезни и вредители деревьев", [
        r"короед|жук короед|лечение деревьев|болезнь дерева|болезни деревьев|"
        r"смоляной рак|сухобочина|дупло в дереве|омела на деревьях|"
        r"защита дерева от болезней|как лечить дерево|фитопатология|"
        r"вредители деревьев|опрыскивание от болезней",
    ], [r"цена|стоимость|заказать"]),

    ("blog-spil-info", "Спил деревьев: когда нужен, как выбрать подрядчика", [
        r"почему спиливают|зачем спиливают|аварийное дерево признаки|"
        r"как определить аварийное дерево|сухостой|когда надо спилить|"
        r"как выбрать компанию|как выбрать подрядчика спил|"
        r"кронирование что это такое|кронирование деревьев зачем",
    ], [r"цена|стоимость|заказать"]),

    ("blog-pni-info", "Пни: удаление и методы", [
        r"удаление пня своими руками|пень как убрать|корчевание пня как|"
        r"дробление пня|фрезерование пня|химическое удаление пня|"
        r"селитра для удаления пня|чем вывести пень",
    ], [r"цена|стоимость|заказать"]),

    # УБОРКА УЧАСТКА
    ("blog-uchastok-osen-vesna", "Уборка участка: сезонные работы", [
        r"уборка участка весной|уборка участка осенью|осенние работы на участке|"
        r"весенние работы на участке|подготовка участка к зиме|"
        r"уборка дачи осенью|уборка дачи весной|что делать на участке",
    ], [r"цена|стоимость|заказать"]),

    ("blog-gazon-info", "Газон: посев, уход, стрижка", [
        r"как посеять газон|газон своими руками|рулонный газон|посевной газон|"
        r"когда стричь газон|как часто стричь газон|уход за газоном|"
        r"газон из семян|газон или рулонный|высота скашивания газона",
    ], [r"цена|стоимость|заказать"]),

    ("blog-raschistka-info", "Расчистка участка: что нужно знать", [
        r"расчистка участка своими руками|как расчистить участок|"
        r"расчистка от зарослей|как убрать кустарник|как убрать деревья с участка|"
        r"подготовка участка к строительству как",
    ], [r"цена|стоимость|заказать"]),

    # СНЕГ / КРЫШИ
    ("blog-sneg-krovlya", "Снег на крыше: опасность, нормы, уборка", [
        r"снег на крыше опасность|нагрузка снега на крышу|норма снега на крыше|"
        r"сколько снега выдержит крыша|наледь на крыше|сосульки на крыше|"
        r"чем опасен снег на крыше|когда убирать снег с крыши",
    ], [r"цена|стоимость|заказать"]),

    # ДЕМОНТАЖ
    ("blog-demontazh-info", "Демонтаж строений: этапы, документы, выбор", [
        r"как снести дом|этапы сноса|снос дома своими руками|документы для сноса|"
        r"разрешение на снос|снос или реконструкция|старый дом снести|"
        r"баня снос|демонтаж своими руками|как разобрать баню",
    ], [r"цена|стоимость|заказать"]),

    # ВЫВОЗ МУСОРА
    ("blog-musor-info", "Вывоз мусора: нормы, виды, правила", [
        r"нормы вывоза мусора|правила вывоза мусора|штраф за мусор|"
        r"куда деть мусор|утилизация мусора|виды мусора|кгм что такое|"
        r"крупногабаритный мусор что это|строительный мусор нормы|"
        r"вывоз мусора по закону|тко что такое|твердые коммунальные отходы",
    ], [r"цена|стоимость|заказать"]),

    # СЕЗОННЫЕ СОВЕТЫ
    ("blog-sezon-zima", "Зимние работы на участке", [
        r"что делать на участке зимой|зимние работы на даче|"
        r"уход за деревьями зимой|защита деревьев зимой|побелка деревьев зимой|"
        r"утепление деревьев на зиму",
    ], []),

    ("blog-sezon-vesna", "Весенние работы: уход за садом", [
        r"что делать в саду весной|весенний уход за садом|"
        r"подкормка деревьев весной|весенняя обработка сада|"
        r"прививка деревьев весной|когда прививать деревья",
    ], []),
]


def compile_pattern(patterns: list[str]) -> re.Pattern:
    return re.compile("|".join(patterns), re.IGNORECASE | re.UNICODE)


def build_taxonomy():
    compiled = []
    for slug, label, include_pats, exclude_pats in BLOG_TAXONOMY:
        inc = compile_pattern(include_pats)
        exc = compile_pattern(exclude_pats) if exclude_pats else None
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


def main():
    taxonomy = build_taxonomy()
    slug_to_label = {s: l for s, l, *_ in BLOG_TAXONOMY}

    print("Загружаю master-union...")
    rows = []
    with open(MASTER_CSV, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    print(f"  Всего строк: {len(rows)}")

    info_rows = [
        r for r in rows
        if r.get("intent_marker", "").strip() in INFO_INTENTS
    ]
    print(f"  Информационных ключей: {len(info_rows)}")

    clusters: dict[str, list[dict]] = defaultdict(list)

    for row in info_rows:
        kw = row.get("keyword", "").strip()
        hits = classify(kw, taxonomy)
        for slug in hits:
            clusters[slug].append(row)

    total_classified = sum(len(v) for v in clusters.values())
    print(f"  Классифицировано: {total_classified}")

    # Генерируем markdown
    lines = [
        "# Семантика для блога (информационные кластеры)",
        "",
        f"_Источник: master-union 2026-05-03, информационный/уточняющий intent. "
        f"Всего информационных: {len(info_rows):,}. Классифицировано: {total_classified:,}._",
        "",
        "> **Магазин / питомник** — отдельно, в этот документ не входит.",
        "",
    ]

    for slug, label in [(s, l) for s, l, *_ in BLOG_TAXONOMY]:
        topic_rows = clusters.get(slug, [])
        topic_rows_sorted = sorted(
            topic_rows,
            key=lambda r: int(r.get("wsk", 0) or 0),
            reverse=True
        )
        wsk_sum = sum(int(r.get("wsk", 0) or 0) for r in topic_rows_sorted)
        top10 = topic_rows_sorted[:10]

        lines += [
            f"## {label}",
            "",
            f"**Ключей:** {len(topic_rows_sorted)} · **Суммарный wsk:** {wsk_sum:,}",
            "",
        ]

        if not top10:
            lines += ["_Ключи не найдены._", ""]
            continue

        # Рекомендация формата
        if wsk_sum >= 5000:
            fmt = "Подробный гайд (1500–2000 слов) + FAQ"
        elif wsk_sum >= 1000:
            fmt = "Статья-ответ (800–1200 слов) + FAQ"
        else:
            fmt = "Короткая статья или FAQ-блок (500–800 слов)"

        lines += [
            f"**Формат:** {fmt}",
            "",
            "| Ключ | wsk | Тир |",
            "|---|---:|---|",
        ]
        for r in top10:
            kw = r.get("keyword", "")
            wsk = r.get("wsk", "—")
            tier = r.get("tier_freq", "—")
            lines.append(f"| {kw} | {wsk} | {tier} |")

        lines.append("")

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nГотово → {OUT_FILE.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main()
