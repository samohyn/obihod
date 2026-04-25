#!/usr/bin/env python3
"""US-4 Wave 2 — Just-Magic sug_par batch runner.

API: form-encoded POST на api_v1.php. Поля state: 'wait' → 'work' → 'fin'.
Сохраняет csv-результат + info-json в seosite/02-keywords/raw/.
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
SEED_PATH = ROOT / "02-keywords" / "seed.txt"
RAW_DIR = ROOT / "02-keywords" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

API = "https://api.just-magic.org/api_v1.php"
DEADLINE_MIN = 12


def load_env() -> dict:
    env = {}
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def load_seeds() -> list[str]:
    return [
        ln.strip()
        for ln in SEED_PATH.read_text().splitlines()
        if ln.strip() and not ln.strip().startswith("#")
    ]


def post(data: dict, timeout: int = 120) -> requests.Response:
    r = requests.post(API, data=data, timeout=timeout)
    r.raise_for_status()
    return r


def main():
    env = load_env()
    apikey = env["JUSTMAGIC_API_KEY"]
    seeds = load_seeds()
    print(f"[seeds] loaded={len(seeds)}", flush=True)
    data_str = "\n".join(seeds)

    payload = {
        "action": "put_task",
        "apikey": apikey,
        "task": "sug_par",
        "data": data_str,
        "iter": 1,
        "lang": "ru",
        "ya_lr": 213,
        "mode": "std",
        "f_space": "true",
    }
    create = post(payload).json()
    print(f"[put_task] {create}", flush=True)
    if create.get("err"):
        print(f"[ERROR] put_task failed: {create}", flush=True)
        sys.exit(1)
    tid = create["tid"]

    deadline = time.time() + DEADLINE_MIN * 60
    last = None
    while time.time() < deadline:
        info_resp = post(
            {"action": "list_tasks", "apikey": apikey, "limit": 5}, timeout=30
        ).json()
        # ищем нашу задачу в списке
        ours = next(
            (t for t in info_resp.get("result", []) if str(t.get("tid")) == str(tid)),
            None,
        )
        if ours is None:
            print(f"[poll] tid={tid} not in list yet", flush=True)
        else:
            state = ours.get("state")
            short = {
                k: ours.get(k)
                for k in ("state", "type", "size", "lim_fact", "fin_err")
            }
            if short != last:
                print(f"[poll] tid={tid} {short}", flush=True)
                last = short
            if state == "fin":
                break
            if state == "err":
                print(f"[ERROR] task finished with error: {ours}")
                sys.exit(2)
        time.sleep(20)
    else:
        print("[TIMEOUT] sug_par not completed", flush=True)
        sys.exit(3)

    csv_resp = post(
        {"action": "get_task", "apikey": apikey, "tid": tid, "mode": "csv"},
        timeout=180,
    )
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    csv_path = RAW_DIR / f"justmagic-sugpar-{ts}.csv"
    csv_path.write_bytes(csv_resp.content)
    info_path = RAW_DIR / f"justmagic-sugpar-{ts}-info.json"
    info_path.write_text(json.dumps(ours, ensure_ascii=False, indent=2))
    print(
        f"[saved] {csv_path} ({len(csv_resp.content)} bytes)\n"
        f"[saved] {info_path}\n[tid] {tid}"
    )


if __name__ == "__main__":
    main()
