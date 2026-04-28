# team/adr/

Architecture Decision Records. Владелец — `tamd`. Нумерация сквозная:
`ADR-<N>-<slug>.md`.

## Формат ADR

```markdown
# ADR-<N>: <заголовок>

**Дата:** YYYY-MM-DD
**Статус:** Proposed | Accepted | Deprecated | Superseded by ADR-<M>
**Автор:** tamd
**Контекст US:** US-<N>-<slug> (если привязано)

## Контекст
<проблема, constraint, что привело к решению>

## Решение
<что именно решено, одной формулировкой>

## Альтернативы
<какие ещё рассматривались, почему отвергнуты>

## Последствия
- Плюсы: …
- Минусы / риски: …
- Follow-ups: …
```

## Когда нужен ADR

- Новая интеграция с внешней системой.
- Новый контракт API на уровне границ системы.
- Выбор библиотеки верхнего уровня (ORM, auth, queue, state management).
- Активация отдельного Go-микросервиса (`be1`/`be2` в резерве — только по ADR).
- Изменение границ подсистемы (вынесение pipeline фото→смета в отдельный
  сервис, выделение B2B-кабинета, и т.п.).

Стек зафиксирован в [CLAUDE.md](../../CLAUDE.md) § Technology Stack. Пересмотр
стека — отдельный ADR с явным обоснованием.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](ADR-0001-seed-prod-runner.md) | Seed prod runner | Accepted | 2026-04-21 |
| [0002](ADR-0002-site-chrome-dedup-seosettings.md) | SiteChrome / SeoSettings dedup | Accepted | 2026-04-23 |
| [0003](ADR-0003-blocks-pattern.md) | Blocks pattern для Payload коллекций | Accepted | 2026-04-25 |
| [0004](ADR-0004-team-restructure-v2.md) | Team restructure v2 (30 → 42 ролей в 7 командах) | Accepted | 2026-04-28 |
| [0005](ADR-0005-admin-customization-strategy.md) | Admin Customization Strategy (Payload 3 admin под brand-guide §12) | Accepted | 2026-04-28 |
| [0006](ADR-0006-shop-data-storage.md) | Shop data storage architecture (apps/shop · Drizzle · своя schema · JWT SSO) | Proposed | 2026-04-28 |
