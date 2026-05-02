/**
 * Topvisor weekly export — TODO для Stage 3 (US-5-eeat-monitoring).
 *
 * Workflow: при наличии TOPVISOR_API_TOKEN env var:
 *   - Pull weekly snapshot для project_id
 *   - Save to seosite/08-monitoring/topvisor-week-<N>.csv
 *   - Diff vs previous week → отчёт по позициям
 *
 * Сейчас: stub, не запускается.
 *
 * Owner: cms / seo-tech
 * Activation: после оператор-аппрува Topvisor аккаунта + API token в .env.production
 */

if (!process.env.TOPVISOR_API_TOKEN) {
  console.log(
    'Topvisor export skipped — TOPVISOR_API_TOKEN not set (Stage 3 deliverable)',
  )
  process.exit(0)
}

// TODO Stage 3 (US-5-eeat-monitoring):
// 1. Read TOPVISOR_API_TOKEN, TOPVISOR_PROJECT_ID from env
// 2. POST https://api.topvisor.com/v2/json/get/positions_2/history
//    body: { project_id, regions, dates, only_visible: 1 }
// 3. Parse JSON → flatten keyword × competitor × position
// 4. Compute diff vs previous week (read latest seosite/08-monitoring/topvisor-week-*.csv)
// 5. Write seosite/08-monitoring/topvisor-week-<ISO>.csv with columns:
//    keyword, pillar, our_position, top_competitor, top_competitor_position, delta_vs_last_week
// 6. Emit short markdown summary to seosite/08-monitoring/topvisor-week-<ISO>.md
//    with top movers (up/down) + new top-10 entries
//
// Reference: https://topvisor.com/api/services/positions/get-positions-2-history/

console.log('Topvisor export — Stage 3 implementation pending')
process.exit(0)
