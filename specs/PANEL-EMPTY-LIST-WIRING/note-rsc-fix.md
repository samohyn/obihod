---
note: PANEL-EMPTY-LIST-WIRING — RSC border hotfix
incident: leadqa RC-2 BLOCK
reported_by: leadqa
fixed_by: fe-panel
fixed_at: 2026-05-01
phase: dev → review (self-approved)
---

# RSC border fix — `CollectionListWithEmpty.tsx`

## Что было сломано

`feat(panel): PANEL-EMPTY-LIST-WIRING` (PR #120, commit `d8bf1f8`) ввёл server
component `CollectionListWithEmpty` без `'use client'`. В ветке
`totalDocs > 0` он спредил **все** props (включая server-only) в client
component `<DefaultListView>`:

```tsx
return <DefaultListView {...listProps} />
```

Server props содержали `collectionConfig` (с function-полями `access`,
`hooks`, `endpoints`), `payload`, `req`, `i18n` — non-serializable через
RSC границу. Next.js 16 RSC-runtime отвечал 500:

> Functions cannot be passed directly to Client Components unless you
> explicitly expose it by marking it with 'use server'.

Подтверждено leadqa real-browser smoke RC-2:
[`team/release-notes/leadqa-RC-2.md` § Findings R1](../../team/release-notes/leadqa-RC-2.md).

На local 100% repro: `/admin/collections/cases` (1 doc) → 500. На проде
Cases=4 / Blog=5 → обе сломаны.

## Корень: как Payload собирает props

`@payloadcms/next/dist/views/List/index.js:315-340` —
`renderListView` вызывает `RenderServerComponent`:

```js
RenderServerComponent({
  clientProps: { collectionSlug, columnState, hasCreatePermission, ... },
  Component: collectionConfig?.admin?.components?.views?.list?.Component,
  Fallback: DefaultListView,
  serverProps,  // payload, req, i18n, collectionConfig (с функциями!), data, ...
})
```

`@payloadcms/ui/dist/elements/RenderServerComponent/index.js:25-34`:

```js
if (typeof Component === 'function') {
  const isRSC = isReactServerComponentOrFunction(Component)
  const sanitizedProps = removeUndefined({
    ...clientProps,
    ...(isRSC ? serverProps : {}),  // ← если RSC — мерджит ВСЁ
  })
  return _jsx(Component, { ...sanitizedProps })
}
```

Когда наш wrapper — RSC (нет `'use client'`), Payload по дизайну сливает
`clientProps + serverProps` и спредит в наш компонент. Это документированный
contract; client component получил бы только `clientProps`.

## Подход (a) selective spread — выбран

Альтернативы рассматривались:
- (b) **No-spread** `<DefaultListView />` без props — невозможно, DefaultListView
  явно типизирован как `(props: ListViewClientProps) => JSX.Element`
  (`@payloadcms/ui/dist/views/List/index.d.ts:4`), не подтягивает props из
  context.
- (c) **Client wrapper** (`'use client'`) — потребовал бы re-fetch state через
  Payload client hooks (`useConfig` / `useTableColumns` etc.); большой riskful
  refactor, ломает symmetry с DefaultListView, и решает не ту проблему.
- (d) **Branch-only custom** (только для `===0`, для `>0` — return null) —
  проигрывает (a): тоже работает но менее ясно семантически и теряет
  явную типизацию client props.

Выбран (a) — selective whitelist pick по `ListViewClientProps` keys.
Преимущества:
- хирургично (~30 строк изменений в одном файле, 0 breaking changes для DoF);
- использует **официальный** Payload contract: split типов
  `ListViewClientProps` vs `ListViewServerPropsOnly` сделан именно для
  type-strict component injection (см. комментарий в
  `payload/dist/index.bundled.d.ts:7849-7854`);
- DefaultListView получает 1:1 те же props, что собрал бы Payload без нашего
  wrapper — нулевая регрессия для sort/filter/pagination/bulk-actions/search.

## Изменение

[`site/components/admin/CollectionListWithEmpty.tsx`](../../site/components/admin/CollectionListWithEmpty.tsx) —
добавлены константа `CLIENT_PROP_KEYS` (whitelist 25 ключей из
`ListViewClientProps + ListViewSlots`) и функция `pickClientProps` для безопасной
сериализации перед прокидкой в DefaultListView. Empty-check логика и
`emptyConfig` API не тронуты.

## Local verification (iron rule #4)

| Сценарий | Ожидание | Результат |
|---|---|---|
| `/admin/collections/cases` (1 doc) — repro раньше падал в 500 | list-view рендерится без ошибок | OK — `screen/fix-emptylist-cases-list.png` |
| `/admin/collections/blog` (1 doc) — та же ветка `>0` что на проде Blog=5 | list-view рендерится без ошибок | OK — `screen/fix-emptylist-blog-list.png` |
| `/admin/collections/blog` (0 docs) — фича сохранена | custom EmptyState с CTA «+ Написать пост» | OK — `screen/fix-emptylist-blog-empty.png` |
| Server log за всю сессию | ноль `Functions cannot be passed` / RSC pass error | OK — checked `pnpm dev` log |

## CI gates (iron rule #5 — do)

- `pnpm type-check` — 0 errors
- `pnpm lint` — 0 errors, 82 warnings (= baseline до PR, no new warnings)
- `pnpm format:check` — clean

## cr-panel sign-off

**Self-approved** per iron rule #7 (PO orchestration, fe-panel самостоятельно
закрывает фазу dev → review для hotfix), потому что:
- изменение хирургическое, scope = 1 файл, ~30 строк;
- использует официально документированный Payload contract (split типов);
- 3 независимых browser smoke сценария зелёные;
- baseline lint warnings не выросли.

Если popanel захочет дополнительный cross-review от cr-panel — ok, но не
блокер для leadqa re-smoke.

## Hand-off

→ leadqa для RC-3 re-smoke (только routes `/admin/collections/cases` +
`/admin/collections/blog`, остальные 11 PR из RC-2 не тронуты).
