/**
 * Тексты publish-gate ошибок.
 *
 * Один файл — `cw` правит без изменения логики хуков.
 * TOV: matter-of-fact, без капса, без восклицательных, глагол первым.
 * Sa-spec §5.3.
 */

export const publishGateMessages = {
  /** ServiceDistricts: ровно один Hero на странице. */
  heroExactlyOne: (count: number) =>
    `Страница не публикуется — нужен ровно один блок «Hero». Сейчас на странице: ${count}. Удалите лишний или добавьте недостающий.`,

  /** ServiceDistricts: ≥ 1 text-content с body ≥ 300 слов. */
  textMinWords: (currentMaxWords: number) =>
    `Страница не публикуется — нужен текст-блок от 300 слов. В самом длинном сейчас: ${currentMaxWords} слов. Дополните основной текст локальным контекстом района.`,

  /** ServiceDistricts: нужен LeadForm или CtaBanner. */
  contactRequired:
    'Страница не публикуется — нужен блок «Форма заявки» или «CTA-баннер». Без контакта клиент не сможет с тобой связаться.',

  /** Cases: нужно минимум 1 фото или видео. */
  caseMediaRequired:
    'Кейс не публикуется — нужно минимум 1 фото или видео. Это доказательство работы.',

  /** ServiceDistricts: специфика mini-case (старое правило, оставлено). */
  serviceDistrictsMiniCase:
    'Страница не публикуется — нет кейса из этого района. Без кейса Яндекс считает страницу шаблонной и не показывает в поиске.',

  /** ServiceDistricts: специфика local FAQ. */
  serviceDistrictsLocalFaq: (count: number) =>
    `Нужно минимум 2 локальных FAQ. Сейчас: ${count}. Добавьте недостающие.`,
} as const
