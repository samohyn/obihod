/**
 * OVT-MONITOR weekly watcher (RICE 6.75)
 *
 * Закрывает PARITY axis URL/IA + general drift detection vs liwood baseline.
 * Source of truth для baseline: seosite/01-competitors/liwood-snapshot-2026-05-09.json (B1).
 *
 * Что делает:
 *   1. WebFetch на 13 ключевых URL liwood (sustained 200-list из B1 snapshot)
 *   2. Fetch sitemap.xml Обихода → count URL по типам (T2/T3/T4)
 *   3. Diff vs предыдущий snapshot из seosite/04-monitoring/snapshots/
 *   4. Threshold breach detection:
 *      - liwood URL count delta >5%
 *      - наш sitemap URL count delta >5%
 *      - liwood JSON-LD count delta >0
 *   5. Output: snapshots/{YYYY-MM-DD}.json
 *      + alerts/{YYYY-MM-DD}-{breach-type}.md (если breach)
 *
 * Запуск:
 *   pnpm tsx seosite/04-monitoring/watcher.ts            # live fetch
 *   pnpm tsx seosite/04-monitoring/watcher.ts --dry-run  # mock data, no real HTTP
 *   pnpm tsx seosite/04-monitoring/watcher.ts --force-alert  # force-emit alert (для GH Actions test)
 *
 * Ownership: seo + devops · EPIC-LIWOOD-OVERTAKE B5
 */

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ─── Types ──────────────────────────────────────────────────────────────

interface LiwoodUrlSnapshot {
  url: string;
  category: string;
  http_status: number;
  title: string | null;
  meta_description: string | null;
  h1: string | null;
  jsonld_count: number;
  jsonld_types: string[];
  word_count: number;
  has_lead_form: boolean;
  fetched_at_msk: string;
}

interface ObikhodSitemapSnapshot {
  total_urls: number;
  by_type: {
    T2_pillar: number;
    T3_subservice: number;
    T4_city_sd: number;
    other: number;
  };
  fetched_at_msk: string;
}

interface WatcherSnapshot {
  snapshot_date: string;
  watcher_version: string;
  epic: "EPIC-LIWOOD-OVERTAKE B5 OVT-MONITOR";
  liwood: {
    urls: LiwoodUrlSnapshot[];
    total_jsonld_count: number;
    total_200_count: number;
    total_404_count: number;
  };
  obikhod: ObikhodSitemapSnapshot;
}

interface BreachReport {
  type:
    | "liwood_urls_delta"
    | "obikhod_sitemap_delta"
    | "liwood_jsonld_added"
    | "forced_test";
  severity: "high" | "medium" | "low";
  current: number | string;
  previous: number | string;
  delta_pct?: number;
  description: string;
}

// ─── Config ─────────────────────────────────────────────────────────────

// Sustained URL list из B1 snapshot 2026-05-09 (13 URL × 200).
// Включает: homepage, services hub, 5 T2 pillar (live), 1 T3 sub, 1 T4 SD,
// /contacts, /company, /gallery, /info/calculator.
// 404-URL (oprysk, uborka-snega, khimki, about, portfolio) исключены — они подтверждённые
// slug-drift и не дают сигнала на drift detection.
const LIWOOD_KEY_URLS = [
  "https://liwood.ru/",
  "https://liwood.ru/services/",
  "https://liwood.ru/services/udalenie-derevev/",
  "https://liwood.ru/services/obrezka-derevev/",
  "https://liwood.ru/services/opryskivanie-derevev/",
  "https://liwood.ru/services/landshaftniy-dizayn-uchastka/",
  "https://liwood.ru/services/uborka-territorii/",
  "https://liwood.ru/services/udalenie-derevev/spil/",
  "https://liwood.ru/services/udalenie-derevev/himki/",
  "https://liwood.ru/contacts/",
  "https://liwood.ru/company/",
  "https://liwood.ru/gallery/",
  "https://liwood.ru/info/calculator/",
] as const;

const OBIKHOD_SITEMAP_URL = "https://obikhod.ru/sitemap.xml";

const FETCH_TIMEOUT_MS = 30_000;
const USER_AGENT = "ObikhodSEOMonitor/1.0 (+https://obikhod.ru/contacts/)";

// Threshold rationale:
//   - 5% URL delta = баланс между noise (1-2 URL не значимо) и signal
//     (10+ URL за неделю = реальный move competitor'а либо у нас).
//   - JSON-LD additions = критично: если liwood начнёт schema, наш +50pp
//     leverage из ADR-0017 сократится. Любая prirost = alert.
const THRESHOLD_URL_DELTA_PCT = 5;
const THRESHOLD_JSONLD_DELTA_ABS = 0;

// ─── Args ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isForceAlert = args.includes("--force-alert");

// ─── Paths ──────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOTS_DIR = resolve(__dirname, "snapshots");
const ALERTS_DIR = resolve(__dirname, "alerts");

// ─── Helpers ────────────────────────────────────────────────────────────

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowMsk(): string {
  // MSK = UTC+3. ISO timestamp + msk-suffix (без runtime tz dep).
  const utc = new Date();
  const msk = new Date(utc.getTime() + 3 * 60 * 60 * 1000);
  return msk.toISOString().replace("T", " ").slice(0, 19) + " MSK";
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<{ status: number; body: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xml,*/*",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    const body = res.ok ? await res.text() : "";
    return { status: res.status, body };
  } catch (err) {
    return {
      status: 0,
      body: `__fetch_error__: ${(err as Error).message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractTag(html: string, tag: "title" | "h1"): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = html.match(re);
  if (!m) return null;
  return (
    m[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim() || null
  );
}

function extractMetaDescription(html: string): string | null {
  const re =
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i;
  const m = html.match(re);
  return m ? m[1].trim() || null : null;
}

function extractJsonLd(html: string): { count: number; types: string[] } {
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const types: string[] = [];
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    count += 1;
    try {
      const parsed = JSON.parse(m[1].trim()) as
        | { "@type"?: string | string[] }
        | Array<{ "@type"?: string | string[] }>;
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const t = item["@type"];
        if (Array.isArray(t)) types.push(...t);
        else if (typeof t === "string") types.push(t);
      }
    } catch {
      // невалидный JSON-LD — count учитываем, type не парсим
    }
  }
  return { count, types: [...new Set(types)] };
}

function countWords(html: string): number {
  // Грубая оценка: убираем теги/script/style → разбиваем по whitespace.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").filter((w) => w.length > 0).length;
}

function hasLeadForm(html: string): boolean {
  return /<form[\s\S]*?(?:phone|tel|телефон|имя|name)[\s\S]*?<\/form>/i.test(
    html,
  );
}

// ─── Liwood fetcher ─────────────────────────────────────────────────────

async function fetchLiwoodUrl(url: string): Promise<LiwoodUrlSnapshot> {
  const { status, body } = await fetchWithTimeout(url);
  const fetchedAt = nowMsk();
  if (status !== 200) {
    return {
      url,
      category: "unknown",
      http_status: status,
      title: null,
      meta_description: null,
      h1: null,
      jsonld_count: 0,
      jsonld_types: [],
      word_count: 0,
      has_lead_form: false,
      fetched_at_msk: fetchedAt,
    };
  }
  const jsonld = extractJsonLd(body);
  return {
    url,
    category: categorizeLiwoodUrl(url),
    http_status: status,
    title: extractTag(body, "title"),
    meta_description: extractMetaDescription(body),
    h1: extractTag(body, "h1"),
    jsonld_count: jsonld.count,
    jsonld_types: jsonld.types,
    word_count: countWords(body),
    has_lead_form: hasLeadForm(body),
    fetched_at_msk: fetchedAt,
  };
}

function categorizeLiwoodUrl(url: string): string {
  const path = url.replace("https://liwood.ru", "").replace(/\/$/, "");
  if (path === "") return "homepage";
  if (path === "/services") return "services_hub";
  if (path === "/contacts") return "contacts";
  if (path === "/company") return "about";
  if (path === "/gallery") return "portfolio";
  if (path === "/info/calculator") return "calculator";
  // /services/<x>/spil → T3, /services/<x>/<city> → T4, /services/<x> → T2
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "services") return "T2_pillar";
  if (parts.length === 3 && parts[0] === "services") {
    // эвристика: city slugs обычно короткие (<=8 chars), sub-services длиннее
    return parts[2].length <= 8 ? "T4_city_sd" : "T3_subservice";
  }
  return "unknown";
}

// ─── Obikhod sitemap ────────────────────────────────────────────────────

async function fetchObikhodSitemap(): Promise<ObikhodSitemapSnapshot> {
  const { status, body } = await fetchWithTimeout(OBIKHOD_SITEMAP_URL);
  const fetchedAt = nowMsk();
  if (status !== 200) {
    return {
      total_urls: 0,
      by_type: { T2_pillar: 0, T3_subservice: 0, T4_city_sd: 0, other: 0 },
      fetched_at_msk: fetchedAt,
    };
  }
  // Парсим <loc>...</loc> из sitemap.xml.
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const counter = { T2_pillar: 0, T3_subservice: 0, T4_city_sd: 0, other: 0 };
  for (const loc of locs) {
    // /uslugi/<pillar>/ → T2
    // /uslugi/<pillar>/<sub>/ → T3
    // /uslugi/<pillar>/<sub>/<city>/ или /uslugi/<pillar>/<city>/ → T4
    const path = loc.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
    const parts = path.split("/").filter(Boolean);
    if (parts[0] !== "uslugi") {
      counter.other += 1;
      continue;
    }
    if (parts.length === 2) counter.T2_pillar += 1;
    else if (parts.length === 3) counter.T3_subservice += 1;
    else if (parts.length >= 4) counter.T4_city_sd += 1;
    else counter.other += 1;
  }
  return {
    total_urls: locs.length,
    by_type: counter,
    fetched_at_msk: fetchedAt,
  };
}

// ─── Dry-run mock ───────────────────────────────────────────────────────

function buildDryRunSnapshot(): WatcherSnapshot {
  // Mock соответствует B1 baseline 2026-05-09 структурно, чтобы diff давал 0.
  const mockLiwood: LiwoodUrlSnapshot[] = LIWOOD_KEY_URLS.map((url) => ({
    url,
    category: categorizeLiwoodUrl(url),
    http_status: 200,
    title: "[dry-run mock]",
    meta_description: null,
    h1: "[dry-run mock]",
    jsonld_count:
      url.includes("uborka-territorii") ||
      url.includes("gallery") ||
      url.includes("company")
        ? 1
        : 0,
    jsonld_types: [],
    word_count: 2500,
    has_lead_form: true,
    fetched_at_msk: nowMsk(),
  }));
  return {
    snapshot_date: todayIso(),
    watcher_version: "1.0.0",
    epic: "EPIC-LIWOOD-OVERTAKE B5 OVT-MONITOR",
    liwood: {
      urls: mockLiwood,
      total_jsonld_count: mockLiwood.reduce((s, u) => s + u.jsonld_count, 0),
      total_200_count: mockLiwood.length,
      total_404_count: 0,
    },
    obikhod: {
      total_urls: 174,
      by_type: { T2_pillar: 5, T3_subservice: 12, T4_city_sd: 154, other: 3 },
      fetched_at_msk: nowMsk(),
    },
  };
}

// ─── Diff & breach detection ────────────────────────────────────────────

async function findPreviousSnapshot(
  todayDate: string,
): Promise<WatcherSnapshot | null> {
  try {
    const files = await readdir(SNAPSHOTS_DIR);
    const jsonFiles = files
      .filter((f) => f.endsWith(".json") && f.replace(".json", "") < todayDate)
      .sort();
    if (jsonFiles.length === 0) return null;
    const latest = jsonFiles[jsonFiles.length - 1];
    const raw = await readFile(join(SNAPSHOTS_DIR, latest), "utf8");
    return JSON.parse(raw) as WatcherSnapshot;
  } catch {
    return null;
  }
}

function deltaPct(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function detectBreaches(
  current: WatcherSnapshot,
  previous: WatcherSnapshot | null,
  forceAlert: boolean,
): BreachReport[] {
  const breaches: BreachReport[] = [];

  if (forceAlert) {
    breaches.push({
      type: "forced_test",
      severity: "low",
      current: "forced",
      previous: "n/a",
      description:
        "Forced test alert via --force-alert (workflow_dispatch parameter). Validates issue-creation pipeline end-to-end.",
    });
  }

  if (!previous) return breaches; // первый запуск — не сравниваем

  // 1. liwood URL count delta (используем 200_count как proxy объёма)
  const liwoodCurrent = current.liwood.total_200_count;
  const liwoodPrev = previous.liwood.total_200_count;
  const liwoodDelta = deltaPct(liwoodCurrent, liwoodPrev);
  if (Math.abs(liwoodDelta) > THRESHOLD_URL_DELTA_PCT) {
    breaches.push({
      type: "liwood_urls_delta",
      severity: liwoodDelta > 0 ? "medium" : "low",
      current: liwoodCurrent,
      previous: liwoodPrev,
      delta_pct: liwoodDelta,
      description: `Liwood доступных URL ${liwoodDelta > 0 ? "выросло" : "упало"} на ${liwoodDelta.toFixed(1)}% (${liwoodPrev}→${liwoodCurrent}). ${liwoodDelta > 0 ? "Возможно расширение competitor'а — re-run B1 snapshot." : "Возможно liwood downtime либо чистка контента."}`,
    });
  }

  // 2. наш sitemap URL count delta
  const obikhodCurrent = current.obikhod.total_urls;
  const obikhodPrev = previous.obikhod.total_urls;
  const obikhodDelta = deltaPct(obikhodCurrent, obikhodPrev);
  if (Math.abs(obikhodDelta) > THRESHOLD_URL_DELTA_PCT) {
    breaches.push({
      type: "obikhod_sitemap_delta",
      severity: obikhodDelta < 0 ? "high" : "low",
      current: obikhodCurrent,
      previous: obikhodPrev,
      delta_pct: obikhodDelta,
      description: `Sitemap obikhod.ru ${obikhodDelta > 0 ? "вырос" : "УПАЛ"} на ${obikhodDelta.toFixed(1)}% (${obikhodPrev}→${obikhodCurrent}). ${obikhodDelta < 0 ? "⚠️ Возможна потеря URL из публичного индекса — investigate routes/sitemap.ts." : "Plановая публикация новых URL — sanity-check sitemap.ts diff."}`,
    });
  }

  // 3. liwood JSON-LD additions
  const jsonldCurrent = current.liwood.total_jsonld_count;
  const jsonldPrev = previous.liwood.total_jsonld_count;
  const jsonldDelta = jsonldCurrent - jsonldPrev;
  if (jsonldDelta > THRESHOLD_JSONLD_DELTA_ABS) {
    breaches.push({
      type: "liwood_jsonld_added",
      severity: "high",
      current: jsonldCurrent,
      previous: jsonldPrev,
      delta_pct: deltaPct(jsonldCurrent, jsonldPrev),
      description: `🚨 Liwood добавил JSON-LD: ${jsonldPrev}→${jsonldCurrent} (+${jsonldDelta}). ADR-0017 schema +50pp leverage сокращается — escalate to seo + arch для усиления нашего schema-coverage (BreadcrumbList на T3/T4 + Article schema phase 2).`,
    });
  }

  return breaches;
}

// ─── Output writers ─────────────────────────────────────────────────────

async function writeSnapshot(snapshot: WatcherSnapshot): Promise<string> {
  await mkdir(SNAPSHOTS_DIR, { recursive: true });
  const path = join(SNAPSHOTS_DIR, `${snapshot.snapshot_date}.json`);
  await writeFile(path, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  return path;
}

async function writeAlert(
  date: string,
  breach: BreachReport,
  snapshot: WatcherSnapshot,
  previous: WatcherSnapshot | null,
): Promise<string> {
  await mkdir(ALERTS_DIR, { recursive: true });
  const path = join(ALERTS_DIR, `${date}-${breach.type}.md`);
  const body = `# OVT-MONITOR alert · ${date} · ${breach.type}

**Severity:** ${breach.severity}
**Snapshot:** \`seosite/04-monitoring/snapshots/${date}.json\`
**Previous:** ${previous ? `\`seosite/04-monitoring/snapshots/${previous.snapshot_date}.json\`` : "n/a (первый запуск)"}

## Что произошло

${breach.description}

## Цифры

- **Current:** ${breach.current}
- **Previous:** ${breach.previous}
${breach.delta_pct !== undefined ? `- **Delta:** ${breach.delta_pct.toFixed(2)}%` : ""}

## Escalation

1. **po** читает alert и решает: rerun B1 snapshot / escalate to seo+arch / ack-and-monitor
2. Если breach подтверждён реальным сдвигом → **seo** добавляет US в \`team/backlog.md\` секцию «Liwood overtake roadmap (B5)»
3. **arch** консультируется при schema-related breach (\`liwood_jsonld_added\`)

## Threshold rationale

- URL delta >${THRESHOLD_URL_DELTA_PCT}% — баланс noise/signal (1-2 URL ≠ значимо, 10+ = реальный move)
- JSON-LD delta >${THRESHOLD_JSONLD_DELTA_ABS} — критичный leverage (ADR-0017 +50pp)

## Source

- B1 baseline: \`seosite/01-competitors/liwood-snapshot-2026-05-09.json\`
- Roadmap: \`seosite/01-competitors/overtake-roadmap-2026-05.md\` (OVT-MONITOR RICE 6.75)
- Watcher: \`seosite/04-monitoring/watcher.ts\`

— автоматически сгенерировано watcher.ts v${snapshot.watcher_version} в ${nowMsk()}
`;
  await writeFile(path, body, "utf8");
  return path;
}

// ─── Main ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const date = todayIso();
  console.log(
    `[watcher] ${date} · mode=${isDryRun ? "dry-run" : "live"}${isForceAlert ? " · forceAlert" : ""}`,
  );

  let snapshot: WatcherSnapshot;
  if (isDryRun) {
    console.log("[watcher] dry-run: using mock data, no real HTTP fetches");
    snapshot = buildDryRunSnapshot();
  } else {
    console.log(`[watcher] fetching ${LIWOOD_KEY_URLS.length} liwood URLs...`);
    const liwoodResults: LiwoodUrlSnapshot[] = [];
    for (const url of LIWOOD_KEY_URLS) {
      const result = await fetchLiwoodUrl(url);
      console.log(
        `  ${result.http_status} · ${url} · jsonld=${result.jsonld_count}`,
      );
      liwoodResults.push(result);
    }
    console.log("[watcher] fetching obikhod sitemap...");
    const obikhod = await fetchObikhodSitemap();
    console.log(
      `  total=${obikhod.total_urls} · T2=${obikhod.by_type.T2_pillar} T3=${obikhod.by_type.T3_subservice} T4=${obikhod.by_type.T4_city_sd}`,
    );
    snapshot = {
      snapshot_date: date,
      watcher_version: "1.0.0",
      epic: "EPIC-LIWOOD-OVERTAKE B5 OVT-MONITOR",
      liwood: {
        urls: liwoodResults,
        total_jsonld_count: liwoodResults.reduce(
          (s, u) => s + u.jsonld_count,
          0,
        ),
        total_200_count: liwoodResults.filter((u) => u.http_status === 200)
          .length,
        total_404_count: liwoodResults.filter((u) => u.http_status === 404)
          .length,
      },
      obikhod,
    };
  }

  const previous = await findPreviousSnapshot(date);
  console.log(
    `[watcher] previous snapshot: ${previous ? previous.snapshot_date : "(none — first run)"}`,
  );

  const breaches = detectBreaches(snapshot, previous, isForceAlert);
  console.log(`[watcher] detected ${breaches.length} breach(es)`);

  const snapshotPath = await writeSnapshot(snapshot);
  console.log(`[watcher] snapshot written: ${snapshotPath}`);

  for (const breach of breaches) {
    const alertPath = await writeAlert(date, breach, snapshot, previous);
    console.log(`[watcher] ALERT written: ${alertPath} (${breach.severity})`);
  }

  // Exit 0 даже при breach — workflow читает alerts/* и решает что делать.
  // Non-zero exit зарезервируем под fetch errors / file IO failures.
  if (isDryRun) {
    console.log("\n[watcher] === DRY-RUN OUTPUT SAMPLE ===");
    console.log(`liwood URLs: ${snapshot.liwood.urls.length}`);
    console.log(`liwood 200 count: ${snapshot.liwood.total_200_count}`);
    console.log(`liwood JSON-LD total: ${snapshot.liwood.total_jsonld_count}`);
    console.log(`obikhod sitemap total: ${snapshot.obikhod.total_urls}`);
    console.log(`breaches: ${breaches.length}`);
    if (breaches.length > 0) {
      console.log(
        `first breach: ${breaches[0].type} (${breaches[0].severity})`,
      );
    }
  }
}

main().catch((err) => {
  console.error("[watcher] FATAL:", err);
  process.exit(1);
});
