---
rc: USLUGI-US-1 (EPIC-SEO-USLUGI US-1 release gate)
target: US-1 Research+Spec (intake + ba + sa-seo + ADR-0019 + namespace-audit + liwood passport + URL inventory + target-keys + backlog)
epic: EPIC-SEO-USLUGI
branch: seo/epic-uslugi-1-research-spec (НЕ создана — будет создана `do` после operator approve)
status: ready-for-operator-approve
created: 2026-05-08
author: release
team: common (release manager) / poseo orchestrating
sustained_pattern: RC-W14.md
---

# RC-USLUGI-US-1 — EPIC-SEO-USLUGI US-1 release gate

**Status: ✅ READY for operator approve.**

Iron rule релиз-цикла этого эпика (`specs/EPIC-SEO-USLUGI/intake.md` §«Релиз-цикл per US»):
`[poseo] dispatch → [executors] dev → [poseo→qa] → [leadqa] real-browser smoke → leadqa-N.md → [poseo→gate] → [operator] approve → [do] push → CI green → merge → deploy → [poseo] phase: done → US-N+1 dispatch`.

`leadqa-1` уже выполнен (`specs/EPIC-SEO-USLUGI/US-1-research-spec/leadqa-1.md`):
**8/8 AC PASS, 0 расхождений с ADR-0018, recommendation: APPROVE US-1 release.**
RC-USLUGI-US-1 агрегирует verification gate и передаёт оператору для финального approve.

---

## 1 · Scope of release

- **EPIC:** `EPIC-SEO-USLUGI` (новый, отдельный от EPIC-SEO-COMPETE-3)
- **US:** US-1 Research+Spec — **только спеки/ADR/inventory, кода нет**
- **Deliverables (9 файлов):**
  - `specs/EPIC-SEO-USLUGI/intake.md` (новый, 6.7KB)
  - `specs/EPIC-SEO-USLUGI/US-1-research-spec/ba.md` (новый, 6.4KB)
  - `specs/EPIC-SEO-USLUGI/US-1-research-spec/sa-seo.md` (новый, 12.3KB)
  - `specs/EPIC-SEO-USLUGI/US-1-research-spec/namespace-audit.md` (новый, PASS verdict)
  - `specs/EPIC-SEO-USLUGI/US-1-research-spec/leadqa-1.md` (новый, PASS verdict)
  - `team/adr/ADR-0019-uslugi-routing-resolver.md` (новый, accepted)
  - `seosite/01-competitors/liwood-services-passport-final.md` (новый, 230 строк)
  - `seosite/strategy/03-uslugi-url-inventory.json` (новый, ровно 191 URL)
  - `seosite/02-keywords/derived/target-keys-191.csv` (новый, 191 keys)
- **Modified:** `team/backlog.md` (добавлена секция EPIC-SEO-USLUGI в Now)

---

## 2 · Verification gate checklist

| # | Gate | Source | Statut |
|---|---|---|---|
| 1 | intake.md создан с DoD + 8 US | `ls -la specs/EPIC-SEO-USLUGI/intake.md` (6719 байт) | ✅ PASS |
| 2 | ba.md + sa-seo.md созданы | `ls -la specs/EPIC-SEO-USLUGI/US-1-research-spec/{ba,sa-seo}.md` | ✅ PASS |
| 3 | ADR-0019 status: accepted | `grep "^status:" team/adr/ADR-0019...md` | ✅ PASS |
| 4 | Namespace-audit verdict PASS (0 collisions) | `grep "PASS" specs/.../namespace-audit.md` | ✅ PASS |
| 5 | Liwood passport ≥200 строк | `wc -l seosite/01-competitors/liwood-services-passport-final.md` (230) | ✅ PASS |
| 6 | URL inventory = 191 URL | node verification: 41 inline + 5×30 SD = 191 | ✅ PASS |
| 7 | target-keys CSV = 191 keys | `tail -n +2 ... \| wc -l` (191) | ✅ PASS |
| 8 | backlog.md содержит EPIC-SEO-USLUGI | `grep -c "EPIC-SEO-USLUGI" team/backlog.md` (1) | ✅ PASS |
| 9 | ADR-0019 не противоречит ADR-0018 | cross-check 2-сегмент SD pattern | ✅ PASS |
| 10 | leadqa-1.md создан, verdict PASS | `grep "verdict: PASS" leadqa-1.md` | ✅ PASS |

**Итого: 10/10 gates PASS.**

---

## 3 · Risk-flag

**Risk: NONE.**

US-1 — research+spec, **никакого исполняемого кода, миграций, контента, deploy на production**. Слияние этого PR в `main`:
- НЕ задевает CWV / lead-flow / UX
- НЕ требует БД миграций
- НЕ требует Я.Метрика goal updates
- НЕ требует Я.Вебмастер upload
- НЕ требует sitemap regen (URL не публикуются — это inventory для US-7)

Worst-case rollback: `git revert` коммита, специфики не появятся ни на проде, ни в индексе Yandex/Google.

---

## 4 · Что делает do (после operator approve)

1. `git checkout -b seo/epic-uslugi-1-research-spec main`
2. `git add` specific files (см. §1 deliverables list)
3. `git commit` (HEREDOC message с Co-Authored-By)
4. `git push -u origin seo/epic-uslugi-1-research-spec`
5. `gh pr create` (title: `feat(seo): EPIC-SEO-USLUGI US-1 — research+spec deliverables`, body: ссылки на intake + ADR-0019 + leadqa-1)
6. CI green (type-check + lint + format:check) — на спек-файлы CI не строгий, но pass по умолчанию
7. `gh pr merge --squash --auto`
8. Post-deploy smoke: N/A (нет deploy)
9. `do` уведомляет poseo о merge → poseo → US-2 dispatch

---

## 5 · Recommendation для operator

**APPROVE US-1.**

Релиз закладывает **подписанный fundament** для оставшихся 7 US (US-2..US-8). Без US-1:
- US-2 (newui макеты) не имеет AC по 4 шаблонам
- US-3 (Payload расширение) не знает 30 cities + namespace-disjoint правила
- US-4 (slug-resolver) не знает архитектуру routing-resolver
- US-5 (контент-волна) не имеет target-keys по 191 URL

Решение блокирует US-2 dispatch до approve. Авторизация: фaza go/no-go по US-1 → US-2.

---

## 6 · Hand-off log

```
2026-05-08 · poseo → ba: dispatch US-1
2026-05-08 · ba → sa-seo: ba.md done
2026-05-08 · sa-seo → tamd (consult): ADR-0019 routing-resolver pattern review
2026-05-08 · sa-seo: ADR-0019 final, accepted
2026-05-08 · sa-seo: namespace-audit static-only (Postgres не up), PASS, 0 collisions
2026-05-08 · sa-seo + poseo: liwood-services-passport-final.md (230 строк, 5 leverage'ов detail)
2026-05-08 · sa-seo: 03-uslugi-url-inventory.json (191 URL exact match DoD)
2026-05-08 · sa-seo: target-keys-191.csv (191 rows)
2026-05-08 · poseo: backlog.md update (EPIC-SEO-USLUGI Now section)
2026-05-08 · poseo → leadqa: dispatch local-verify
2026-05-08 · leadqa: 8/8 AC PASS, leadqa-1.md done
2026-05-08 · poseo → release: dispatch gate
2026-05-08 · release: 10/10 gates PASS, RC-USLUGI-US-1 ready
2026-05-08 · release → operator: APPROVE pending
```
