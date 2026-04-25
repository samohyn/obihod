#!/usr/bin/env python3
"""US-4 Wave 2 — кластеризация pool батчами через grp_onl.

Сервер JM не принимает single POST с 1600+ ключей (RemoteDisconnected /
503). Разбиваем pool на N батчей и запускаем последовательно с retry.

После каждого батча — забираем csv. Объединение делает normalize_and_split.py
(он читает все raw-justmagic-*.csv).
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
BATCH_SIZE = 200
DEADLINE_MIN = 35
RETRY_DELAYS = [10, 30, 60, 90, 120]
MAX_TOTAL_RETRY_MIN = 8  # ограничиваем общий retry-time


def load_env() -> dict:
    env = {}
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def ping_until_alive(apikey: str, max_min: int = 5, label: str = "") -> bool:
    """Ждём пока JM не перестанет отдавать 503/connection errors."""
    deadline = time.time() + max_min * 60
    delay = 15
    while time.time() < deadline:
        try:
            r = requests.post(
                API,
                data={"action": "info", "apikey": apikey},
                timeout=15,
            )
            if r.status_code == 200 and '"err":0' in r.text:
                return True
            print(f"  [{label}/ping] status={r.status_code}, retry in {delay}s", flush=True)
        except Exception as e:
            print(f"  [{label}/ping] exc={type(e).__name__}: {e}, retry in {delay}s", flush=True)
        time.sleep(delay)
        delay = min(delay + 15, 60)
    return False


def post_with_retry(payload: dict, timeout: int = 90, label: str = "") -> requests.Response:
    last_exc = None
    started = time.time()
    for delay in RETRY_DELAYS:
        if time.time() - started > MAX_TOTAL_RETRY_MIN * 60:
            break
        try:
            r = requests.post(API, data=payload, timeout=timeout)
            if r.status_code == 503:
                print(f"  [{label}] 503, retry in {delay}s", flush=True)
                time.sleep(delay)
                continue
            r.raise_for_status()
            return r
        except (
            requests.exceptions.ConnectionError,
            requests.exceptions.Timeout,
            requests.exceptions.HTTPError,
        ) as e:
            last_exc = e
            print(f"  [{label}] {type(e).__name__}, retry in {delay}s", flush=True)
            time.sleep(delay)
    raise RuntimeError(f"Retries exhausted: {last_exc}")


def submit_grpomn(apikey: str, kws: list[str], label: str) -> str:
    payload = {
        "action": "put_task",
        "apikey": apikey,
        "task": "grp_onl",
        "data": "\n".join(kws),
        "search_engine": "yandex",
        "ya_lr": 213,
        "ya_lrws": 1,
        "lang": "ru",
        "device": "all",
        "f_temakl": "true",
        "s_std": "true",
        "s_q": "true",
        "s_qv": "true",
        "label": label,
    }
    r = post_with_retry(payload, timeout=90, label=label)
    j = r.json()
    print(f"[{label}] put_task → {json.dumps(j, ensure_ascii=False)}", flush=True)
    if j.get("err"):
        raise RuntimeError(f"put_task err: {j}")
    return str(j["tid"])


def wait_until_fin(apikey: str, tid: str, label: str) -> dict:
    deadline = time.time() + DEADLINE_MIN * 60
    last_short = None
    while time.time() < deadline:
        try:
            r = post_with_retry(
                {"action": "list_tasks", "apikey": apikey, "limit": 20},
                timeout=30,
                label=f"{label}/poll",
            )
            tasks = r.json().get("result", [])
        except Exception as e:
            print(f"[{label}] poll error: {e}", flush=True)
            time.sleep(30)
            continue
        ours = next((t for t in tasks if str(t.get("tid")) == tid), None)
        if ours is None:
            print(f"[{label}] tid={tid} not in list", flush=True)
        else:
            short = {
                k: ours.get(k)
                for k in ("state", "size", "lim_fact", "fin_err")
            }
            if short != last_short:
                print(f"[{label}] tid={tid} {short}", flush=True)
                last_short = short
            if ours.get("state") == "fin":
                return ours
            if ours.get("state") == "err":
                raise RuntimeError(f"task err: {ours}")
        time.sleep(30)
    raise TimeoutError(f"task {tid} not finished in {DEADLINE_MIN}min")


def fetch_csv(apikey: str, tid: str, label: str) -> bytes:
    r = post_with_retry(
        {"action": "get_task", "apikey": apikey, "tid": tid, "mode": "csv"},
        timeout=300,
        label=f"{label}/fetch",
    )
    return r.content


def main():
    env = load_env()
    apikey = env["JUSTMAGIC_API_KEY"]
    keywords = [k for k in POOL_PATH.read_text().splitlines() if k.strip()]
    print(f"[pool] {len(keywords)} keywords, batch_size={BATCH_SIZE}", flush=True)

    batches = [
        keywords[i : i + BATCH_SIZE] for i in range(0, len(keywords), BATCH_SIZE)
    ]
    print(f"[plan] {len(batches)} batches", flush=True)

    ts_overall = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    summary = []

    for idx, batch in enumerate(batches, 1):
        label = f"obikhod-us4-wave2-batch{idx}of{len(batches)}"
        print(
            f"\n=== batch {idx}/{len(batches)} ({len(batch)} kw) ===",
            flush=True,
        )
        # Pre-ping: ждём пока сервис будет alive (макс 5 мин), иначе пропускаем батч
        if not ping_until_alive(apikey, max_min=5, label=label):
            print(f"[{label}] JM не отвечает 5 мин, пропускаем батч", flush=True)
            summary.append({"batch": idx, "error": "JM unreachable", "tid": None})
            continue
        try:
            tid = submit_grpomn(apikey, batch, label)
        except Exception as e:
            print(f"[{label}] FAILED submit: {e}", flush=True)
            summary.append({"batch": idx, "error": str(e), "tid": None})
            continue

        try:
            meta = wait_until_fin(apikey, tid, label)
        except Exception as e:
            print(f"[{label}] FAILED wait: {e}", flush=True)
            summary.append({"batch": idx, "error": str(e), "tid": tid})
            continue

        try:
            csv_bytes = fetch_csv(apikey, tid, label)
        except Exception as e:
            print(f"[{label}] FAILED fetch: {e}", flush=True)
            summary.append({"batch": idx, "error": str(e), "tid": tid})
            continue

        ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        out = RAW_DIR / f"raw-justmagic-batch{idx}-{ts}.csv"
        out.write_bytes(csv_bytes)
        print(
            f"[{label}] saved {out.name} ({len(csv_bytes)} bytes), "
            f"lim_fact={meta.get('lim_fact')}",
            flush=True,
        )
        summary.append(
            {
                "batch": idx,
                "tid": tid,
                "size": len(batch),
                "csv_path": str(out),
                "lim_fact": meta.get("lim_fact"),
            }
        )

    summary_path = RAW_DIR / f"_batch-summary-{ts_overall}.json"
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2))
    print(f"\n[saved] {summary_path}")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
