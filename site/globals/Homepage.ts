import type { GlobalConfig } from 'payload'

/**
 * Homepage — global для контента главной страницы (`/`).
 *
 * EPIC-HOMEPAGE-MIGRATION Phase 2 (ADR-0017).
 * Phase 1 portировал mockup → site/ с захардкоженным контентом.
 * Phase 2 вытаскивает контент в admin без визуального drift через graceful
 * degradation: если global ещё не seed'нут или поле пустое — section показывает
 * Phase 1 fallback значения.
 *
 * Группы полей (8) — соответствуют секциям §01-§11 mockup-а:
 * - hero (§01)
 * - steps (§03 — 5 шагов «как мы работаем»)
 * - pricingTable (§04 — 7 строк с иконками)
 * - photoSmetaCard (§05 — example image + range)
 * - reviewSources (§07 — 4 source-tile)
 * - reviews (§07 — 6 review cards)
 * - documents (§08 — 8 trust-cards с photo-превью)
 * - faq (§10 — 8 Q&A)
 * - gallery (§09.5 — 8 photos)
 *
 * §02 Services / §06 Cases / §09 Coverage — отдельные коллекции (live wiring).
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Главная страница',
  admin: {
    description: 'Контент главной страницы / (Hero, FAQ, отзывы, документы, галерея)',
    group: '01 · Контент',
  },
  access: { read: () => true },
  fields: [
    // ─────── §01 Hero ───────
    {
      name: 'hero',
      type: 'group',
      label: '§01 · Hero',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          defaultValue: '§ 01 · Хозяйственные работы · Москва и МО',
        },
        {
          name: 'titleMain',
          type: 'text',
          required: true,
          defaultValue: 'Удаление деревьев',
          admin: { description: 'Первая строка H1' },
        },
        {
          name: 'titleAccent',
          type: 'text',
          required: true,
          defaultValue: 'в Москве и МО',
          admin: { description: 'Вторая строка H1, выделяется amber-цветом' },
        },
        {
          name: 'subhead',
          type: 'text',
          defaultValue: 'И ещё 3 направления: чистка крыш, вывоз мусора, демонтаж',
        },
        {
          name: 'lead',
          type: 'textarea',
          defaultValue:
            'Фикс-цена за объект, страховка 5 млн ₽, штрафы ГЖИ берём на себя по договору.',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Hero-фото (1200×630+ для LCP). Сейчас: hero-arborist-v1.jpg' },
        },
        {
          name: 'trustBullets',
          type: 'array',
          label: 'Trust-bullets (3 штуки)',
          minRows: 3,
          maxRows: 3,
          defaultValue: [
            { value: '12 лет', label: 'на рынке хозяйственных работ в Москве и МО' },
            { value: '5 млн ₽', label: 'страхование ответственности в Ингосстрахе' },
            { value: '1 200+', label: 'объектов в портфолио с актами и фото-отчётами' },
          ],
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'textarea', required: true },
          ],
        },
      ],
    },
    // ─────── §03 Steps ───────
    {
      name: 'steps',
      type: 'array',
      label: '§03 · Шаги «Как мы работаем»',
      minRows: 5,
      maxRows: 5,
      defaultValue: [
        {
          title: 'Заявка',
          sla: '15 мин · диспетчер',
          description:
            'Отвечаем на звонок или сообщение в WhatsApp / Telegram. Уточняем задачу, район.',
        },
        {
          title: 'Выезд',
          sla: 'бесплатно · в день обращения',
          description:
            'Замерщик приезжает на объект по согласованному времени. Без предоплаты, без обязательств.',
        },
        {
          title: 'Смета',
          sla: 'фикс на 14 дней',
          description:
            'Письменная смета с разбивкой работ. Цена в смете = цена в договоре. Доплат не бывает.',
        },
        {
          title: 'Работа',
          sla: 'по графику · с фото-отчётом',
          description:
            'Бригада в фирменной одежде, со страховкой и сертификатами. В день работы — фото в чат.',
        },
        {
          title: 'Оплата + гарантия',
          sla: 'после акта · 12 мес',
          description:
            'Оплата налом / картой / СБП / счёт юрлицу. Сертификат с печатью и страховым полисом.',
        },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'sla', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    // ─────── §04 PricingTable ───────
    {
      name: 'pricingRows',
      type: 'array',
      label: '§04 · Прайс-таблица (7 строк)',
      defaultValue: [
        {
          name: 'Спил дерева до 10 м',
          desc: 'С автовышки или альпинистом, со страховкой 5 млн ₽. С удалением пня — отдельно.',
          priceFrom: 4500,
          unit: '/ дерево',
          link: '/arboristika/spil-derevev/',
        },
        {
          name: 'Аварийное удаление 10-25 м',
          desc: 'Дерево упало или висит — приедем в течение 4 часов в МО, 2 часов в Москве. Каблинг при необходимости.',
          priceFrom: 12000,
          unit: '/ дерево',
          link: '/arboristika/avarijnoe/',
        },
        {
          name: 'Чистка крыши от снега',
          desc: 'Со снеговалом и сосульками. С автовышки или промальпом — выбираем по геометрии и доступу.',
          priceFrom: 25,
          unit: '/ м²',
          link: '/chistka-krysh/ot-snega/',
        },
        {
          name: 'Контейнер 7-8 м³',
          desc: 'Привезём, оставим на 2-7 дней, вывезем с актом на полигон. Бытовой / строительный / смешанный мусор.',
          priceFrom: 5500,
          unit: '/ объект',
          link: '/vyvoz-musora/kontejner/',
        },
        {
          name: 'Газель + грузчики 2 чел.',
          desc: '3 часа работы. Старая мебель, бытовая техника, садовый мусор, крупногабарит.',
          priceFrom: 4800,
          unit: '/ ходка',
          link: '/vyvoz-musora/gazel/',
        },
        {
          name: 'Демонтаж бани, сарая',
          desc: 'Каркасное / брусовое / щитовое строение. С вывозом отходов в одном договоре.',
          priceFrom: 25000,
          unit: '/ объект',
          link: '/demontazh/saraj/',
        },
        {
          name: 'Снос дома до 100 м²',
          desc: 'Деревянный или каркасный одноэтажный. С разрешительными документами и вывозом.',
          priceFrom: 85000,
          unit: '/ объект',
          link: '/demontazh/dom/',
        },
      ],
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'desc', type: 'textarea', required: true },
        {
          name: 'priceFrom',
          type: 'number',
          required: true,
          admin: { description: 'Цена «от» в рублях' },
        },
        {
          name: 'unit',
          type: 'text',
          required: true,
          admin: { description: '/ дерево, / м², / объект и т.д.' },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          admin: { description: 'Внутренний URL, начиная с /' },
        },
      ],
    },
    // ─────── §05 PhotoSmeta example ───────
    {
      name: 'photoSmeta',
      type: 'group',
      label: '§05 · Фото→смета — пример',
      fields: [
        { name: 'exampleId', type: 'text', defaultValue: '№ 0044' },
        {
          name: 'exampleImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'smeta-birch-emergency.jpg' },
        },
        {
          name: 'exampleCaption',
          type: 'text',
          defaultValue: 'ФОТО · Аварийная берёза 18 м\nСНТ Берёзовая роща, Истра',
        },
        {
          name: 'exampleRecognized',
          type: 'text',
          defaultValue: 'берёза, ~18 м, аварийный наклон 25°',
        },
        { name: 'exampleRangeMin', type: 'number', defaultValue: 12800 },
        { name: 'exampleRangeMax', type: 'number', defaultValue: 16400 },
      ],
    },
    // ─────── §07 Review sources ───────
    {
      name: 'reviewSources',
      type: 'array',
      label: '§07 · Источники отзывов (4)',
      minRows: 4,
      maxRows: 4,
      defaultValue: [
        { name: 'Я.Карты', rating: 4.9, reviewCount: 128 },
        { name: '2ГИС', rating: 4.8, reviewCount: 42 },
        { name: 'Авито', rating: 4.9, reviewCount: 31 },
        { name: 'NPS', rating: 98, reviewCount: 100, isNps: true },
      ],
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'rating',
          type: 'number',
          required: true,
          admin: { description: 'Например 4.9 (или 98 для NPS)' },
        },
        {
          name: 'reviewCount',
          type: 'number',
          required: true,
          admin: { description: 'Кол-во отзывов (или /100 для NPS)' },
        },
        {
          name: 'isNps',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'NPS-tile отображается как «98 / 100», не звёзды' },
        },
      ],
    },
    // ─────── §07 Reviews ───────
    {
      name: 'reviews',
      type: 'array',
      label: '§07 · Отзывы (6)',
      defaultValue: [
        {
          author: 'Мария К.',
          meta: 'Истра · Я.Карты · 14 апр 2026',
          text: '«Сфоткала упавшую берёзу — через 8 минут пришёл ответ в WhatsApp. Приехали через день, всё убрали за 3 часа, увезли пенёк. Цена точно как в смете.»',
        },
        {
          author: 'Виктор С.',
          meta: 'Раменское · Я.Карты · 6 апр 2026',
          text: '«Демонтаж старой бани с вывозом. Бригада в форме, договор на месте, страховка. Сертификат с печатью отдали вместе с актом.»',
        },
        {
          author: 'Анна Л.',
          meta: 'FM · посёлок Красногорск · 2ГИС · 3 апр 2026',
          text: '«Заключили годовой договор на крыши и арбо. Один менеджер на всё, штрафы ГЖИ они забрали в свой риск, а это — главное для нас.»',
        },
        {
          author: 'Николай Ф.',
          meta: 'Одинцово · Авито · 22 мар 2026',
          text: '«Пять лет искал нормального арбориста. Тут — фото отправил в чат, через 10 минут ответили. Сделали ровно как обещали.»',
        },
        {
          author: 'Елена Г.',
          meta: 'Мытищи · Я.Карты · 18 мар 2026',
          text: '«Чистка крыши. Приехали ровно в обещанное время, сделали акт, прислали фото до и после. Никто не пытался впарить дополнительные услуги.»',
        },
        {
          author: 'Дмитрий К.',
          meta: 'Химки · УК · 2ГИС · 15 мар 2026',
          text: '«Восемь домов под управлением. Четвёртый сезон с Обиходом. По вывозу мусора закрыли вопрос с ОАТИ полностью.»',
        },
      ],
      fields: [
        { name: 'author', type: 'text', required: true },
        {
          name: 'meta',
          type: 'text',
          required: true,
          admin: { description: 'Местность · Источник · Дата' },
        },
        { name: 'text', type: 'textarea', required: true, admin: { description: 'Цитата' } },
      ],
    },
    // ─────── §08 Documents ───────
    {
      name: 'documents',
      type: 'array',
      label: '§08 · Документы доверия (8)',
      defaultValue: [
        { title: 'СРО · Свидетельство о допуске', meta: 'Актуально · ИНГ-РЕГИОН · 1 млрд ₽' },
        { title: 'Страховка ответственности', meta: 'Актуально · Ингосстрах · 5 млн ₽' },
        { title: 'Сертификаты бригадиров', meta: '8 человек · альп. 2-3 разряд' },
        { title: 'ЕГРЮЛ · ООО «Обиход»', meta: 'с 2020 · 12 лет на рынке' },
        { title: 'Парк техники', meta: '2× автовышки · 4× газели · дробилка' },
        { title: '152-ФЗ · Оператор ПД', meta: 'Реестр Роскомнадзора · с 2024' },
        { title: 'Утилизация по 89-ФЗ', meta: 'Лицензированный полигон · акты' },
        { title: '44/223-ФЗ · Госзакупки', meta: 'Аккредитация ЕИС · с 2025' },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'meta',
          type: 'text',
          required: true,
          admin: { description: 'Подпись под названием' },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Превью документа. Сейчас: doc-*.jpg в /img-generated/' },
        },
      ],
    },
    // ─────── §10 FAQ ───────
    {
      name: 'faq',
      type: 'array',
      label: '§10 · FAQ (8 вопросов)',
      defaultValue: [
        {
          question: 'Какая гарантия на работы?',
          answer:
            '12 месяцев по сертификату. Если в течение года всплывёт что-то связанное с нашей работой — приедем и переделаем. Дополнительно — страхование ответственности на 5 млн ₽ в Ингосстрахе по каждому объекту.',
        },
        {
          question: 'Что входит в фикс-цену, что считается дополнительно?',
          answer:
            'В смете указаны все работы, материалы, расходники, погрузка и вывоз отходов. Дополнительно — только услуги, которых не было в смете и которые согласованы новым договором. «Доплата за непредвиденное» — не наша история.',
        },
        {
          question: 'Какие документы передаём заказчику?',
          answer:
            'Договор, смета, акт выполненных работ, сертификат с номером, копия страхового полиса. Для B2B — ЭДО, счёт-фактура, форма КС-2/КС-3 по запросу.',
        },
        {
          question: 'Как работает «фото → смета за 10 минут»?',
          answer:
            'Загрузите фото объекта в форму или пришлите в WhatsApp / Telegram / MAX. AI распознаёт тип, размеры, состояние; диспетчер уточняет вручную. В течение 10 минут возвращается диапазон цены, зафиксированный на 14 дней. Точная смета — после бесплатного замера на объекте.',
        },
        {
          question: 'Работаете в выходные и праздники?',
          answer:
            'Да. Плановые работы — по согласованию (выходной с надбавкой 20%). Аварийный выезд — 24/7 без надбавок: дерево упало на крышу, прорвало кровлю снегом, аварийный демонтаж. SLA в МО — 2 часа.',
        },
        {
          question: 'Кто выезжает — штатные или подрядчики?',
          answer:
            'Штатная бригада в фирменной одежде хвойного цвета. У бригадира — сертификаты СРО, у альпинистов — корочки 3-й категории. Договор подписывается с ООО «Обиход», не с физлицом.',
        },
        {
          question: 'Принимаете ли оплату по безналу?',
          answer:
            'Да. Физлица — наличными, картой через терминал, СБП по QR. Юрлица — безнал по счёту с НДС. Аванс — обычно 30%, окончательный — после подписания акта. Без аванса — для постоянных B2B-клиентов.',
        },
        {
          question: 'Что если смета не подойдёт?',
          answer:
            'Замер бесплатный. Если посчитаем смету и она вам не подойдёт — за выезд ничего не платите. Никаких «штрафов за вызов» или «компенсаций топлива». Замерщик уехал — отношения завершены без обязательств.',
        },
      ],
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    // ─────── §09.5 Gallery ───────
    {
      name: 'gallery',
      type: 'array',
      label: '§09.5 · Галерея (8 фото)',
      defaultValue: [
        {
          caption: 'Альпинизм · спил берёзы 20 м · Истра',
          alt: 'Арборист-альпинист на высоте 20 м',
        },
        {
          caption: 'Автовышка АГП-22 · кронирование сосны · Одинцово',
          alt: 'Автовышка на спиле дерева',
        },
        { caption: 'Корчевание пня фрезой · дуб 80 см · Раменское', alt: 'Фрезерование пня' },
        { caption: 'Чистка крыши · снег + наледь · посёлок Мытищи', alt: 'Чистка крыши от снега' },
        { caption: 'Контейнер 8 м³ · строительный мусор · Химки', alt: 'Контейнер вывоз мусора' },
        {
          caption: 'Снос деревянного сарая · вывоз в одном договоре · Пушкино',
          alt: 'Демонтаж сарая',
        },
        {
          caption: 'Кронирование сада · яблони 20 лет · Жуковский',
          alt: 'Кронирование яблоневого сада',
        },
        {
          caption: 'Бригада 4 человека · уборка после спила · Красногорск',
          alt: 'Бригада Обихода за работой',
        },
      ],
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'gal-*.jpg' } },
        { name: 'caption', type: 'text', required: true },
        {
          name: 'alt',
          type: 'text',
          required: true,
          admin: { description: 'Alt для accessibility' },
        },
      ],
    },
  ],
}
