#!/usr/bin/env python3
"""US-4 Wave 2 — fallback локальная кластеризация если Just-Magic недоступен.

Морфо-кластеризация:
  1) для каждого ключа — извлекаем «канонический корень» (стемминг + ключевое слово,
     отбрасываем стоп-слова и города);
  2) ключи с одинаковым корнем → один кластер;
  3) частоты — из 50-kw test (для точности там, где есть) + 1 для остальных
     (помечаем noFreq=true).

Этот вариант **хуже** JM-кластеризации (нет TOP-10 SERP сигнала), но даёт
структуру для cw + seo1, пока JM в downtime. seo1 заменит на JM-вариант
после восстановления.

Эмулирует тот же CSV-формат что JM (key, grp1..grp4, частот. WordStat,
"частот. WordStat", "!частот. !WordStat", mord, tema), чтобы дальше работал
normalize_and_split.py без изменений.
"""
from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POOL = ROOT / "02-keywords" / "pool.txt"
RAW = ROOT / "03-clusters" / "raw-justmagic-test50-1505300.csv"
OUT_DIR = ROOT / "03-clusters"

# === Стоп-слова, не образующие корень ===
STOPWORDS = set(
    """
    в во на и или с со к под над от из для по у о об то ли же бы как
    что чем тоже тож а но если когда где куда чего того этого этому это
    эта той этой та они они их они их его её ее наш ваш мой твой
    цена цены ценой стоимость стоимости сколько стоит дешево недорого
    купить заказать заказ вызвать вызов оплатить оплата
    москва мо московская московский московская область подмосковье
    одинцово красногорск мытищи химки истра пушкино раменское жуковский
    домодедово подольск королёв королев балашиха ленинградская спб
    участке участка участок участки даче даче-лет дома дом
    км метров метр кв квадратный кубометр куба кубов
    м3 м² м м2
    жк дома гсв смета расценка
    """.split()
)

# === Корневые приоритеты для канона кластера (по релевантности нашему бизнесу) ===
ROOT_PRIORITY = [
    # Чем выше — тем значимее как корень кластера
    (re.compile(r"\bпорубочн|\bпорубочный\sбилет"), "porubochnyj_bilet"),
    (re.compile(r"\bкронирован|\bкронир|\bкрону"), "kronirovanie"),
    (re.compile(r"\bкаблинг"), "kabling"),
    (re.compile(r"\bпром\s?альп|\bпромышленн.*альпин|\bпромальп"), "promalpinizm"),
    (re.compile(r"\bальпинист"), "alpinist"),
    (re.compile(r"\bавтовышк"), "avtovyshka"),
    (re.compile(r"\bизмельчит|\bдробл"), "izmelchitel"),
    (re.compile(r"\bминитрактор|\bмини[\s-]?трактор"), "minitraktor"),
    (re.compile(r"\bсамосвал"), "samosval"),
    (re.compile(r"\bсосульк|\bналед"), "sosulki_naled"),
    (re.compile(r"\bснег"), "sneg"),
    (re.compile(r"\bочистка\sкровл|\bчистка\sкровл"), "kovrlya"),
    (re.compile(r"\bочистка\sкрыш|\bчистка\sкрыш"), "krysha"),
    (re.compile(r"\bкрыш"), "krysha_general"),
    (re.compile(r"\bштраф\sгжи|\bгжи\sштраф"), "shtraf_gzhi"),
    (re.compile(r"\bштраф\sоати|\bоати"), "shtraf_oati"),
    (re.compile(r"\bдоговор\sтсж|\bтсж\sдоговор"), "dogovor_tszh"),
    (re.compile(r"\bдоговор\sук|\bук\sдоговор"), "dogovor_uk"),
    (re.compile(r"\bтсж|\bжск|\bжэк"), "tszh"),
    (re.compile(r"\bук\b"), "uk"),
    (re.compile(r"\bмкд"), "mkd"),
    (re.compile(r"\bобслуживан.*коттедж|\bкоттеджн.*пос"), "kottedzhny_poselok"),
    (re.compile(r"\bобслуживан.*здан"), "obsluzhivanie_zdaniy"),
    (re.compile(r"\bкомплексн.*обслужив"), "kompleksnoe_obsluzhivanie"),
    (re.compile(r"\bкомплексн.*подрядч"), "kompleksnyj_podryadchik"),
    (re.compile(r"\bаутсорсин"), "autsorsing"),
    (re.compile(r"\bтехническое\sобслужив"), "tehobsluzhivanie"),
    (re.compile(r"\bдемонтаж\sдач|\bснос\sдач"), "demontazh_dachi"),
    (re.compile(r"\bдемонтаж\sбан|\bснос\sбан"), "demontazh_bani"),
    (re.compile(r"\bдемонтаж\sсар|\bснос\sсар"), "demontazh_saraya"),
    (re.compile(r"\bдемонтаж\sгараж|\bснос\sгараж"), "demontazh_garazha"),
    (re.compile(r"\bдемонтаж\sзабор|\bснос\sзабор"), "demontazh_zabora"),
    (re.compile(r"\bдемонтаж\sдом|\bснос\sдом"), "demontazh_doma"),
    (re.compile(r"\bдемонтаж|\bснос"), "demontazh_general"),
    (re.compile(r"\bудален.*пн|\bдробл.*пн|\bкорчев.*пн|\bкорчев|\bпн[еияй]"), "pen"),
    (re.compile(r"\bраскорч"), "raskorchevka"),
    (re.compile(r"\bрасчист"), "raschistka"),
    (re.compile(r"\bвыравниван"), "vyravnivanie"),
    (re.compile(r"\bпокос"), "pokos"),
    (re.compile(r"\bбурьян"), "buryan"),
    (re.compile(r"\bвырубк[аи]?\sелок|\bёлок|\bелок\sсрубить"), "vyrubka_elok"),
    (re.compile(r"\bвалк[аи]"), "valka"),
    (re.compile(r"\bвырубк"), "vyrubka_obshchaya"),
    (re.compile(r"\bаварий"), "avarijnyj_spil"),
    (re.compile(r"\bудален.*дерев"), "udalenie_dereva"),
    (re.compile(r"\bспил.*автовышк|\bавтовышк.*спил"), "spil_s_avtovyshki"),
    (re.compile(r"\bспил.*альпин|\bальпин.*спил"), "spil_alpinistami"),
    (re.compile(r"\bспил.*частям"), "spil_chastyami"),
    (re.compile(r"\bспил.*участк|\bна\sсвоем\sучаст"), "spil_uchastok"),
    (re.compile(r"\bспил|\bпилить\sдерев|\bвалить\sдерев"), "spil_derevev"),
    (re.compile(r"\bобрезк[аи]?\sсадов|\bсадов.*обрезк"), "obrezka_sadovoe"),
    (re.compile(r"\bсанитарн.*обрезк|\bобрезк.*санитар"), "sanitarnaya_obrezka"),
    (re.compile(r"\bомолаж.*обрезк|\bомолаживающ"), "omolazhivayushchaya_obrezka"),
    (re.compile(r"\bдекоративн.*обрезк|\bдекоратив.*обрезк|\bформирующ.*обрезк"), "dekorativnaya_obrezka"),
    (re.compile(r"\bобрезк"), "obrezka"),
    (re.compile(r"\bвет(ок|ки|вя)|\bпорубочн.*остат"), "vetki_porubochnye"),
    (re.compile(r"\bдерев"), "derevo"),
    (re.compile(r"\bстройм|\bстро\s?мусор"), "stroymusor"),
    (re.compile(r"\bсадов.*мусор|\bмусор.*сад"), "sadovyj_musor"),
    (re.compile(r"\bконтейнер.*мусор|\bмусор.*контейнер"), "musor_kontejner"),
    (re.compile(r"\bкгм|\bкрупно[\s-]?габарит"), "kgm"),
    (re.compile(r"\bхлам"), "hlam"),
    (re.compile(r"\bгазел"), "gazel"),
    (re.compile(r"\bвывоз\s?мусор|\bмусор\s?вывоз"), "vyvoz_musora"),
    (re.compile(r"\bбытов(ой|ого|ому)\sмусор"), "bytovoj_musor"),
    (re.compile(r"\bпеня\b|\bштраф"), "shtraf_general"),
    (re.compile(r"\bкуст(арник)?"), "kustarniki"),
    (re.compile(r"\bпорос(л|ль|ли|лей)"), "porosl"),
    (re.compile(r"\bтрав[аыу]"), "trava"),
    (re.compile(r"\bобиход"), "brand_obihod"),
]


def detect_root(kw: str) -> str:
    """Возвращает «корень» (cluster-id) для key.

    Для лучшей кластеризации — комбо из 1-2 топ-маркеров.
    Если сработал ROOT_PRIORITY — берём first match. Если нет — собираем
    по 2 значащих токенам (первые 6 букв) для обеспечения мелких кластеров
    вместо одного «misc:дерев» гиганта.
    """
    matched = [root for rx, root in ROOT_PRIORITY if rx.search(kw)]
    if matched:
        return matched[0]
    tokens = re.findall(r"[а-яё]+", kw)
    tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 3]
    if not tokens:
        return "misc:unknown"
    # 2 самых длинных корня → объединение
    sorted_tokens = sorted(tokens, key=len, reverse=True)
    if len(sorted_tokens) >= 2:
        return f"misc:{sorted_tokens[0][:5]}+{sorted_tokens[1][:5]}"
    return f"misc:{sorted_tokens[0][:6]}"


def load_test_freqs() -> dict[str, dict]:
    """Из тестового JM-csv (50 ключей, gzip) берём частоты — там, где есть."""
    import gzip

    out: dict[str, dict] = {}
    if not RAW.exists():
        return out
    raw = RAW.read_bytes()
    if raw[:2] == b"\x1f\x8b":
        text = gzip.decompress(raw).decode("utf-8-sig", errors="replace")
    else:
        text = raw.decode("utf-8-sig", errors="replace")
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if not lines:
        return out
    header = lines[0].split("\t")
    for ln in lines[1:]:
        cols = ln.split("\t")
        if len(cols) < len(header):
            cols += [""] * (len(header) - len(cols))
        row = dict(zip(header, cols))
        kw = row["key"].lower().replace("ё", "е")
        kw = re.sub(r"\s+", " ", kw).strip()
        out[kw] = row
    return out


def main():
    keywords = [k.strip() for k in POOL.read_text().splitlines() if k.strip()]
    print(f"[pool] {len(keywords)}")
    test_freqs = load_test_freqs()
    print(f"[test_freqs] {len(test_freqs)} keys with freq from JM 50-test")

    # Группируем по корню
    by_root = defaultdict(list)
    for kw in keywords:
        root = detect_root(kw)
        by_root[root].append(kw)

    print(f"[clusters] {len(by_root)} unique roots")

    # Эмулируем JM-csv, чтобы normalize_and_split можно было запустить
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out = OUT_DIR / f"raw-justmagic-localFALLBACK-{ts}.csv"
    with out.open("w", encoding="utf-8") as f:
        # Заголовок ровно как у JM
        f.write(
            "key\tgrp1\tgrp2\tgrp3\tgrp4\t"
            "частот. WordStat\t\"частот. WordStat\"\t\"!частот. !WordStat\"\t"
            "mord\ttema\n"
        )
        cluster_idx = 0
        for root, members in sorted(by_root.items(), key=lambda kv: -len(kv[1])):
            cluster_idx += 1
            for kw in members:
                fr = test_freqs.get(kw, {})
                freq_std = fr.get("частот. WordStat", "0") or "0"
                freq_q = fr.get('"частот. WordStat"', "0") or "0"
                freq_qv = fr.get('"!частот. !WordStat"', "0") or "0"
                mord = fr.get("mord", "0") or "0"
                tema = fr.get("tema", "")
                f.write(
                    f"{kw}\t{cluster_idx}\t{cluster_idx}\t{cluster_idx}\t{cluster_idx}\t"
                    f"{freq_std}\t{freq_q}\t{freq_qv}\t{mord}\t{tema}\n"
                )
    print(f"[saved] {out}")
    print(f"[summary] roots={len(by_root)} keys={len(keywords)} with-freq={len(test_freqs)}")


if __name__ == "__main__":
    main()
