#!/usr/bin/env python3
"""TF-IDF + KMeans clustering fallback for commercial keys.

Just-Magic deep clustering is deferred to US-2 (after ADR-0018 approve).
This script builds a baseline cluster map for top lead+pricing keys
using sklearn TF-IDF + MiniBatchKMeans (cosine via L2-normalized vectors).
"""
import csv
import math
import sys
from collections import Counter, defaultdict
from pathlib import Path

from sklearn.cluster import MiniBatchKMeans
from sklearn.feature_extraction.text import TfidfVectorizer

ROOT = Path(__file__).resolve().parents[2]
DERIVED = ROOT / "seosite" / "02-keywords" / "derived"
UNION_CSV = DERIVED / "union-3-competitors.csv"
OUT_CSV = DERIVED / "clusters-tfidf.csv"

# Russian stop-words (минимальный набор для seo-домена)
STOPWORDS = {
    "и", "в", "на", "с", "по", "для", "от", "до", "за", "не", "или",
    "что", "это", "как", "при", "так", "бы", "же", "ли", "то", "вот",
    "их", "его", "её", "она", "он", "оно", "они", "мы", "вы", "я",
    "из", "у", "к", "о", "об", "под", "над", "ту", "те",
}

# Sklearn TfidfVectorizer expects either a list of stop words or 'english'/None.
# We pass our Russian list directly.
TARGET_INTENTS = {"lead", "pricing"}
MIN_WSK = 3  # filter very-low-traffic keys
MAX_KEYS = 1500  # cluster cap (reproducibility + speed)
N_CLUSTERS = 60

def load_keys():
    keys = []
    with open(UNION_CSV, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                wsk = int(row.get("wsk") or 0)
            except (TypeError, ValueError):
                wsk = 0
            if wsk < MIN_WSK:
                continue
            if row["intent"] not in TARGET_INTENTS:
                continue
            keys.append({
                "word": row["word"],
                "ws": int(row.get("ws") or 0),
                "wsk": wsk,
                "intent": row["intent"],
                "pillar": row["pillar"],
                "domains": row.get("domains", ""),
            })
    keys.sort(key=lambda x: -x["wsk"])
    return keys[:MAX_KEYS]


def cluster(keys):
    if len(keys) < N_CLUSTERS:
        n = max(2, len(keys) // 5)
    else:
        n = N_CLUSTERS
    print(f"  TF-IDF on {len(keys)} keys, k={n}", flush=True)
    vectorizer = TfidfVectorizer(
        token_pattern=r"(?u)\b[А-Яа-яёЁA-Za-z]{2,}\b",
        stop_words=list(STOPWORDS),
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.7,
    )
    matrix = vectorizer.fit_transform([k["word"] for k in keys])
    print(f"  matrix shape={matrix.shape}", flush=True)

    km = MiniBatchKMeans(n_clusters=n, n_init=10, random_state=42,
                          batch_size=128, verbose=0)
    labels = km.fit_predict(matrix)

    # Top terms per cluster (label hints)
    feature_names = vectorizer.get_feature_names_out()
    centroids = km.cluster_centers_.argsort()[:, ::-1]

    cluster_labels = {}
    cluster_keys = defaultdict(list)
    for i, label in enumerate(labels):
        cluster_keys[int(label)].append(keys[i])
    for cid in range(n):
        top_terms = [feature_names[idx] for idx in centroids[cid][:5]]
        cluster_labels[cid] = " / ".join(top_terms)

    return cluster_keys, cluster_labels


def write_csv(cluster_keys, cluster_labels):
    rows = []
    for cid, items in cluster_keys.items():
        items.sort(key=lambda x: -x["wsk"])
        wsk_total = sum(k["wsk"] for k in items)
        for kw in items:
            rows.append({
                "cluster_id": cid,
                "cluster_label": cluster_labels[cid],
                "cluster_size": len(items),
                "cluster_wsk_total": wsk_total,
                "word": kw["word"],
                "ws": kw["ws"],
                "wsk": kw["wsk"],
                "intent": kw["intent"],
                "pillar": kw["pillar"],
                "domains": kw["domains"],
            })
    rows.sort(key=lambda r: (-r["cluster_wsk_total"], r["cluster_id"], -r["wsk"]))
    with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"  → {OUT_CSV.relative_to(ROOT)} ({len(rows)} rows / {len(cluster_keys)} clusters)")
    return rows


def summary(cluster_keys, cluster_labels):
    print(f"\n=== Top-15 clusters by total wsk ===")
    cluster_summary = []
    for cid, items in cluster_keys.items():
        wsk_total = sum(k["wsk"] for k in items)
        intent_dist = Counter(k["intent"] for k in items)
        pillar_dist = Counter(k["pillar"] for k in items)
        cluster_summary.append((cid, wsk_total, len(items), intent_dist, pillar_dist))
    cluster_summary.sort(key=lambda x: -x[1])
    for cid, wsk_total, count, intent_dist, pillar_dist in cluster_summary[:15]:
        top_pillar = pillar_dist.most_common(1)[0]
        print(f"  C{cid:>2} ({count:>3} keys, wsk={wsk_total:>5}): "
              f"{cluster_labels[cid][:50]:<50} "
              f"pillar={top_pillar[0]}({top_pillar[1]}) "
              f"intent={dict(intent_dist)}")


def main():
    keys = load_keys()
    if not keys:
        print("ERROR: no commercial keys found", file=sys.stderr)
        sys.exit(2)
    print(f"loaded {len(keys)} commercial keys (intent ∈ {TARGET_INTENTS}, wsk ≥ {MIN_WSK})")
    ck, cl = cluster(keys)
    write_csv(ck, cl)
    summary(ck, cl)


if __name__ == "__main__":
    main()
