#!/usr/bin/env python3
"""Keys.so multi-domain deep pull for EPIC-SEO-COMPETE-3 US-1.

Pulls domain_dashboard + organic/sitepages + organic/keywords for
liwood.ru / arborist.su / arboristik.ru (Yandex Moscow base).
"""
import json
import os
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "site" / ".env.local")

API_BASE = "https://api.keys.so/report/simple"
TOKEN = os.environ.get("KEYSO_API_KEY")
if not TOKEN:
    print("ERROR: KEYSO_API_KEY missing in site/.env.local", file=sys.stderr)
    sys.exit(2)

HEADERS = {"X-Keyso-TOKEN": TOKEN, "Accept": "application/json"}
DOMAINS = ["liwood.ru", "arborist.su", "arboristik.ru"]
BASE = "msk"
OUT_DIR = ROOT / "seosite" / "02-keywords" / "raw"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def request(endpoint, params, max_retries=10, sleep=15):
    qs = urllib.parse.urlencode(params)
    url = f"{API_BASE}/{endpoint}?{qs}"
    cmd = [
        "curl", "-sS", "--max-time", "60",
        "-H", f"X-Keyso-TOKEN: {TOKEN}",
        "-H", "Accept: application/json",
        url,
    ]
    for attempt in range(max_retries):
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
        if result.returncode != 0:
            print(f"    curl error rc={result.returncode}: {result.stderr[:200]}, retry")
            time.sleep(5)
            continue
        body = result.stdout
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            print(f"    non-JSON response: {body[:200]}, retry")
            time.sleep(5)
            continue
        if isinstance(data, dict) and data.get("code") == 202:
            print(f"    202 retry {attempt + 1}/{max_retries} sleep={sleep}s", flush=True)
            time.sleep(sleep)
            continue
        if isinstance(data, dict) and data.get("code") == 429:
            print(f"    429 rate-limit retry {attempt + 1}/{max_retries}", flush=True)
            time.sleep(30)
            continue
        if isinstance(data, dict) and data.get("code") == 400:
            raise RuntimeError(f"400 from {endpoint}: {data.get('message')}")
        return data
    raise TimeoutError(f"{endpoint} did not stabilize after {max_retries} retries")


def extract_items(payload):
    """Keys.so returns either {data: [...]} or [...] or {items: [...]}."""
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        for k in ("data", "items", "rows", "result"):
            if k in payload and isinstance(payload[k], list):
                return payload[k]
    return []


def paginate(endpoint, base_params, per_page, max_pages):
    """Keys.so pagination: `page` 1-based + `per_page`. Rate-limit 10 req / 10 sec."""
    collected = []
    last_page = None
    for page in range(1, max_pages + 1):
        params = {**base_params, "page": page, "per_page": per_page}
        chunk = request(endpoint, params)
        items = extract_items(chunk)
        if not items:
            break
        collected.extend(items)
        if isinstance(chunk, dict):
            last_page = chunk.get("last_page")
            if isinstance(last_page, int) and page >= last_page:
                break
        if len(items) < per_page:
            break
        time.sleep(1.1)  # throttle: 10 req / 10 sec
    return collected


def pull_domain(domain):
    print(f"\n=== {domain} ===")

    print("  [1/3] domain_dashboard")
    overview = request("domain_dashboard", {"base": BASE, "domain": domain})

    print("  [2/3] organic/sitepages")
    pages = paginate("organic/sitepages", {"base": BASE, "domain": domain},
                     per_page=50, max_pages=20)
    print(f"        → {len(pages)} pages")

    print("  [3/3] organic/keywords")
    keywords = paginate("organic/keywords", {"base": BASE, "domain": domain},
                        per_page=100, max_pages=120)
    print(f"        → {len(keywords)} keywords")

    snapshot = {
        "meta": {
            "domain": domain,
            "base": BASE,
            "date": "2026-05-06",
            "source": "Keys.so live API",
            "epic": "EPIC-SEO-COMPETE-3 US-1",
        },
        "overview": overview,
        "pages": pages,
        "keywords": keywords,
    }

    out_path = OUT_DIR / f"{domain.replace('.', '_')}.json"
    out_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2))
    size_kb = out_path.stat().st_size // 1024
    print(f"  saved → {out_path.relative_to(ROOT)} ({size_kb} KB)")
    return snapshot


if __name__ == "__main__":
    started = time.time()
    for d in DOMAINS:
        try:
            pull_domain(d)
        except Exception as e:
            print(f"  !! ERROR for {d}: {e}")
    elapsed = int(time.time() - started)
    print(f"\n=== DONE in {elapsed}s ===")
