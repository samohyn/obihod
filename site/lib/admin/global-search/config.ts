/**
 * PANEL-GLOBAL-SEARCH (ADR-0013) — config-driven описание коллекций для
 * SQL UNION ALL запроса.
 *
 * Добавление новой коллекции в global search = добавление одной записи сюда.
 * Не трогать SQL builder напрямую.
 */

export interface SearchCollectionConfig {
  /** Payload collection slug (для post-filter access check). */
  collectionSlug:
    | 'leads'
    | 'services'
    | 'service-districts'
    | 'cases'
    | 'blog'
    | 'b2b-pages'
    | 'authors'
    | 'districts'
    | 'pages'
    | 'sub-services'
  /** Postgres table name. */
  table: string
  /** Русский label для группы в dropdown (brand-guide §13 TOV). */
  groupLabel: string
  /** SQL expression для title (что показываем в результате). Без LOWER. */
  titleExpr: string
  /** SQL expression для subtitle (метаданные). Может быть NULL. */
  subtitleExpr: string
  /**
   * SQL expression для матчинга (LOWER + COALESCE), должен совпадать с
   * выражением в GIN trgm index — иначе planner не использует индекс.
   */
  matchExpr: string
  /**
   * URL prefix в admin для edit-view. Финальный URL — `${editUrlPrefix}${id}`.
   */
  editUrlPrefix: string
  /**
   * Исключаем удалённое: заявки в архиве (archived_at), контент в корзине (deleted_at).
   * Фильтрация published-only нежелательна — admin ищет и черновики.
   */
  whereExtra?: string
}

/**
 * Порядок групп в dropdown (UX): сначала «горячие» admin-целевые
 * (Leads, Services), затем контент, в конце справочники.
 */
const NOT_TRASHED = 'deleted_at IS NULL'

export const SEARCH_COLLECTIONS: SearchCollectionConfig[] = [
  {
    collectionSlug: 'leads',
    table: 'leads',
    groupLabel: 'Заявки',
    titleExpr: `COALESCE(name, phone, 'Заявка #' || id::text)`,
    subtitleExpr: `phone`,
    matchExpr: `LOWER(COALESCE(name, '') || ' ' || COALESCE(phone, ''))`,
    editUrlPrefix: '/admin/collections/leads/',
    whereExtra: 'archived_at IS NULL',
  },
  {
    collectionSlug: 'services',
    table: 'services',
    groupLabel: 'Услуги',
    titleExpr: `COALESCE(title, slug)`,
    subtitleExpr: `slug`,
    matchExpr: `LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))`,
    editUrlPrefix: '/admin/collections/services/',
    whereExtra: NOT_TRASHED,
  },
  {
    collectionSlug: 'service-districts',
    table: 'service_districts',
    groupLabel: 'Услуга × Район',
    titleExpr: `COALESCE(computed_title, 'SD #' || id::text)`,
    subtitleExpr: `NULL::varchar`,
    matchExpr: `LOWER(COALESCE(computed_title, ''))`,
    editUrlPrefix: '/admin/collections/service-districts/',
    whereExtra: NOT_TRASHED,
  },
  {
    collectionSlug: 'cases',
    table: 'cases',
    groupLabel: 'Кейсы',
    titleExpr: `COALESCE(title, slug)`,
    subtitleExpr: `slug`,
    matchExpr: `LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))`,
    editUrlPrefix: '/admin/collections/cases/',
    whereExtra: NOT_TRASHED,
  },
  {
    collectionSlug: 'blog',
    table: 'blog',
    groupLabel: 'Блог',
    titleExpr: `COALESCE(title, slug)`,
    subtitleExpr: `slug`,
    matchExpr: `LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))`,
    editUrlPrefix: '/admin/collections/blog/',
    whereExtra: NOT_TRASHED,
  },
  {
    collectionSlug: 'b2b-pages',
    table: 'b2b_pages',
    groupLabel: 'B2B',
    titleExpr: `COALESCE(title, slug)`,
    subtitleExpr: `slug`,
    matchExpr: `LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))`,
    editUrlPrefix: '/admin/collections/b2b-pages/',
    whereExtra: NOT_TRASHED,
  },
  {
    collectionSlug: 'authors',
    table: 'authors',
    groupLabel: 'Авторы',
    titleExpr: `COALESCE(full_name, slug)`,
    subtitleExpr: `slug`,
    matchExpr: `LOWER(COALESCE(full_name, '') || ' ' || COALESCE(slug, ''))`,
    editUrlPrefix: '/admin/collections/authors/',
    whereExtra: NOT_TRASHED,
  },
  {
    collectionSlug: 'districts',
    table: 'districts',
    groupLabel: 'Районы',
    titleExpr: `COALESCE(name_nominative, slug)`,
    subtitleExpr: `slug`,
    matchExpr: `LOWER(COALESCE(name_nominative, '') || ' ' || COALESCE(slug, ''))`,
    editUrlPrefix: '/admin/collections/districts/',
    whereExtra: NOT_TRASHED,
  },
  {
    collectionSlug: 'pages',
    table: 'pages',
    groupLabel: 'Страницы',
    titleExpr: `COALESCE(title, slug)`,
    subtitleExpr: `slug`,
    matchExpr: `LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))`,
    editUrlPrefix: '/admin/collections/pages/',
    whereExtra: NOT_TRASHED,
  },
  {
    collectionSlug: 'sub-services',
    table: 'sub_services',
    groupLabel: 'Подуслуги',
    titleExpr: `COALESCE(title, slug)`,
    subtitleExpr: `slug`,
    matchExpr: `LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))`,
    editUrlPrefix: '/admin/collections/sub-services/',
    whereExtra: NOT_TRASHED,
  },
]
