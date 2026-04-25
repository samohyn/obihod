#!/usr/bin/env python3
"""US-4 Wave 2 — Just-Magic wsfreq на pool.txt (Wordstat частоты для МСК+МО).

Лёгкая задача (без SERP-запросов). Цена ~0.02₽/ключ. Полезно как минимум
для ранжирования кластеров, если grp_onl недоступен или unstable.

Параметры:
  - ya_lrws=1 (Москва+МО)
  - device=all
  - частоты: s_std (общая) + s_q ("точная фраза") + s_qv ("!точная словоформа")
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
RAW_DIR = ROOT / "02-keywords" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

API = "https://api.just-magic.org/api_v1.php"
DEADLINE_MIN = 25


def load_env() -> dict:
    env = {}
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def post(data: dict, timeout: int = 90):
    r = requests.post(API, data=data, timeout=timeout)
    r.raise_for_status()
    return r


def main():
    env = load_env()
    apikey = env["JUSTMAGIC_API_KEY"]

    if "--tid" in sys.argv:
        tid = sys.argv[sys.argv.index("--tid") + 1]
    else:
        kws = [k for k in POOL_PATH.read_text().splitlines() if k.strip()]
        print(f"[pool] {len(kws)} kw, plan ~{len(kws) * 0.02:.2f}₽")
        payload = {
            "action": "put_task",
            "apikey": apikey,
            "task": "wsfreq",
            "data": "\n".join(kws),
            "ya_lrws": 1,
            "device": "all",
            "s_std": "true",
            "s_q": "true",
            "s_qv": "true",
            "label": "obikhod-us4-wsfreq",
        }
        last_exc = None
        for delay in [5, 15, 30, 60, 120]:
            try:
                r = post(payload, timeout=180)
                j = r.json()
                if j.get("err"):
                    raise RuntimeError(f"err: {j}")
                tid = j["tid"]
                print(f"[put_task] tid={tid} size={j.get('size')} lim_plan={j.get('lim_plan')}")
                break
            except Exception as e:
                last_exc = e
                print(f"[put_task] {type(e).__name__}: {e}, retry in {delay}s")
                time.sleep(delay)
        else:
            raise RuntimeError(f"submit failed: {last_exc}")

    deadline = time.time() + DEADLINE_MIN * 60
    last_short = None
    while time.time() < deadline:
        try:
            r = post(
                {"action": "list_tasks", "apikey": apikey, "limit": 20}, timeout=30
            )
            tasks = r.json().get("result", [])
        except Exception as e:
            print(f"[poll] error: {e}")
            time.sleep(30)
            continue
        ours = next((t for t in tasks if str(t.get("tid")) == str(tid)), None)
        if ours:
            short = {k: ours.get(k) for k in ("state", "size", "lim_fact", "fin_err")}
            if short != last_short:
                print(f"[poll] tid={tid} {short}")
                last_short = short
            if ours.get("state") == "fin":
                break
            if ours.get("state") == "err":
                print(f"[ERR] {ours}")
                sys.exit(2)
        time.sleep(30)
    else:
        print("[TIMEOUT]")
        sys.exit(3)

    csv = post(
        {"action": "get_task", "apikey": apikey, "tid": tid, "mode": "csv"},
        timeout=300,
    ).content
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out = RAW_DIR / f"justmagic-wsfreq-{ts}.csv"
    out.write_bytes(csv)
    print(f"[saved] {out} ({len(csv)} bytes) tid={tid}")


if __name__ == "__main__":
    main()
