# art-brief-ux — Homepage v2 (детальный brief для роли `ux`)

**EPIC:** [EPIC-HOMEPAGE-V2](../EPIC-HOMEPAGE-V2/README.md) · **US:** [US-13](intake.md) → US-15 ux-wireframes · **From:** art → **To:** ux · **Дата:** 2026-05-03

> Контекст и общий direction — см. [art-brief.md](art-brief.md). Здесь — конкретные deliverables и спеки для `ux`.

---

## 1. Что я (`art`) ожидаю от тебя (`ux`)

Концепт **Direction 1 «Фотосмета»** утверждён. Твоя задача — спроектировать пользовательский путь и взаимодействия для 3 целевых персон, а также wireframe-низкоуровневую разметку для 4 новых блоков и 5 redesign-секций.

### Deliverables (артефакт `ux-wireframes.md` в US-15)

1. **CJM (Customer Journey Map) для 3 персон** (см. §2 ниже).
2. **Wireframes (low-fi)** для 4 новых блоков + 5 redesign — desktop + mobile.
3. **Interaction specs** для PhotoSmeta drop-zone (states / errors / mobile camera).
4. **Cross-link логика** PhotoSmeta ↔ Calculator (когнитивная нагрузка).
5. **Mobile-flow Coverage** (горизонтальный scroll vs accordion для 12 chip).
6. **Dual-mode CtaFooter** (drop-zone + классическая форма).
7. **A11y checklist** — WCAG AA для всех новых блоков.

### Skill-check (iron rule #1)

`ux` frontmatter skills включают `[ui-ux-pro-max, accessibility, design-system]`. Активируй: **ui-ux-pro-max** (UX guidelines), **accessibility** (WCAG 2.2 AA + ARIA), **design-system** (сверка с brand-guide §10 Nav + §11 Notifications).

---

## 2. CJM для 3 персон

### Персона 1 · Мария, 38, владелица дачи в Истре

**Контекст:** Унаследовала дачу 6 лет назад. Прошлой осенью бурелом, две берёзы упали на забор. Боится высоты, нет техники. Гуглит «спил деревьев Истра» в субботу вечером с телефона.

**Цели:** быстро понять цену + увидеть что компания реально приедет в Истру + не быть «кинутой» (страх дешёвых-завышение).

**Frustrations:**
- Конкуренты пишут «от 1000 ₽» — она не верит.
- Не знает диаметр / высоту дерева — не может пользоваться слайдер-калькулятором.
- Боится что приедут и припишут лишнее.

**Journey:**
1. Google «спил деревьев Истра» → лендинг главной.
2. Hero: видит «Фото → смета → 12 800 ₽ → бригада, 10 минут». Ключевая мысль: «о, можно фоткой!»
3. CertificateBand: «5 млн страховка / 12 мес гарантия / 0 ₽ выезд» — снимает страх «кинут».
4. PhotoSmeta: открывает drop-zone, фотографирует берёзу с телефона (mobile camera), видит примерный диапазон 12-16 тыс ₽ + штамп «фикс на 14 дней» — **conversion event**.
5. Coverage: убеждается что Истра в списке (chip-карточка `Истра · 28 КМ ОТ МКАД · 4 кейса`).
6. Cases: видит реальный кейс «аварийные берёзы у дома, 18 м · Истра · 14 200 ₽».
7. Закрывает с уверенностью «они приедут, не кинут, цена реальная».

**Что важно для UX:**
- Mobile-first PhotoSmeta drop-zone (камера → фото → результат).
- Coverage должен быть виден до Cases (хочет проверить географию РАНЬШЕ чем выбирать кейс).
- Hero CTA должна быть jelly-finger размером (mobile touch ≥44px).

### Персона 2 · Виктор, 62, частный дом, посёлок около Раменского

**Контекст:** Купил дом 2 года назад. На участке заросший сад, хочет демонтировать старую баню. Использует ноутбук, относится к «русскому интернету» с подозрением. В семье говорят «найди подрядчика, который договор подпишет».

**Цели:** найти серьёзную компанию + увидеть формальные обязательства (страховка, договор) + понять что не «гастарбайтеры с топорами».

**Frustrations:**
- Тильда-сайты конкурентов выглядят как «лохотрон».
- «От 1000 ₽» = триггер недоверия.
- Не понимает AI / не любит «модные штучки».

**Journey:**
1. Знакомый посоветовал «обиход.ру». Открывает с ноутбука.
2. Hero: видит документальное фото бригады в фирменной форме (хвойного цвета, не stock). Снимает первое возражение «лохотрон».
3. CertificateBand: «5 млн страховка / штрафы ГЖИ на нас» — это для него ключевая mind-shift.
4. PhotoSmeta: видит, но **скорее пройдёт мимо** (не хочет AI). Нормально — должен быть Calculator-fallback для него.
5. Calculator (§05): использует слайдеры, прикидывает цену демонтажа бани.
6. How: 5 шагов SLA — «Звонок → Смета → Работа → Фото → Гарантия» — это для него **trust-anchor**.
7. Guarantees: 6 гарантий с цифрами и AmberSeal — закрывает «не гастарбайтеры».
8. B2B-bridge / B2B-full: пройдёт мимо (не его аудитория) — ОК.
9. CtaFooter (dual-mode): использует **классическую форму** «телефон + комментарий», а не drop-zone.

**Что важно для UX:**
- Cross-link PhotoSmeta → Calculator должен быть видимым (для тех кто не хочет фоткать).
- CtaFooter dual-mode — обязательный (классическая форма как fallback для не-AI-аудитории).
- Документальная фотография бригад на ≥3 экранах главной (Hero / Cases / Team) — снимает страх «лохотрон».

### Персона 3 · Анна, 34, FM-менеджер коттеджного посёлка под Красногорском

**Контекст:** Управляет посёлком на 28 домов. Каждый сезон — арбо + чистка крыш + вывоз мусора. Сейчас работает с 3 разными подрядчиками. Хочет 1-в-1 контракт + фикс-стоимость + ответственность за штрафы. Открывает сайт с рабочего ноутбука в офисе.

**Цели:** найти подрядчика 4-в-1 + договорные условия + кейсы B2B + контактное лицо для КП.

**Frustrations:**
- Конкуренты ориентированы на B2C, B2B оффер не выделен.
- Нет понятных кейсов «обслуживание посёлка».
- Дольше «прорываться» к B2B-офферу.

**Journey:**
1. Поисковик «обслуживание посёлка подрядчик Красногорск» → лендинг главной.
2. Hero: «4-в-1» — это уже хороший сигнал.
3. CertificateBand: «штрафы ГЖИ на нас» — **это для неё conversion-trigger**.
4. PhotoSmeta: интересно, но прокручивает (для B2C; ей нужны контракт-условия).
5. Coverage: проверяет Красногорск — есть chip с «N кейсов» — отлично.
6. **B2BBridge (§07):** «Управляющая компания, посёлок, застройщик? Берём штрафы ГЖИ → /b2b/» — **она кликнет туда**, не дочитывая главную.
7. (на /b2b/ — но это уже не наш scope, подытоживает поиск).

**Что важно для UX:**
- B2BBridge на 7-й позиции (§07) — раннее раскрытие B2B без занятия большого экрана. Ключевое для конверсии.
- B2B-full на 13-й позиции (§13) — для тех B2B, кто дочитывает страницу. Третья карточка «УК / ТСЖ / FM / Госзакупки» — обязательна.
- Cases с visible-меткой `B2B` — даёт ей пример «обслуживание посёлка».

---

## 3. Interaction specs · PhotoSmeta drop-zone

### States

| State | Trigger | UI | Copy | A11y |
|---|---|---|---|---|
| **idle** | initial | Border 2px dashed primary, иконка Camera 48px, текст «Перетащите фото или нажмите». | «Перетащите фото» | aria-label «Загрузить фото для оценки» |
| **dragover** | dragenter | Border solid primary, bg `--c-bg-alt`, иконка анимирована (легкое pulse). | «Отпустите файл» | aria-live="polite" |
| **uploading** | file selected | Progress bar янтарный, текст «Загружаем…» + filename. | «Загружаем 8 фото · 50%» | aria-busy="true" |
| **processing** | upload done | Spinner + mono-timer «00:08», текст «AI распознаёт объект». | «Распознаём объект…» | aria-live="polite" |
| **success** | AI output | Output-card появляется (slide-in 200ms), galочка `--c-success`. | «Готово · смета 12-16 тыс ₽» | aria-live="polite" + focus to result |
| **error** | upload fail / AI fail | Border `--c-error`, иконка AlertCircle, ретрай-кнопка. | «Не удалось распознать. Попробовать снова?» | aria-live="assertive" + role="alert" |
| **fallback** | пользователь не хочет фото | Cross-link на Calculator. | «Знаешь параметры? → Точный калькулятор слайдерами» | tabindex=0 |

### File acceptance

- **Accept:** image/jpeg, image/png, image/heic, image/webp.
- **Max size:** 10 MB на фото, до 8 фото за раз.
- **Validation:** на client-side preview + server-side validation в Server Action.

### Mobile camera flow

- На мобильных вместо drag-and-drop — крупная btn-accent «Сфотографировать» с `<input type="file" accept="image/*" capture="environment">` (rear camera default).
- Galleries fallback: «Выбрать из галереи» как secondary link.
- Touch-target ≥48×48px.

### Errors / edge cases

| Случай | UX |
|---|---|
| User uploads PDF / video | Inline-error «Только фото · JPG, PNG, HEIC, WebP» |
| User uploads >8 photos | Confirm modal «Распознаём первые 8» / «Выбрать другие» |
| User uploads >10MB photo | Auto-resize client-side если возможно, иначе error |
| AI fails to recognize | Fallback: «Не распознали. Менеджер посмотрит вручную → форма» (открывает classic form в CtaFooter) |
| Network timeout >30s | Toast warning «Долго грузим — продолжать?» + cancel option |
| User leaves mid-upload | Confirm beforeunload «Загрузка не завершена» |

---

## 4. Cross-link логика PhotoSmeta ↔ Calculator

**Когнитивная нагрузка** — оба блока «оценка цены», но через разные механики. Mitigation:

- **Жёстко разные eyebrow:**
  - §03 «Фото → смета · 10 минут» (USP-якорь)
  - §05 «Точный калькулятор · слайдеры» (отстройка)
- **Cross-link микро-копия:**
  - В §03 PhotoSmeta под левой колонкой: «Знаешь параметры? → Точный калькулятор слайдерами →» (ghost-link на #calc)
  - В §05 Calculator (eyebrow или sub): «Не знаешь объём? → Пришли фото →» (ghost-link на #foto-smeta)
- **Tertiary: Header CTA** ведёт ТОЛЬКО на §03 PhotoSmeta (не на Calculator).

Tradeoff: дополнительный когнитивный шаг для «знаю параметры → калькулятор» — но это secondary path, primary должен быть «фото за 10 мин».

---

## 5. Mobile-flow Coverage (§06)

**Desktop (≥768):** горизонтальный scroll-snap-mandatory с 12 chip-карточками. Видно ~3-4 chip, остальное по scroll.

**Tablet (768-1024):** 3 columns × 4 rows grid (статичный, без scroll).

**Mobile (<768):**
- **Вариант A (рекомендую):** 2 columns grid (6 rows). Все 12 chip видны при прокрутке.
- **Вариант B:** Accordion с топ-7 priority A видимыми, priority B скрыты под `[+ ещё 5 районов ▼]`.

**Тестируемое решение:** Вариант A проще и доступнее. Если макет на 12 chip × 2 columns читается перегружено — переключение на accordion.

**Под сеткой:** ссылка `+ ещё 62 района по запросу → /raiony/` (полный список).

---

## 6. Dual-mode CtaFooter (§16)

**Layout desktop (2-column):**
- Слева: drop-zone «Загрузить фото → смета за 10 мин» (mini-version §03 PhotoSmeta).
- Справа: классическая мини-форма (телефон + опциональный комментарий + кнопка «Получить ответ»).
- Разделитель `или` посередине (Mono UPPERCASE muted).

**Layout mobile:**
- Сверху: drop-zone (primary).
- Под ним: разделитель `или у вас нет фото? Заполните форму ниже`.
- Снизу: классическая форма.

**Submit logic:**
- Drop-zone → переход на `/foto-smeta/?upload=true` или Server Action (зависит от §3 решения PhotoSmeta).
- Classic form → POST /api/leads → Payload Leads collection + Telegram async.

**A11y:**
- Caption у форм-разделителя: aria-label «Альтернативный способ заявки».
- Form errors inline + aria-live="polite".
- Submit success: focus to confirmation (success-card §11 brand-guide).

---

## 7. A11y checklist (WCAG 2.2 AA)

Для каждого блока проверь:

- [ ] **Контраст** ≥4.5:1 для body text, ≥3:1 для headings (см. brand-guide §5 Contrast).
- [ ] **Touch target** ≥44×44px (WCAG 2.5.5) — все кнопки, ссылки, chip-карточки.
- [ ] **Focus visible** — outline 2px accent на focus.
- [ ] **Keyboard navigation** — Tab/Shift+Tab, Enter/Space на CTA, Esc на modal.
- [ ] **Screen reader** — semantic HTML, aria-label у иконок, alt у фото.
- [ ] **Reduced motion** — `prefers-reduced-motion: reduce` отключает translateY / parallax / автокликер PhotoSmeta-output.
- [ ] **Skip-link** — обязательный (iron rule §33).
- [ ] **Form labels** — все поля LeadForm имеют `<label>` или aria-label.
- [ ] **Error messages** — role="alert" + aria-live="assertive" для критических, "polite" для info.
- [ ] **Color independence** — статус не передаётся ТОЛЬКО цветом (badge `B2C`/`B2B` имеет текст, не только цвет).

---

## 8. Деливериз → передача `art`

После твоих wireframes:
1. `art` review каждого wireframe + CJM по brand-guide §10 Nav + §11 Notifications.
2. Если в гайде нет нужного паттерна — `art` дополняет brand-guide через PR в `design/integration` (§35 Homepage layout).
3. После approve `art` → передача в US-16 (sa-site → fe-site верстка).

## 9. Открытые вопросы (если есть — пинг art через cpo)

1. **PhotoSmeta-output preview:** реальный AI-output на главной (вызов Claude API через Server Action) vs UI-демо (статичная карточка)? Решение влияет на UX state-machine (см. §3) — реальный AI = больше состояний, демо = только idle/success-loop.
2. **Coverage горизонтальный scroll vs grid mobile:** твоя рекомендация после wireframe-теста.
3. **B2B-bridge клик:** uri ведёт на `/b2b/` индекс или сразу на сегментированный `/b2b/{auto-detect}/`? Зависит от availability персонализации в Payload (US-18).
4. **CJM 4-я персона:** добавить ли «застройщик / девелопер 30-50»? Если их пользовательский путь сильно отличается от Анны (FM-менеджер) — добавь, иначе оставляем 3.
