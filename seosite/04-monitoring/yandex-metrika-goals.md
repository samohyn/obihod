# Я.Метрика goals — для конфигурации aemd

**Я.Метрика ID:** `108715562` (sustained, prod)
**Owner:** `aemd` через UI Я.Метрика
**Документ для:** US-10 EPIC-SEO-COMPETE-3 + W14 DoD AC-5 (Lead submissions ≥15/нед)

## 12 целей — список

### Lead-форма submissions (5 целей)

Все используют **JS event** через `ym(108715562, 'reachGoal', '<goal>')` в `LeadForm.tsx` после успешного `/api/leads` POST.

| # | Цель ID | Условия | Source URL | UTM Filter |
|---|---|---|---|---|
| 1 | `lead_form_homepage` | JS-event после submit | `/` | — |
| 2 | `lead_form_kontakty` | JS-event | `/kontakty/` | utm_source=kontakty |
| 3 | `lead_form_foto_smeta` | JS-event | `/kalkulyator/foto-smeta/` | utm_source=foto-smeta |
| 4 | `lead_form_pillar` | JS-event | `/<pillar>/` (любой 5 pillars) | utm_source=pillar |
| 5 | `lead_form_b2b` | JS-event | `/b2b/<doc>/` (любой 6 docs) | utm_source=b2b |

**Ценность goal:** 500 ₽ (примерная стоимость лида до квалификации)

### B2B PDF download events (6 целей)

Цель: отслеживать lead-magnet эффект (US-6 Track A с PDF templates). Срабатывает при клике на `<a download href="*.pdf">`.

| # | Цель ID | Условия (URL contains) |
|---|---|---|
| 6 | `b2b_pdf_porubochnyi_bilet` | `/b2b/porubochnyi-bilet.pdf` |
| 7 | `b2b_pdf_lesnaya_deklaratsiya` | `/b2b/lesnaya-deklaratsiya.pdf` |
| 8 | `b2b_pdf_akt_obsledovaniya` | `/b2b/akt-obsledovaniya-derevev.pdf` |
| 9 | `b2b_pdf_sro_vypiska` | `/b2b/sro-vypiska-shablony.pdf` |
| 10 | `b2b_pdf_fkko` | `/b2b/fkko-klassifikatsiya-othodov.pdf` |
| 11 | `b2b_pdf_fitosanitarnyi` | `/b2b/fitosanitarnyi-sertifikat.pdf` |

**Ценность:** 200 ₽ (PDF download = soft conversion, ниже lead-form)

### Calculator complete (1 цель)

| # | Цель ID | Условия |
|---|---|---|
| 12 | `foto_smeta_complete` | JS-event после photo upload + form submit complete на `/kalkulyator/foto-smeta/` |

**Ценность:** 1 000 ₽ (high-intent USP конверсия)

## UI инструкция (aemd)

1. Открыть https://metrika.yandex.ru/dashboard?id=108715562
2. **Настройки** → **Цели** → **Добавить цель** (12 раз)
3. Для каждой цели:
   - Тип: **JavaScript-событие** (для goals 1-5, 12) или **Просмотр страниц** с условием (для goals 6-11)
   - Идентификатор: точно как в таблице `lead_form_kontakty`, etc.
   - Ценность: per таблица (опционально)
4. Сохранить → проверить через **Отчёты** → **Цели** → **Реализация** (обновится через ~1 час после первого срабатывания)

## Wiring в коде (для seo-tech)

`site/components/blocks/LeadForm.tsx` после `/api/leads` 200:

```typescript
if (typeof window !== 'undefined' && (window as any).ym) {
  const goalId = inferGoalId(window.location.pathname, form.dataset.utm)
  ;(window as any).ym(108715562, 'reachGoal', goalId)
}
```

`site/components/marketing/B2BPdfDownload.tsx` (новый, US-6 follow-up):

```typescript
<a
  href={pdfUrl}
  download
  onClick={() => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      ;(window as any).ym(108715562, 'reachGoal', `b2b_pdf_${slug}`)
    }
  }}
>
  Скачать образец
</a>
```

Это всё **sustained для US-6 Phase 2** (когда B2B PDF templates готовы).

## Verify (post-merge)

1. Открыть `/kontakty/` в инкогнито
2. Заполнить форму + submit
3. Я.Метрика → Отчёты → Цели → Реализация: должен появиться `lead_form_kontakty` с counter +1
4. Если не виден после 1 часа — проверить console.log в DevTools (ym функция доступна?)
