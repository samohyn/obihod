#!/usr/bin/env python3
"""US-4 Wave 2 — merge JM wsfreq csv → patch raw cluster csv с актуальными частотами.

Входы:
  - seosite/02-keywords/raw/justmagic-wsfreq-*.csv (gzip-csv,
    cols: ключ, частот. WordStat, "частот. WordStat", "!частот. !WordStat")
  - seosite/03-clusters/raw-justmagic-localFALLBACK-*.csv (наш fallback)
  - seosite/03-clusters/raw-justmagic-test50-*.csv (50 ключей с реальными частотами)

Логика:
  1. собираем все wsfreq → словарь kw → freq_std/freq_q/freq_qv
  2. читаем localFALLBACK csv и патчим колонки частот для тех kw, что есть в wsfreq
  3. сохраняем как новый fallback csv (с тем же форматом что JM grp_onl)

После этого normalize_and_split.py заберёт обновлённые частоты.
"""
from __future__ import annotations

import csv
import gzip
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_KW = ROOT / "02-keywords" / "raw"
RAW_CL = ROOT / "03-clusters"


def normalize(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower().replace("ё", "е"))


def read_wsfreq(path: Path) -> dict[str, dict]:
    raw = path.read_bytes()
    if raw[:2] == b"\x1f\x8b":
        text = gzip.decompress(raw).decode("utf-8-sig", errors="replace")
    else:
        text = raw.decode("utf-8-sig", errors="replace")
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if not lines:
        return {}
    header = lines[0].split("\t")
    out: dict[str, dict] = {}
    for ln in lines[1:]:
        cols = ln.split("\t")
        if len(cols) < len(header):
            cols += [""] * (len(header) - len(cols))
        d = dict(zip(header, cols))
        kw_col = next((h for h in header if h.lower() in ("ключ", "key", "запрос")), header[0])
        kw = normalize(d.get(kw_col, ""))
        if not kw:
            continue
        out[kw] = {
            "freq_std": d.get("частот. WordStat", "0") or "0",
            "freq_q": d.get('"частот. WordStat"', "0") or "0",
            "freq_qv": d.get('"!частот. !WordStat"', "0") or "0",
        }
    return out


def main():
    # 1) собираем все wsfreq
    wsfreq_map: dict[str, dict] = {}
    for p in sorted(RAW_KW.glob("justmagic-wsfreq-*.csv")):
        m = read_wsfreq(p)
        wsfreq_map.update(m)
        print(f"[wsfreq] {p.name}: +{len(m)} keys (total in map: {len(wsfreq_map)})")
    print(f"[wsfreq] total {len(wsfreq_map)} kw with frequencies")

    # 2) находим самый свежий localFALLBACK и патчим
    fallbacks = sorted(RAW_CL.glob("raw-justmagic-localFALLBACK-*.csv"))
    if not fallbacks:
        print("[FATAL] no localFALLBACK csv to patch")
        return
    src = fallbacks[-1]
    text = src.read_text(encoding="utf-8-sig")
    lines = [ln for ln in text.splitlines() if ln.strip()]
    header = lines[0].split("\t")
    print(f"[fallback] {src.name} header={header}")

    out_lines = [lines[0]]
    patched = 0
    for ln in lines[1:]:
        cols = ln.split("\t")
        if len(cols) < len(header):
            cols += [""] * (len(header) - len(cols))
        kw = normalize(cols[0])
        if kw in wsfreq_map:
            f = wsfreq_map[kw]
            cols[5] = f["freq_std"]  # «частот. WordStat»
            cols[6] = f["freq_q"]
            cols[7] = f["freq_qv"]
            patched += 1
        out_lines.append("\t".join(cols))

    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out = RAW_CL / f"raw-justmagic-localFALLBACK-WITHFREQ-{ts}.csv"
    out.write_text("\n".join(out_lines) + "\n")
    print(f"[saved] {out} (patched {patched}/{len(lines) - 1} keys)")

    # 3) удаляем старые localFALLBACK без freq, чтобы normalize не путался
    for p in fallbacks:
        if p != out and "WITHFREQ" not in p.name:
            p.unlink()
            print(f"[removed] old fallback {p.name}")


if __name__ == "__main__":
    main()
