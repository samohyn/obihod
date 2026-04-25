#!/usr/bin/env python3
"""US-4 Wave 2 — wsfreq микро-батчи по 50 kw (обходим JM-нестабильность).

Test-50 ранее прошёл успешно. Делаем wsfreq так же: 50 kw на батч, sequential,
с агрессивным retry. Цель — собрать частоты как минимум для топ-1000 ключей
по «значимости» (наши главные seed + расширения первого порядка).

Приоритет порядка: сначала seed.txt (184), потом sugpar (904), потом keysso.
"""
from __future__ import annotations

import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT.parent / "site" / ".env.local"
RAW_DIR = ROOT / "02-keywords" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

API = "https://api.just-magic.org/api_v1.php"
BATCH_SIZE = 50
DEADLINE_MIN = 6  # на батч
TARGET_KW = 1000
START_OFFSET = 50  # пропустить первые N (mb1 уже обработан)


def load_env() -> dict:
    env = {}
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def post(data: dict, timeout: int = 60) -> requests.Response:
    return requests.post(API, data=data, timeout=timeout)


def submit_batch(apikey: str, kws: list[str], label: str) -> str | None:
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
        "label": label,
    }
    for delay in [3, 8, 15, 30, 60]:
        try:
            r = post(payload, timeout=60)
            if r.status_code == 200 and '"err":0' in r.text:
                j = r.json()
                return str(j["tid"])
            print(f"  [{label}] submit status={r.status_code}, retry in {delay}s")
        except Exception as e:
            print(f"  [{label}] submit exc={type(e).__name__}, retry in {delay}s")
        time.sleep(delay)
    return None


def wait_fin(apikey: str, tid: str, label: str) -> bool:
    deadline = time.time() + DEADLINE_MIN * 60
    while time.time() < deadline:
        try:
            r = post({"action": "list_tasks", "apikey": apikey, "limit": 20}, timeout=20)
            if r.status_code != 200:
                time.sleep(20)
                continue
            tasks = r.json().get("result", [])
        except Exception:
            time.sleep(20)
            continue
        ours = next((t for t in tasks if str(t.get("tid")) == str(tid)), None)
        if ours:
            if ours.get("state") == "fin":
                return True
            if ours.get("state") == "err":
                return False
        time.sleep(15)
    return False


def fetch_csv(apikey: str, tid: str) -> bytes | None:
    for delay in [3, 10, 30]:
        try:
            r = post(
                {"action": "get_task", "apikey": apikey, "tid": tid, "mode": "csv"},
                timeout=120,
            )
            if r.status_code == 200 and r.content:
                return r.content
        except Exception:
            pass
        time.sleep(delay)
    return None


def load_priority_kw() -> list[str]:
    """Сначала seed, потом sug_par, потом всё остальное из pool."""
    pool = [k for k in (ROOT / "02-keywords" / "pool.txt").read_text().splitlines() if k.strip()]
    seed = set(
        re.sub(r"\s+", " ", ln.strip().lower().replace("ё", "е"))
        for ln in (ROOT / "02-keywords" / "seed.txt").read_text().splitlines()
        if ln.strip() and not ln.strip().startswith("#")
    )
    out: list[str] = []
    seen: set[str] = set()
    # 1) seed
    for k in pool:
        if k in seed and k not in seen:
            out.append(k)
            seen.add(k)
    # 2) остальные
    for k in pool:
        if k not in seen:
            out.append(k)
            seen.add(k)
    return out[:TARGET_KW]


def main():
    env = load_env()
    apikey = env["JUSTMAGIC_API_KEY"]
    kws = load_priority_kw()
    # пропускаем уже обработанные (mb1 = первые 50)
    kws_remaining = kws[START_OFFSET:]
    print(
        f"[plan] {len(kws)} priority kw, skipping {START_OFFSET} done, "
        f"remaining {len(kws_remaining)} in {len(kws_remaining) // BATCH_SIZE + 1} batches",
        flush=True,
    )
    saved_files = []
    for idx in range(0, len(kws_remaining), BATCH_SIZE):
        batch = kws_remaining[idx : idx + BATCH_SIZE]
        # mb номер с учётом offset
        mb_no = (START_OFFSET // BATCH_SIZE) + (idx // BATCH_SIZE) + 1
        label = f"obikhod-us4-wsfreq-mb{mb_no}"
        tid = submit_batch(apikey, batch, label)
        if not tid:
            print(f"[{label}] FAILED submit, skip")
            continue
        print(f"[{label}] tid={tid}")
        if not wait_fin(apikey, tid, label):
            print(f"[{label}] FAILED wait/err")
            continue
        csv = fetch_csv(apikey, tid)
        if csv is None:
            print(f"[{label}] FAILED fetch")
            continue
        ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        out = RAW_DIR / f"justmagic-wsfreq-mb{idx // BATCH_SIZE + 1}-{ts}.csv"
        out.write_bytes(csv)
        saved_files.append(out.name)
        print(f"[{label}] saved {out.name} ({len(csv)} bytes)")
    print(f"\n[summary] saved {len(saved_files)} files: {saved_files}")


if __name__ == "__main__":
    main()
