#!/usr/bin/env python3
"""US-4 Wave 2 — собрать pool ключей из seed + sug_par + Keys.so для clustering.

Источники:
  - seosite/02-keywords/seed.txt (seed)
  - seosite/02-keywords/raw/justmagic-sugpar-*.csv (расширения подсказок)
  - seosite/02-keywords/raw/keysso-*.json (top organic у конкурентов)

Стратегия:
  Strong relevance: seed + sugpar (выходят из seed, релевантны нашим услугам).
  Weak relevance: keysso — фильтр по корням наших услуг
  (после анализа: cleaning-moscow и musor.moscow возвращают много info/garbage).

Выход:
  - pool.txt — кластеризационный pool (strong + filtered keysso)
  - pool-stats.json — статистика
  - pool-keysso-discarded.txt — отброшенные keysso для seo1 (анализ конкурентов)
"""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KW_DIR = ROOT / "02-keywords"
RAW_DIR = KW_DIR / "raw"

# === Black-list patterns (нерелевантные ниши, гео-шум, бытовое) ===
BLOCK_PATTERNS = [
    # инструменты «спил пилы», «пилой» как «нить»
    r"\bпилот\b|\bпилотн",
    # медицина / косметология
    r"\bзуб(а|ов|ы|ной|ное|ние)\b",
    r"\bволос(а|ы|ой|ом|ам)?\b",
    r"\bтату\b",
    r"\bбородав",
    r"\bпапиллом|\bпапилом",
    r"\bродин(к|ок|ка)\b",
    r"\bбров[ьией]",
    r"\bморщин",
    r"\bпигмент",
    r"\bжиров\sкомочк",
    r"\bцеллюлит",
    r"\bсосудов\sног",
    r"\bкист[аы]\b",
    r"\bаппендикс",
    r"\bгрыж",
    r"\bматк[аи]\b",
    r"\bяичник",
    r"\bгеморр",
    r"\bжелчн",
    r"\bпочк[аи]\sудал",
    # бытовая чистка / уборка квартиры (это не наша вертикаль)
    r"\bпригоревш",
    r"\bкастрюл",
    r"\bпароочистит",
    r"\bламинат",
    r"\bнагар",
    r"\bналет\sна\b",
    r"\bжелтизн",
    r"\bподошв[ауы]\sутюг",
    r"\bстиральн",
    r"\bпосудомоеч",
    r"\bунитаз",
    r"\bраковин",
    r"\bдушев(ая|ой)",
    r"\bчистка\sзубов\b",
    r"\bхимчистк",
    r"\bклининг(?!ова|овая)",  # сам термин «клининг» — вертикаль cleaning-moscow
    r"\bмойк[ауи]\sокон",
    r"\bгенеральная\sуборка",
    r"\bуборка\sкварт",
    r"\bдобавочный\sсчет",
    # IT / софт / онлайн
    r"\bcookies?\b",
    r"\bвордпресс|\bword\s?press\b",
    r"\bаккаунт",
    r"\bвирус[ыа]\b",
    r"\bпароль",
    r"\bвинд[оa]ус|\bwindows\b",
    r"\bпрограмм(а|у|ой|е|ы)\b",
    r"\bбраузер",
    r"\bкомпьютер",
    r"\bкартридж",
    r"\bпринтер",
    # садоводство / агро (любители)
    r"\bяблон",
    r"\bгруш[аи]",
    r"\bвишн",
    r"\bчерешн",
    r"\bперсик",
    r"\bабрикос",
    r"\bсмородин",
    r"\bкрыжовник",
    r"\bмалин",
    r"\bвиноград",
    r"\bколоновидн",
    r"\bопрыскив",
    r"\bудобрен",
    r"\bподкорм",
    r"\bкороед",
    r"\bжук[\sо]",
    r"\bвредител",
    r"\bопрыскав",
    r"\bлак\sбальзам",
    r"\bдерева\sдолгожител",
    r"\bотравить\sдерево",
    r"\bкора\sдерев",
    r"\bкорни\sдерев(?!\s.*спил)",
    # юр / норматива (info)
    r"\bкосгу\b|\bкэк\b|\bкэс\b",
    r"\bохран[ае]\sтруд",
    r"\b(тко|тбо|жбо|кго)\b\s+(это|расшифровка|что|в\sквит)",
    r"\b89\s?-?\sфз\b|\b89-фз\b",
    r"\bстать[яюе]\s\d+\sук\b",
    r"\bук\sрф\sстатья",
    r"\bгкрф\b",
    r"\bкоап\b",
    r"\bроссельхозн",
    r"\bросатом",
    r"\bсанпин",
    r"\bкадастр\sотход",
    r"\bотходы\sв\s(медицин|производст)",
    r"\bотходы\s\d\s+класс",
    r"\bкласс\sопасност",
    r"\bветошь\b",
    r"\bпромасленн",
    r"\bотбор\sпроб",
    # электроника / БУ-вещи
    r"\bтелевизор",
    r"\bхолодильник",
    r"\bстиральн[аеаои]\sмашин",
    r"\bмебель?\sстар",
    r"\bдиван\sстар",
    r"\bкомпресс",
    # развлечения / игры / культурные
    r"\bкино\b|\bфильм\b",
    r"\bсимс\b|\bsims\b",
    r"\b(майнкрафт|minecraft|роблокс|roblox|gta|дота|dota|варкрафт|warcraft)\b",
    r"\bdiablo|\bдиабло",
    r"\bсериал",
    r"\bаниме\b",
    r"\bкомикс",
    r"\bроман\b",
    # печатная продукция / документы общего рода
    r"\bдиплом",
    r"\bаттестат",
    r"\bпаспорт",
    r"\bвиза\b|\bвизы\b",
    r"\bштамп",
    r"\bкассац",
    r"\bдекор(?!ативн)",
    # бухгалтерия
    r"\bналог",
    r"\bбухгалтер",
    r"\bбух\.?\sучет",
    r"\bпервичн[ыо]\sдок",
    r"\bдекларац",
    r"\bжкх\sтариф",
    r"\bтариф\sна\sвывоз",
    r"\bкг\sв\sмесяц\sнорма",
    r"\bнорматив\sнакоплен",
    # инструменты как продажа
    r"\bбензопил",
    r"\bцепная\sпил",
    r"\bхускварн|\bштиль\b",
    # гео-шум: чужие регионы
    r"\b(санкт[\s-]?петербург|спб|ленинградск|ленобласт|ленобл)",
    r"\bкалинин(град|ск)",
    r"\bсаратов",
    r"\bижевск",
    r"\bастрахан",
    r"\bвологд",
    r"\bархангел",
    r"\bтюмен",
    r"\bпенз",
    r"\bсахалин",
    r"\bоренб",
    r"\bкраснодар",
    r"\bекатеринб",
    r"\bновосибирск",
    r"\bчелябинск",
    r"\bтвер[ьси]",
    r"\bтул(а|е|ы|у|ой|ьск)",
    r"\bкалуг",
    r"\bвладимир(?!ская)",
    r"\bрязан",
    r"\bниж(ний|нем)\sновгор",
    r"\bказа(нь|ни)",
    r"\bсамар[еаы]",
    r"\bволгоград",
    r"\bперм[ьи]",
    r"\bсочи\b",
    r"\bкрасноярск",
    r"\bбарнаул",
    r"\bомск",
    r"\bвороне[жз]",
    r"\bякут",
    r"\bхабар",
    r"\bвладивост",
    r"\bкоми\b|\bреспублик",
    r"\bбелорус",
    r"\bукраи",
    r"\bказахст",
    r"\bкырги",
    r"\bтаджик",
    r"\bузбек",
    # бытовое / домашнее (нерелевант)
    r"\bперепел",
    r"\bхомяков?\b",
    r"\bподелк",
    r"\bстолешниц",
    r"\bкупить\s(спил|пенек)\b",  # сувенир-спилы
    r"\bдля\sпоход",
    r"\bдля\sкостр",
    # event-словарь, не услуга
    r"\bновогодн(ий|яя|ие)",
    r"\bёлк[аи]\sкупить",
    r"\bбесплатно\b",  # часто info-запросы «вывоз бесплатно»; пилот без бесплатных услуг
]
BLOCK_RE = [re.compile(p, re.IGNORECASE) for p in BLOCK_PATTERNS]

# === Whitelist (наши корни — для фильтра «слабого» Keys.so-сигнала) ===
RELEVANCE_PATTERNS = [
    r"\bспил",
    r"\bудален",
    r"\bдемонта[жз]",
    r"\bснос",
    r"\bвырубк",
    r"\bвалк[аи]\b",
    r"\bкрон",
    r"\bобрезк[аи]\b",
    r"\bобреза(ть|ние|ния)",
    r"\bдерев(о|а|ьев|ом|ьями|у|е)\b",
    r"\bпн[еияй](?!\sсорт)",  # пень/пни (но не «пень-сорт»)
    r"\bкорчев",
    r"\bраскорчев",
    r"\bвет(в|ка|ки|вя|ок)",
    r"\bкустарник",
    r"\bпорубочн",
    r"\bпорубоч\sбилет|\bбилет(.*)поруб",
    r"\bпорубочн\sостат",
    r"\bкаблинг",
    r"\bальпинист",
    r"\bпромальп|\bпром\sальп",
    r"\bавтовышк",
    r"\bизмельч",
    r"\bдробл",
    r"\bкрыш",
    r"\bкровл",
    r"\bснег",
    r"\bналед",
    r"\bсосульк",
    r"\bчистк[аи]\sкрыш",
    r"\bочистк[аи]\sкрыш",
    r"\bсбивани[ея]\sсосул",
    r"\bмусор",
    r"\bхлам",
    r"\bстроймусор|\bстроительн.*мусор|\bмусор.*строит",
    r"\bконтейнер.*мусор|\bмусор.*контейнер",
    r"\bсамосвал",
    r"\bгазел",
    r"\bбригад",
    r"\bбытов(ой|ого|ому)\sмусор",
    r"\bпесок|\bщеб(ень|ня)",
    r"\bдач",
    r"\bбан[яи](?!\s+турк)",
    r"\bсарай",
    r"\bгараж",
    r"\bзабор",
    r"\bпостро[ие]к",
    r"\bпостро[её]н",
    r"\bдом(?:ик)?\b",  # «снос дома»
    r"\bкоттедж",
    r"\bхозблок",
    r"\bтеплиц",
    r"\bучаст(ок|ка|ке|ку)",
    r"\bраскорч",
    r"\bраскорчевк",
    r"\bрасчистк",
    r"\bвыравниван",
    r"\bпокос",
    r"\bтрав[ыау]\b",
    r"\bбурьян",
    r"\bпорос",
    r"\bук\b|\bтсж\b|\bжск\b",
    r"\bжкх\b",
    r"\bмкд\b",
    r"\bоати\b|\bгжи\b",
    r"\bштраф",
    r"\bобслуживан(ие|ия|ию)\s(терр|зда|двор|кот)",
    r"\bдоговор\sна\s(спил|вывоз|чистк|обслуж)",
    r"\bаренд[аы]\s(автовышки|измельчите|мини|самосвал)",
    r"\bобиход",
    r"\bпорядок\sпод\sключ",
    r"\bсмета\s(по\sфото|за\s10)",
    r"\bфото\s.*смет",
    r"\b4-?\s?в\s?-?\s?1",
    r"\bпорядок\sтерр",
    r"\bкомплексн.*обслужив",
    r"\bкомплексн.*подрядч",
]
REL_RE = [re.compile(p, re.IGNORECASE) for p in RELEVANCE_PATTERNS]


def is_blocked(kw: str) -> bool:
    for p in BLOCK_RE:
        if p.search(kw):
            return True
    return False


def is_relevant(kw: str) -> bool:
    for p in REL_RE:
        if p.search(kw):
            return True
    return False


def normalize(kw: str) -> str:
    kw = kw.strip().lower()
    kw = re.sub(r"\s+", " ", kw)
    kw = kw.replace("ё", "е")
    return kw


def load_seed() -> list[str]:
    return [
        ln.strip()
        for ln in (KW_DIR / "seed.txt").read_text().splitlines()
        if ln.strip() and not ln.strip().startswith("#")
    ]


def load_sugpar() -> list[str]:
    out = []
    for p in RAW_DIR.glob("justmagic-sugpar-*.csv"):
        if str(p).endswith(".gz"):
            continue
        with p.open(encoding="utf-8-sig") as f:
            reader = csv.reader(f, delimiter="\t")
            next(reader, None)  # header
            for row in reader:
                if len(row) >= 2:
                    out.append(row[1])
    return out


def load_keysso() -> list[tuple[str, str]]:
    out = []
    for p in RAW_DIR.glob("keysso-*.json"):
        try:
            j = json.loads(p.read_text())
        except Exception:
            continue
        domain = j.get("domain", p.stem)
        for kw_obj in j.get("keywords", []):
            kw = kw_obj.get("word") or kw_obj.get("keyword")
            if kw:
                out.append((kw, domain))
    return out


def main():
    seed = load_seed()
    sugpar = load_sugpar()
    keysso = load_keysso()

    pool: dict[str, dict] = {}
    blocked = 0
    keysso_kept = 0
    keysso_discarded: list[str] = []

    def add(kw: str, source: str, domain: str | None = None) -> None:
        nonlocal blocked
        n = normalize(kw)
        if not n or len(n) < 3 or len(n) > 90:
            return
        if is_blocked(n):
            blocked += 1
            return
        rec = pool.setdefault(n, {"sources": set(), "domains": set()})
        rec["sources"].add(source)
        if domain:
            rec["domains"].add(domain)

    # strong: seed
    for k in seed:
        add(k, "seed")
    # strong: sugpar
    for k in sugpar:
        add(k, "sugpar")

    # weak: keysso → ещё фильтр по релевантности
    for k, d in keysso:
        n = normalize(k)
        if not n or len(n) < 3 or len(n) > 90:
            continue
        if is_blocked(n):
            blocked += 1
            keysso_discarded.append(f"{n}\t{d}\tblocked")
            continue
        if not is_relevant(n):
            keysso_discarded.append(f"{n}\t{d}\tno_relevance")
            continue
        rec = pool.setdefault(n, {"sources": set(), "domains": set()})
        rec["sources"].add("keysso")
        rec["domains"].add(d)
        keysso_kept += 1

    by_source = {
        "seed": sum(1 for v in pool.values() if "seed" in v["sources"]),
        "sugpar": sum(1 for v in pool.values() if "sugpar" in v["sources"]),
        "keysso": sum(1 for v in pool.values() if "keysso" in v["sources"]),
    }

    pool_path = KW_DIR / "pool.txt"
    pool_path.write_text("\n".join(sorted(pool.keys())) + "\n")

    discarded_path = KW_DIR / "pool-keysso-discarded.txt"
    discarded_path.write_text("\n".join(keysso_discarded) + "\n")

    stats = {
        "total_unique_pool": len(pool),
        "by_source": by_source,
        "blocked_total": blocked,
        "keysso_input": len(keysso),
        "keysso_kept": keysso_kept,
        "keysso_discarded": len(keysso_discarded),
        "input_lines": {
            "seed": len(seed),
            "sugpar": len(sugpar),
            "keysso": len(keysso),
        },
    }
    (KW_DIR / "pool-stats.json").write_text(
        json.dumps(stats, ensure_ascii=False, indent=2)
    )
    print(json.dumps(stats, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
