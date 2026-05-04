#!/usr/bin/env python3
"""EPIC-SEO-OUTRANK Phase A — Keys.so multi-domain pull для intersect анализа.

Расширение keysso_export.py W2 (3 эталона) → 33 services-конкурента + obikhod
probe для master-union анализа. Делит домены на TOP-1000 (28) и TOP-2000 (5
толстых: musor / kronotech / cleaning / stroj-musor / umisky).

Auth: site/.env.local:KEYSO_API_KEY
Rate-limit: 10 req/10 sec → sleep 1.2 sec между.
Output: seosite/02-keywords/raw/keysso-{domain}-2026-05-03.json × 33
        + keysso-pull-manifest-2026-05-03.json
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
PER_PAGE = 250
SLEEP = 1.2
TIMESTAMP_TAG = "2026-05-03"

DOMAINS_TOP2000 = [
    "musor.moscow",
    "kronotech.ru",
    "cleaning-moscow.ru",
    "stroj-musor.moscow",
    "umisky.ru",
]

DOMAINS_TOP1000 = [
    "liwood.ru",
    "promtehalp.ru",
    "lesoruby.ru",
    "alpme.ru",
    "arboristik.ru",
    "arborist.su",
    "forest-service.ru",
    "tvoi-sad.com",
    "spilservis.ru",
    "lesovod.su",
    "virubka-dereva.ru",
    "demontazhmsk.ru",
    "fasadrf.ru",
    "alpbond.org",
    "promalper.ru",
    "udalenie-dereviev.moscow",
    "lesoruby.com",
    "arbogarden.ru",
    "drovosek-mo.ru",
    "rusarbo.ru",
    "treeworkers.ru",
    "formula-v.ru",
    "moscleaning24.ru",
    "mmusor.ru",
    "gsvm.ru",
    "snosim.com",
    "snos24.ru",
    "demonti.ru",
]

PROBE_OUR = "obikhod.ru"


def load_env() -> dict:
    env: dict[str, str] = {}
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def fetch_domain(token: str, domain: str, max_pages: int) -> dict:
    headers = {"X-Keyso-TOKEN": token}
    all_keywords: list = []
    pages_meta: list = []
    last_status = "ok"
    for page in range(1, max_pages + 1):
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
        meta = {"page": page, "status": r.status_code, "size": len(r.content)}

        # Adaptive backoff на 202: 30s → 60s → 120s
        if r.status_code == 202:
            for backoff in (30, 60, 120):
                print(f"[{domain}] page {page} 202, retry in {backoff}s")
                time.sleep(backoff)
                r = requests.get(API, params=params, headers=headers, timeout=60)
                try:
                    j = r.json()
                except json.JSONDecodeError:
                    j = {"_raw": r.text[:500], "_status": r.status_code}
                meta["retried_after"] = backoff
                meta["status"] = r.status_code
                if r.status_code != 202:
                    break

        pages_meta.append(meta)

        if r.status_code == 404:
            last_status = "not_in_base"
            print(f"[{domain}] page {page} 404 — domain not in Keys.so base")
            break
        if r.status_code != 200:
            last_status = f"http_{r.status_code}"
            print(f"[{domain}] page {page} status={r.status_code} body={r.text[:200]}")
            break

        items = j.get("data") if isinstance(j.get("data"), list) else []
        total = j.get("total")
        last_page = j.get("last_page")
        print(
            f"[{domain}] page {page}/{last_page}: {len(items)} items (total={total})"
        )
        if not items:
            if page == 1:
                last_status = "empty"
            break
        all_keywords.extend(items)
        if len(items) < PER_PAGE:
            break
        time.sleep(SLEEP)
    return {
        "domain": domain,
        "max_pages": max_pages,
        "keywords": all_keywords,
        "pages_meta": pages_meta,
        "status": last_status,
    }


def main():
    env = load_env()
    token = env["KEYSO_API_KEY"]
    started = datetime.now(timezone.utc)

    manifest: dict = {
        "tag": TIMESTAMP_TAG,
        "started_utc": started.isoformat(),
        "totals": {
            "domains_attempted": 0,
            "ok": 0,
            "empty": 0,
            "not_in_base": 0,
            "other_error": 0,
            "keywords_total": 0,
        },
        "domains": [],
    }

    plan = (
        [(d, 8) for d in DOMAINS_TOP2000]
        + [(d, 4) for d in DOMAINS_TOP1000]
        + [(PROBE_OUR, 4)]  # obikhod probe
    )
    print(f"[plan] {len(plan)} domains; top2000={len(DOMAINS_TOP2000)} top1000={len(DOMAINS_TOP1000)} +probe")

    for domain, max_pages in plan:
        manifest["totals"]["domains_attempted"] += 1
        result = fetch_domain(token, domain, max_pages)
        out = RAW_DIR / f"keysso-{domain.replace('.', '_')}-{TIMESTAMP_TAG}.json"
        out.write_text(json.dumps(result, ensure_ascii=False, indent=2))
        kw_count = len(result["keywords"])
        manifest["totals"]["keywords_total"] += kw_count
        status = result["status"]
        if status == "ok" and kw_count > 0:
            manifest["totals"]["ok"] += 1
        elif status == "empty" or kw_count == 0:
            manifest["totals"]["empty"] += 1
            status = "empty"
        elif status == "not_in_base":
            manifest["totals"]["not_in_base"] += 1
        else:
            manifest["totals"]["other_error"] += 1
        manifest["domains"].append(
            {
                "domain": domain,
                "max_pages_planned": max_pages,
                "kw_count": kw_count,
                "status": status,
                "file": out.name,
            }
        )
        print(f"[saved] {out.name} kw={kw_count} status={status}")
        time.sleep(SLEEP)

    manifest["finished_utc"] = datetime.now(timezone.utc).isoformat()
    manifest_path = RAW_DIR / f"keysso-pull-manifest-{TIMESTAMP_TAG}.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    print()
    print(f"[manifest] {manifest_path}")
    print(f"[summary] {manifest['totals']}")


if __name__ == "__main__":
    main()
