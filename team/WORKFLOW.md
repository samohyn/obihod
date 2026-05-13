# Обиход — Workflow команды (Scrum)

Живой регламент работы **10-ролевой Scrum-команды** над сайтом **Обиход** и сопутствующими
продуктами (магазин саженцев, admin-панель, SEO-программа).

> Приоритет источников: `CLAUDE.md` → `team/PROJECT_CONTEXT.md` → `contex/*.md` → этот файл.

---

## 0. Контекст проекта

- **Продукт:** [obikhod.ru](https://obikhod.ru) — подрядчик 4-в-1 для B2C и B2B в Москве и МО
- **Стек:** Next.js 16 + Payload CMS 3 + PostgreSQL 16 + Beget VPS
- **Код:** `site/` (основной), `apps/shop/` (магазин — пока не запущен)
- **CI/CD:** GitHub Actions (`ci.yml` + `deploy.yml`)
- **Task-tracker:** `team/backlog.md` + `specs/<ID>/spec.md`
- **Язык:** контент — русский; код, identifiers, commit messages — английский

---

## 1. Команда — 10 ролей

| Роль | Файл | Зона |
|------|------|------|
| `po` | [team/po.md](po.md) | Беклог, спринты, acceptance |
| `dev` | [team/dev.md](dev.md) | Full-stack: Next.js, Payload, API, БД |
| `fe` | [team/fe.md](fe.md) | Frontend: компоненты, CSS, адаптив, a11y |
| `seo` | [team/seo.md](seo.md) | Технический SEO + контент-стратегия |
| `cw` | [team/cw.md](cw.md) | Тексты, TOV, Payload-публикация |
| `design` | [team/design.md](design.md) | UI/UX, brand-guide, макеты |
| `qa` | [team/qa.md](qa.md) | E2E тесты, code review, релизный gate |
| `devops` | [team/devops.md](devops.md) | CI/CD, Beget VPS, merge, деплой |
| `arch` | [team/arch.md](arch.md) | ADR, архитектура (on-demand) |
| `shop` | [team/shop.md](shop.md) | Магазин `apps/shop/` (спящий) |

**Sticky sessions:** `@po`, `@dev`, `@fe`, `@seo`, `@cw`, `@design`, `@qa`, `@devops`, `@arch`

---

## 2. Воркфлоу

### Жизненный цикл задачи

```
1. INTAKE
   Operator → po: задача (текст / скриншот / требование)

2. PLANNING  
   po: записывает в backlog.md → пишет spec.md (Story + AC)
   po: назначает исполнителей → объявляет спринт

3. EXECUTION (параллельно)
   dev / fe / seo / cw / design: реализуют
   Вопросы — к po напрямую, не эскалируем без нужды

4. QA
   PR открыт → qa: code review + local verify + E2E
   qa PASS → approve PR
   qa FAIL → request changes → исполнитель фиксит → qa повторяет

5. ACCEPTANCE
   po: проверяет AC → approve PR

6. DEPLOY
   devops: CI зелёный? → gh pr merge → deploy.yml → smoke
   smoke PASS → done
   smoke FAIL → rollback → incident.md → po уведомлён
```

### Правило merge

Merge = **CI зелёный** + **qa approve** + **po approve**.
`devops` мержит через `gh pr merge`, без ожидания оператора для технических PR.

Оператор апрувит только бизнес-решения (новые фичи, изменение стека, деплой к клиентам).

---

## 3. Спринт

**Длина:** 1 неделя (или по задаче — можно shorter).

**Ceremonies (минимальные):**
- **Sprint Planning** (po + исполнители): что берём, кто делает, AC ясны?
- **Sprint Review** (po + operator): демо результатов, acceptance
- Retro — по необходимости, не обязательно каждый спринт

---

## 4. Форматы артефактов

### spec.md (минимум)

```markdown
# <ID> — <название>

## Story
Как <кто>, я хочу <что>, чтобы <зачем>.

## AC
- [ ] Given ..., When ..., Then ...

## Out of scope
- ...
```

Хранится в: `specs/<ID>/spec.md`

### backlog.md

Формат строки:

```
| ID | Что | Owner | Effort | Status | Note |
```

Статусы: `now` | `next` | `later` | `blocked` | `done` | `dropped`

---

## 5. Железные правила

1. **Skill-check** — **первый вызов инструмента в любой задаче — `Skill tool`**. До кода, до чтения файлов.
   Алгоритм: читаю frontmatter роли → поле `skills:` → вызываю `Skill` tool для релевантных →
   фиксирую `skills_activated: [skill1, skill2]` в артефакте + раздел `## Skill activation`.
   Нет нужного skill → передаю задачу `po`.

2. **Design-system awareness** — перед UI/UX/TOV задачей сверка с
   `design-system/brand-guide.html`. Один источник для всех.

3. **Green CI before merge** — `devops` мержит только при зелёном CI.
   `dev`/`fe` гоняют `type-check + lint + format:check` ДО открытия PR.

4. **Real-browser smoke** — `qa` разворачивает PR локально и делает browser smoke
   ДО approve merge. Не после.

5. **Playwright скриншоты** → `screen/<name>.png` от корня проекта.

6. **Секреты** — только в `.env`, никогда в git (хук `protect-secrets.sh`).

---

## 6. Эскалация

| Ситуация | Куда |
|----------|------|
| Техническая развилка (ADR нужен) | `arch` |
| Бизнес-решение (scope, приоритет, стек) | Оператор |
| Конфликт между задачами | `po` |
| Падение прода | `devops` → оператор |

---

## 7. Маппинг старых ролей → новые

Если встречаешь старые коды в `specs/` или `team/adr/` — вот соответствие:

| Старая роль | Новая роль |
|-------------|-----------|
| cpo, podev, poseo, popanel, poshop, ba, in, re | `po` |
| be-site, be-panel, be-shop, dba | `dev` |
| fe-site, fe-panel, fe-shop, lp-site | `fe` |
| seo-tech, seo-content, poseo, sa-seo | `seo` |
| cw, cms | `cw` |
| art, ux, ui, ux-shop, ux-panel | `design` |
| qa-site, qa-panel, qa-shop, cr-site, cr-panel, cr-shop, release, leadqa | `qa` |
| do | `devops` |
| tamd | `arch` |
| poshop, sa-shop, be-shop, fe-shop | `shop` (когда активен) |

Старые файлы ролей — в `team/archive/`.
