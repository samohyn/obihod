#!/usr/bin/env python3
"""US-4 Wave 2 — Keys.so organic keywords export для топ-3 эталонов.

Берём liwood.ru, musor.moscow, cleaning-moscow.ru — те, чью IA копируем
(см. seosite/01-competitors/shortlist.md). Регион msk (Москва).
Stop-after — 10 страниц × 100 = 1000 ключей на домен (или раньше — на пустой
ответе). Лимит API: 10 запросов / 10 сек, держим 1.2 сек между запросами.
"""
from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT.parent / "site" / ".env.local"
RAW_DIR = ROOT / "02-keywords" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

API = "https://api.keys.so/report/simple/organic/keywords"
DOMAINS = ["liwood.ru", "musor.moscow", "cleaning-moscow.ru"]
PER_PAGE = 100
MAX_PAGES = 10
SLEEP = 1.2


def load_env() -> dict:
    env = {}
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def fetch_domain(token: str, domain: str) -> dict:
    headers = {"X-Keyso-TOKEN": token}
    all_keywords = []
    pages_meta = []
    for page in range(1, MAX_PAGES + 1):
        params = {
            "base": "msk",
            "domain": domain,
            "page": page,
            "per_page": PER_PAGE,
            "sort": "wsk|desc",
        }
        r = requests.get(API, params=params, headers=headers, timeout=60)
        try:
            j = r.json()
        except json.JSONDecodeError:
            j = {"_raw": r.text[:500], "_status": r.status_code}
        pages_meta.append({"page": page, "status": r.status_code, "size": len(r.content)})
        if r.status_code == 202:
            print(f"[{domain}] page {page} 202 ({j.get('message','prep')}), retry in 30s")
            time.sleep(30)
            r = requests.get(API, params=params, headers=headers, timeout=60)
            try:
                j = r.json()
            except json.JSONDecodeError:
                j = {"_raw": r.text[:500], "_status": r.status_code}
            pages_meta[-1] = {"page": page, "status": r.status_code, "size": len(r.content), "retried": True}
        if r.status_code != 200:
            print(f"[{domain}] page {page} status={r.status_code} body={r.text[:200]}")
            break
        # Структура ответа Keys.so: { "data": [...], "total": N, "last_page": N }
        items = j.get("data") if isinstance(j.get("data"), list) else []
        total = j.get("total")
        last_page = j.get("last_page")
        print(
            f"[{domain}] page {page}/{last_page}: {len(items)} items (total={total})"
        )
        if not items:
            break
        all_keywords.extend(items)
        if len(items) < PER_PAGE:
            break
        time.sleep(SLEEP)
    return {"domain": domain, "keywords": all_keywords, "pages_meta": pages_meta}


def main():
    env = load_env()
    token = env["KEYSO_API_KEY"]
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    summary = {}
    for d in DOMAINS:
        result = fetch_domain(token, d)
        out = RAW_DIR / f"keysso-{d.replace('.', '_')}-{ts}.json"
        out.write_text(json.dumps(result, ensure_ascii=False, indent=2))
        summary[d] = len(result["keywords"])
        print(f"[saved] {out} (kw={summary[d]})")
        time.sleep(SLEEP)
    print(f"[summary] {summary}")


if __name__ == "__main__":
    main()
