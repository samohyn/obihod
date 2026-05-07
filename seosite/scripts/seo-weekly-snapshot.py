#!/usr/bin/env python3
"""SEO weekly snapshot — Keys.so live data для 4 доменов.

EPIC-SEO-COMPETE-3 US-10. Replicable monitoring цикл:
- naш домен (obikhod.ru) — отслеживаем рост с 0
- liwood.ru / arborist.su / arboristik.ru — отслеживаем 3 конкурентов

Сохраняет:
- `seosite/04-monitoring/<YYYY-MM-DD>/<domain>.json` (raw Keys.so dashboard)
- `seosite/04-monitoring/<YYYY-MM-DD>/summary.csv` (4 строки × 6 колонок)

Использование:
  python3 seosite/scripts/seo-weekly-snapshot.py
  KEYSO_API_KEY=<override> python3 seosite/scripts/seo-weekly-snapshot.py

Для cron-автоматизации:
  weekly Mon 9:00 MSK = `0 6 * * 1` UTC
"""
import csv
import json
import os
import subprocess
import sys
import time
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "site" / ".env.local")

API_BASE = "https://api.keys.so/report/simple"
TOKEN = os.environ.get("KEYSO_API_KEY")
if not TOKEN:
    print("ERROR: KEYSO_API_KEY missing in site/.env.local", file=sys.stderr)
    sys.exit(2)

DOMAINS = ["obikhod.ru", "liwood.ru", "arborist.su", "arboristik.ru"]
BASE = "msk"
DATE = datetime.now(timezone.utc).strftime("%Y-%m-%d")
OUT_DIR = ROOT / "seosite" / "04-monitoring" / DATE
OUT_DIR.mkdir(parents=True, exist_ok=True)


def request(endpoint, params, max_retries=8, sleep=15):
    qs = urllib.parse.urlencode(params)
    url = f"{API_BASE}/{endpoint}?{qs}"
    cmd = [
        "curl",
        "-sS",
        "--max-time",
        "60",
        "-H",
        f"X-Keyso-TOKEN: {TOKEN}",
        "-H",
        "Accept: application/json",
        url,
    ]
    for attempt in range(max_retries):
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
        if result.returncode != 0:
            print(f"    curl error rc={result.returncode}, retry...", flush=True)
            time.sleep(5)
            continue
        try:
            data = json.loads(result.stdout)
        except json.JSONDecodeError:
            print(f"    non-JSON, retry...", flush=True)
            time.sleep(5)
            continue
        if isinstance(data, dict) and data.get("code") == 202:
            print(
                f"    202 retry {attempt + 1}/{max_retries} sleep={sleep}s",
                flush=True,
            )
            time.sleep(sleep)
            continue
        if isinstance(data, dict) and data.get("code") == 429:
            print(f"    429 rate-limit retry...", flush=True)
            time.sleep(30)
            continue
        if isinstance(data, dict) and data.get("code") == 401:
            raise RuntimeError(
                "401 Unauthorized — KEYSO_API_KEY устарел? Регенерируй в личном кабинете keys.so"
            )
        return data
    raise TimeoutError(f"{endpoint} did not stabilize after {max_retries} retries")


def snapshot_domain(domain):
    print(f"\n=== {domain} ===")
    overview = request("domain_dashboard", {"base": BASE, "domain": domain})

    out_path = OUT_DIR / f"{domain.replace('.', '_')}.json"
    out_path.write_text(json.dumps(overview, ensure_ascii=False, indent=2))
    size_kb = out_path.stat().st_size // 1024
    print(f"  saved → {out_path.relative_to(ROOT)} ({size_kb} KB)")

    # Extract key metrics for summary CSV
    if not isinstance(overview, dict):
        return None

    return {
        "domain": domain,
        "pages_in_index": overview.get("pagesinindex", 0),
        "keys_top50": overview.get("it50", 0),
        "keys_top10": overview.get("it10", 0),
        "vis": overview.get("vis", 0),
        "dr": overview.get("dr", 0),
        "ai_answers_count": overview.get("aiAnswersCnt", 0),
    }


def write_summary_csv(rows):
    csv_path = OUT_DIR / "summary.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(
            f,
            fieldnames=[
                "domain",
                "pages_in_index",
                "keys_top50",
                "keys_top10",
                "vis",
                "dr",
                "ai_answers_count",
            ],
        )
        w.writeheader()
        for row in rows:
            if row:
                w.writerow(row)
    print(f"\n  summary → {csv_path.relative_to(ROOT)}")


def write_table(rows):
    """Pretty-print таблица в stdout — для weekly review."""
    print(f"\n=== Snapshot {DATE} (Keys.so live, base={BASE}) ===")
    print(
        f"  {'domain':<18} {'pagesInIndex':>13} {'keys top-50':>12} {'keys top-10':>12} {'vis':>6} {'DR':>4} {'ai-answers':>11}",
    )
    for r in rows:
        if not r:
            continue
        print(
            f"  {r['domain']:<18} {r['pages_in_index']:>13} {r['keys_top50']:>12} {r['keys_top10']:>12} {r['vis']:>6} {r['dr']:>4} {r['ai_answers_count']:>11}",
        )


if __name__ == "__main__":
    started = time.time()
    rows = []
    for d in DOMAINS:
        try:
            row = snapshot_domain(d)
            rows.append(row)
        except Exception as e:
            print(f"  !! ERROR for {d}: {e}", flush=True)
            rows.append(None)

    write_summary_csv(rows)
    write_table(rows)

    elapsed = int(time.time() - started)
    print(f"\n=== DONE in {elapsed}s ===")
    print(f"Result: {OUT_DIR.relative_to(ROOT)}/")
