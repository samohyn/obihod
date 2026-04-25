#!/usr/bin/env python3
"""US-4 Wave 2 — Just-Magic grp_onl кластеризация pool.txt.

Параметры:
  - search_engine=yandex
  - ya_lr=213 (Москва) — основа кластеризации по ТОП-10
  - ya_lrws=1 (Москва+МО) — для частот wsfreq
  - lang=ru, device=all
  - f_temakl=true (бесплатная тематич. классификация для seo1)
  - частоты: s_std (общая) + s_q ("точная фраза") + s_qv ("!фразовая")

Проверка состояния через list_tasks (state=fin/err).
"""
from __future__ import annotations

import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT.parent / "site" / ".env.local"
POOL_PATH = ROOT / "02-keywords" / "pool.txt"
RAW_DIR = ROOT / "03-clusters"
RAW_DIR.mkdir(parents=True, exist_ok=True)

API = "https://api.just-magic.org/api_v1.php"
DEADLINE_MIN = 30


def load_env() -> dict:
    env = {}
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def post(data: dict, timeout: int = 120, multipart: bool = False):
    """form-encoded по умолчанию; multipart=True для больших payload (>50KB)."""
    if multipart:
        # каждое поле — как (filename, content) → multipart/form-data
        files = {k: (None, str(v)) for k, v in data.items()}
        r = requests.post(API, files=files, timeout=timeout)
    else:
        r = requests.post(API, data=data, timeout=timeout)
    r.raise_for_status()
    return r


def main():
    env = load_env()
    apikey = env["JUSTMAGIC_API_KEY"]

    if "--tid" in sys.argv:
        tid = sys.argv[sys.argv.index("--tid") + 1]
        print(f"[mode] resume tid={tid}", flush=True)
    else:
        keywords = [k for k in POOL_PATH.read_text().splitlines() if k.strip()]
        print(f"[pool] {len(keywords)} keywords", flush=True)
        data_str = "\n".join(keywords)

        payload = {
            "action": "put_task",
            "apikey": apikey,
            "task": "grp_onl",
            "data": data_str,
            "search_engine": "yandex",
            "ya_lr": 213,
            "ya_lrws": 1,  # Москва + МО
            "lang": "ru",
            "device": "all",
            "f_temakl": "true",
            "s_std": "true",
            "s_q": "true",
            "s_qv": "true",
            "label": "obikhod-us4-wave2",
        }
        # Большой data (>50KB) — multipart надёжнее, чем urlencoded
        create = post(payload, timeout=180, multipart=True).json()
        print(f"[put_task] {json.dumps(create, ensure_ascii=False)}", flush=True)
        if create.get("err"):
            print(f"[ERROR] put_task failed: {create}", flush=True)
            sys.exit(1)
        tid = create["tid"]

    deadline = time.time() + DEADLINE_MIN * 60
    last = None
    final_meta = None
    while time.time() < deadline:
        info = post(
            {"action": "list_tasks", "apikey": apikey, "limit": 10}, timeout=30
        ).json()
        ours = next(
            (t for t in info.get("result", []) if str(t.get("tid")) == str(tid)),
            None,
        )
        if ours is None:
            print(f"[poll] tid={tid} not in list yet", flush=True)
        else:
            short = {
                k: ours.get(k)
                for k in (
                    "state",
                    "type",
                    "size",
                    "lim_fact",
                    "lim_plan",
                    "fin_err",
                    "label",
                )
            }
            if short != last:
                print(f"[poll] tid={tid} {short}", flush=True)
                last = short
            if ours.get("state") == "fin":
                final_meta = ours
                break
            if ours.get("state") == "err":
                print(f"[ERROR] task finished with err: {ours}", flush=True)
                sys.exit(2)
        time.sleep(30)
    else:
        print("[TIMEOUT] grp_onl not completed in 30min", flush=True)
        sys.exit(3)

    csv_resp = post(
        {"action": "get_task", "apikey": apikey, "tid": tid, "mode": "csv"},
        timeout=300,
    )
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    csv_path = RAW_DIR / f"raw-justmagic-{ts}.csv"
    csv_path.write_bytes(csv_resp.content)

    info_path = RAW_DIR / f"raw-justmagic-{ts}-info.json"
    info_path.write_text(json.dumps(final_meta, ensure_ascii=False, indent=2))

    # пробуем дополнительно xlsx
    try:
        xlsx_resp = post(
            {"action": "get_task", "apikey": apikey, "tid": tid, "mode": "xlsx"},
            timeout=300,
        )
        xlsx_path = RAW_DIR / f"raw-justmagic-{ts}.xlsx"
        xlsx_path.write_bytes(xlsx_resp.content)
        print(f"[saved] {xlsx_path} ({len(xlsx_resp.content)} bytes)")
    except Exception as e:
        print(f"[xlsx] skipped: {e}")

    print(f"[saved] {csv_path} ({len(csv_resp.content)} bytes)")
    print(f"[saved] {info_path}")
    print(f"[tid] {tid}")


if __name__ == "__main__":
    main()
