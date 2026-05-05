/**
 * JsonLdGraph — Schema.org @graph: Organization + LocalBusiness + WebSite + FAQPage + Service.
 * Source: newui/homepage-classic.html <script type="application/ld+json">.
 * Phase 2: AggregateRating и FAQ читать из SeoSettings + Homepage global.
 */
export function JsonLdGraph() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_GRAPH) }}
    />
  )
}

const LD_GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://obikhod.ru/#organization',
      name: 'Обиход',
      alternateName: 'ООО «Обиход»',
      url: 'https://obikhod.ru/',
      logo: 'https://obikhod.ru/logo.svg',
      telephone: '+7-495-000-00-00',
      email: 'hi@obikhod.ru',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Питомниковая, 3',
        addressLocality: 'Раменское',
        addressRegion: 'Московская область',
        postalCode: '140100',
        addressCountry: 'RU',
      },
      sameAs: [],
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://obikhod.ru/#localbusiness',
      name: 'Обиход — хозяйственные работы',
      image: 'https://obikhod.ru/og-cover.jpg',
      url: 'https://obikhod.ru/',
      telephone: '+7-495-000-00-00',
      priceRange: '₽₽',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Питомниковая, 3',
        addressLocality: 'Раменское',
        addressRegion: 'Московская область',
        postalCode: '140100',
        addressCountry: 'RU',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '55.5708',
        longitude: '38.2299',
      },
      areaServed: [
        { '@type': 'City', name: 'Москва' },
        { '@type': 'AdministrativeArea', name: 'Московская область' },
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '22:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '10:00',
          closes: '18:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.87',
        reviewCount: '201',
        bestRating: '5',
      },
      makesOffer: [
        {
          '@type': 'Offer',
          name: 'Удаление деревьев',
          price: '4500',
          priceCurrency: 'RUB',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '4500',
            priceCurrency: 'RUB',
            unitText: 'за дерево',
          },
        },
        {
          '@type': 'Offer',
          name: 'Чистка крыш от снега',
          price: '25',
          priceCurrency: 'RUB',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '25',
            priceCurrency: 'RUB',
            unitText: 'за м²',
          },
        },
        {
          '@type': 'Offer',
          name: 'Вывоз мусора',
          price: '5500',
          priceCurrency: 'RUB',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '5500',
            priceCurrency: 'RUB',
            unitText: 'за объект',
          },
        },
        {
          '@type': 'Offer',
          name: 'Демонтаж',
          price: '25000',
          priceCurrency: 'RUB',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '25000',
            priceCurrency: 'RUB',
            unitText: 'за объект',
          },
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://obikhod.ru/#website',
      url: 'https://obikhod.ru/',
      name: 'Обиход',
      publisher: { '@id': 'https://obikhod.ru/#organization' },
      inLanguage: 'ru-RU',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://obikhod.ru/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Какая гарантия на работы?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '12 месяцев по сертификату. Если в течение года всплывёт что-то связанное с нашей работой — приедем и переделаем. Дополнительно — страхование ответственности на 5 млн ₽ в Ингосстрахе по каждому объекту.',
          },
        },
        {
          '@type': 'Question',
          name: 'Что входит в фикс-цену, что считается дополнительно?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'В смете указаны все работы, материалы, расходники, погрузка и вывоз отходов. Дополнительно — только услуги, которых не было в смете и которые согласованы новым договором.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какие документы передаём заказчику?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Договор, смета, акт выполненных работ, сертификат с номером, копия страхового полиса. Для B2B — ЭДО, счёт-фактура, форма КС-2/КС-3 по запросу.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как работает «фото → смета за 10 минут»?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Загрузите фото объекта или пришлите в WhatsApp / Telegram / MAX. AI распознаёт тип, размеры, состояние; диспетчер уточняет вручную. В течение 10 минут возвращается диапазон цены, зафиксированный на 14 дней.',
          },
        },
        {
          '@type': 'Question',
          name: 'Работаете в выходные и праздники?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да. Плановые работы — по согласованию (выходной с надбавкой 20%). Аварийный выезд — 24/7 без надбавок. SLA в МО — 2 часа.',
          },
        },
        {
          '@type': 'Question',
          name: 'Кто выезжает — штатные или подрядчики?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Штатная бригада в фирменной одежде хвойного цвета. У бригадира — сертификаты СРО, у альпинистов — корочки 3-й категории. Договор подписывается с ООО «Обиход».',
          },
        },
        {
          '@type': 'Question',
          name: 'Принимаете ли оплату по безналу?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да. Физлица — наличными, картой через терминал, СБП по QR. Юрлица — безнал по счёту с НДС. Аванс — обычно 30%, окончательный — после подписания акта.',
          },
        },
        {
          '@type': 'Question',
          name: 'Что если смета не подойдёт?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Замер бесплатный. Если посчитаем смету и она вам не подойдёт — за выезд ничего не платите. Никаких «штрафов за вызов».',
          },
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://obikhod.ru/#service-arboristika',
      serviceType: 'Удаление деревьев и арбористика',
      provider: { '@id': 'https://obikhod.ru/#organization' },
      areaServed: [
        { '@type': 'City', name: 'Москва' },
        { '@type': 'AdministrativeArea', name: 'Московская область' },
      ],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '4500',
        availability: 'https://schema.org/InStock',
      },
    },
  ],
}
