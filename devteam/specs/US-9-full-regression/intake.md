# US-9: Полный технический регресс сайта

**Автор intake:** in
**Дата:** 2026-04-24
**Linear Issue:** [OBI-5](https://linear.app/samohyn/issue/OBI-5) (state: Backlog, labels: `Bug`, `P1`, project: EPIC SITE-MANAGEABILITY)
**Тип:** ops + bug
**Срочность:** high (P1)
**Сегмент:** cross
**Связано с:** EPIC SITE-MANAGEABILITY (эпик №7 из 8)

---

## Исходный запрос оператора (2026-04-24)

> 7 - делаем полный регресс технический

---

## Резюме запроса

Полный регресс всего сайта перед финальным SEO-аудитом (US-10): функциональный, производительный, безопасность, стабильность в продуктиве.

Покрытие:

1. **Функциональный регресс (E2E Playwright).**
   - Все публичные страницы отвечают 200, без битых ссылок.
   - Все формы (короткая, длинная, фото→смета) отправляются, валидация работает, honeypot не ломает.
   - Все калькуляторы считают корректно (граничные значения).
   - Админка: create/update/delete для каждой коллекции, publish-gate срабатывает, preview работает.
   - Обе роли доступа (после US-3) ведут себя корректно.
2. **Performance (Core Web Vitals на реальном prod).**
   - Lighthouse ≥ 90 на главной, pillar, programmatic, блог.
   - LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms.
   - Mobile (Moto G4 эмуляция).
3. **Accessibility (WCAG 2.2 AA).**
   - Автоматический axe-core на всех шаблонах страниц.
   - Ручной keyboard-walk по главной и заявке.
   - Контраст ≥ 4.5:1.
4. **Безопасность.**
   - `security-review` skill — OWASP Top 10.
   - Rate limiting на форму лида (spam-protection).
   - CSP headers, HSTS, secure cookies.
   - `.env` не утекает (проверка логов).
   - amoCRM webhook signature verification.
5. **SEO-тех (предварительно, до US-10).**
   - sitemap.xml генерится корректно.
   - robots.txt не блокирует нужное.
   - Canonical на всех страницах.
   - Нет noindex там, где должен быть index.
6. **Мониторинг.**
   - Sentry ловит фронт/бэк.
   - Я.Метрика пишет события.
   - Uptime-monitor (UptimeRobot или аналог) настроен.
7. **Backup & DR.**
   - pg_dump по крону работает (prod-backup workflow уже есть).
   - Restore-процедура проверена на staging.

## Открытые вопросы к оператору

1. **Staging-окружение** — нужно ли отдельное `staging.obikhod.ru` или регрессим на prod с откатом? Рекомендация: staging нужен, bekut второй VPS ~500 ₽/мес или подпроект на том же.
2. **UptimeRobot vs StatusCake vs Я.Метрика uptime** — что подключаем? ~0-1500 ₽/мес.
3. **pen-test** — подключаем внешнего аудитора (security-bounty-hunter) или справляемся своими `security-review` + `security-scan`?

## Предварительный бриф для BA

1. **Цель:** сайт стабилен, быстр, безопасен, доступен — готов к SEO-аудиту US-10.
2. **Метрики:**
   - 100% E2E-тестов зелёные.
   - Lighthouse ≥ 90 на всех шаблонах.
   - 0 critical/high issues в security review.
   - Axe-core: 0 violations.
3. **Границы:**
   - IN: всё из резюме.
   - OUT: оптимизация, которая выявилась (создаём backlog-тикеты).
4. **Состав команды:**
   - `qa1` + `qa2` (ведущие) — E2E + функциональные
   - `tamd` — performance + security audit
   - `fe1` + `fe2` — fix на регрессиях фронта
   - `be3` + `be4` — fix на регрессиях бэка
   - `do` — deploy, monitoring, backup, staging
   - `seo2` — тех-SEO-чеклист
   - `pa` — настройка Я.Метрика + uptime
   - `out` — accept

## Связи

- **Blocks:** US-10.
- **Blocked by:** US-6, US-7, US-8. По 1→8 — после US-8.

## Готовность к передаче

- [ ] Оператор ответил на 3 вопроса.
- [ ] Передано ba после US-8.

---

## Service-meta

- **Файл:** `devteam/specs/US-9-full-regression/intake.md`
- **Linear labels:** `Ops`, `Bug`, `P1`, `cross`, `phase:intake`, `role:in`, `QA`, `Performance`, `Security`
- **Assignee:** оператор
