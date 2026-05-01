// Шаблоны промптов под 4 use-case Обихода.
// Все промпты на английском — Flux/Nano Banana сильнее на EN, чем на RU.

const NEGATIVE_DEFAULT =
  'no text, no watermark, no logos, no blurry, no oversaturated colors, no people faces close-up, no warped tools'

const STYLE_BASE =
  'professional documentary photograph, natural lighting, realistic, 35mm lens, shallow depth of field, high detail'

type ServiceCluster = 'arboristika' | 'krishi' | 'musor' | 'demontazh'

const SERVICE_SCENES: Record<ServiceCluster, string> = {
  arboristika:
    'certified arborist in safety harness pruning a large birch tree next to a private wooden house, chainsaw, ropes, green lawn',
  krishi:
    'worker with safety rope on a snowy pitched metal roof of a suburban cottage, clearing snow and ice with a shovel, winter morning',
  musor:
    'professional crew loading construction debris into a large dump truck in front of a private country house, bags, broken drywall',
  demontazh:
    'demolition crew dismantling an old wooden shed on a private lot, safety helmets, sledgehammer, visible structural work',
}

const SEASON: Record<string, string> = {
  winter: 'winter, soft snow on the ground, overcast sky',
  summer: 'summer, warm afternoon light, green foliage',
  autumn: 'autumn, golden leaves, soft diffused light',
  spring: 'early spring, bare trees, wet grass',
}

export type HeroPromptOpts = {
  cluster: ServiceCluster
  districtName?: string // Раменское / Одинцово
  season?: keyof typeof SEASON
  extra?: string
}

export function heroPrompt(o: HeroPromptOpts): string {
  const parts = [
    STYLE_BASE,
    SERVICE_SCENES[o.cluster],
    o.districtName ? `${o.districtName} district, Moscow Region, Russia` : 'Moscow Region, Russia',
    o.season ? SEASON[o.season] : SEASON.summer,
    o.extra,
    NEGATIVE_DEFAULT,
  ].filter(Boolean)
  return parts.join(', ')
}

export type OgPromptOpts = {
  cluster?: ServiceCluster
  mood?: 'calm' | 'urgent' | 'premium'
  extra?: string
}

// OG — плоский графичный фон с минимальной композицией, чтобы сверху наложить текст отдельным слоем.
export function ogPrompt(o: OgPromptOpts): string {
  const mood = o.mood ?? 'calm'
  const moodLine =
    mood === 'urgent'
      ? 'dramatic lighting, moody, hint of tension'
      : mood === 'premium'
        ? 'clean minimalist composition, soft neutral palette, premium editorial feel'
        : 'balanced composition, muted palette, trustworthy, calm'
  const scene = o.cluster
    ? SERVICE_SCENES[o.cluster]
    : 'suburban private house with a tidy yard, Russia'
  return [
    'editorial open-graph cover image, cinematic 16:9',
    scene,
    moodLine,
    'plenty of negative space on the left for typography overlay',
    o.extra,
    NEGATIVE_DEFAULT,
  ]
    .filter(Boolean)
    .join(', ')
}

export type CaseVizPromptOpts = {
  cluster: ServiceCluster
  stage: 'before' | 'after'
  extra?: string
}

export function caseVizPrompt(o: CaseVizPromptOpts): string {
  const beforeScene: Record<ServiceCluster, string> = {
    arboristika:
      'an overgrown old tree leaning dangerously over a private wooden house, cracked bark, dead branches',
    krishi:
      'a metal pitched roof of a suburban cottage covered with heavy compacted snow and icicles hanging over the edge',
    musor:
      'a private lot littered with construction debris, broken bricks, plastic bags, messy piles',
    demontazh: 'a dilapidated wooden shed with rotten boards, sagging roof, tools scattered around',
  }
  const afterScene: Record<ServiceCluster, string> = {
    arboristika:
      'a clean tidy yard after professional tree removal, fresh stump cleanly cut, branches chipped away, neat lawn',
    krishi:
      'same metal pitched roof now completely clear of snow and ice, clean edges, safe, visible morning sun',
    musor:
      'the same private lot now fully cleaned, empty, raked, ready for new work, debris removed',
    demontazh:
      'the same spot after full demolition and cleanup, empty leveled ground, no shed, tidy',
  }
  const scene = o.stage === 'before' ? beforeScene[o.cluster] : afterScene[o.cluster]
  return [STYLE_BASE, scene, 'Moscow Region private property', o.extra, NEGATIVE_DEFAULT]
    .filter(Boolean)
    .join(', ')
}

export type BlogCoverPromptOpts = {
  topic: string // free-form: "когда спиливать берёзу на участке"
  mood?: 'editorial' | 'practical' | 'seasonal'
}

export function blogCoverPrompt(o: BlogCoverPromptOpts): string {
  const moodLine =
    o.mood === 'practical'
      ? 'clean how-to editorial feel, practical, informative'
      : o.mood === 'seasonal'
        ? 'seasonal atmospheric mood, evocative light'
        : 'editorial magazine cover style, calm'
  return [
    STYLE_BASE,
    `conceptual illustration for an article about: ${o.topic}`,
    'Russian suburban context, private property setting',
    moodLine,
    '16:9 composition with clear focal subject and breathing space',
    NEGATIVE_DEFAULT,
  ].join(', ')
}

// ─────────────────────────────────────────────────────────────────
// US-0 Track C, AC-7: расширения под /raiony, /b2b, /avtory company.
//
// Anti-TOV защита (brand-guide §14):
//   - НЕТ stock-photo aesthetic, НЕТ overly polished smiles,
//   - НЕТ green-leaf eco-cliché, НЕТ axe/chainsaw macho,
//   - НЕТ матрёшек, НЕТ рукавиц-героев, НЕТ дровосеков.
// art apruvит стиль prompt-ов в W2 (см. AC-7.2).
// ─────────────────────────────────────────────────────────────────

const ANTI_STOCK =
  'no stock photo aesthetic, no overly polished smiles, no green-leaf eco-cliche, no axe or chainsaw macho, no matryoshka, no fake ethnic motifs, no logo overlays'

const DOCUMENTARY_STYLE =
  'documentary photograph, real wear on equipment, mid-action moment, muted cinematic palette, 3:2 framing, soft directional natural light, 35mm focal length, slight grain, real material textures'

export type DistrictHeroOpts = {
  districtName: string
  cluster?: ServiceCluster
  season?: keyof typeof SEASON
}

/**
 * Hero для District Hub `/raiony/<district>/`.
 * Бригада в фирменной форме на фоне characteristic-объекта района МО.
 * Без сезонной привязки по умолчанию (SEASON.summer) — переопределяется опцией.
 */
export function districtHeroPrompt(o: DistrictHeroOpts): string {
  const sceneByCluster: Record<ServiceCluster, string> = {
    arboristika:
      'arborist team in branded blue work uniform inspecting a mature tree on a private suburban property',
    krishi:
      'roof maintenance team in branded blue uniform with safety harness checking pitched roof of a suburban cottage',
    musor:
      'crew in branded blue uniform loading construction debris into a clean dump truck near a private house',
    demontazh:
      'demolition crew in branded blue uniform on a private lot, working calmly on an old wooden shed',
  }
  const scene = o.cluster
    ? sceneByCluster[o.cluster]
    : 'small crew in branded blue work uniform calmly walking through a Moscow Region suburb street, clipboard and tools at hand'
  return [
    DOCUMENTARY_STYLE,
    scene,
    `${o.districtName} district, Moscow Region, Russia, recognizable suburban context (low-rise houses, mixed dachas)`,
    o.season ? SEASON[o.season] : SEASON.summer,
    'no district landmarks fakery: keep generic suburban МО details (mixed roofs, fences, trees), brand legibility on uniform only',
    ANTI_STOCK,
    NEGATIVE_DEFAULT,
  ].join(', ')
}

export type B2bSegment = 'uk-tszh' | 'fm' | 'zastrojschiki' | 'goszakaz'

export type B2bHeroOpts = {
  segment: B2bSegment
}

/**
 * Hero для B2B-сегмент-страниц `/b2b/<segment>/`.
 * Конкретный сегмент → конкретная сцена встречи / handoff'a.
 */
export function b2bHeroPrompt(o: B2bHeroOpts): string {
  const sceneBySegment: Record<B2bSegment, string> = {
    'uk-tszh':
      'site visit at a multi-storey residential courtyard: brigade leader in branded blue uniform talking with a property manager (woman in business-casual), clipboard with contract, focused-warm but matter-of-fact expression',
    fm: 'commercial property handover: brigade leader in branded blue uniform handing keys/access to a facility manager near service entrance of a low-rise office building, both holding tablets',
    zastrojschiki:
      'construction site coordination: brigade leader in branded blue uniform with hi-vis vest discussing schedule with a project engineer over printed plans, half-built suburban housing in soft background',
    goszakaz:
      'municipal site inspection: brigade leader in branded blue uniform shaking hands with a municipal contracts officer near a public service yard, formal but unstaged',
  }
  return [
    DOCUMENTARY_STYLE,
    sceneBySegment[o.segment],
    'business-formal but not stiff, real working setting, no boardroom backdrop',
    'Moscow Region, Russia, late morning daylight',
    'no green-leaf eco-cliche, no over-the-top corporate smile, no posed gestures',
    ANTI_STOCK,
    NEGATIVE_DEFAULT,
  ].join(', ')
}

export type CompanyAuthorAvatarOpts = {
  /**
   * Роль для подсказки stylization (бригада / оператор и т.п.).
   * Влияет на постановку, не на лицо: лица не показываем намеренно.
   */
  roleName?: 'brigade' | 'operator' | 'arborist' | 'roofer' | 'driver'
  variant?: 'silhouette' | 'back-shot' | 'symbol'
}

/**
 * Аватар для company-page «Бригада вывоза Обихода» и оператора.
 * Намеренно НЕ показываем лицо — privacy + бренд (Caregiver+Ruler, не мачо).
 *
 * Три варианта:
 *   - silhouette: контурное изображение фигуры в форме на однотонном фоне
 *   - back-shot: фигура со спины в действии
 *   - symbol: предметный портрет (инструменты, рукавицы на стуле, пустая форма)
 */
export function companyAuthorAvatarPrompt(o: CompanyAuthorAvatarOpts = {}): string {
  const role = o.roleName ?? 'brigade'
  const variant = o.variant ?? 'back-shot'

  const subjectByRole: Record<NonNullable<CompanyAuthorAvatarOpts['roleName']>, string> = {
    brigade: 'three-person crew in branded blue work uniform',
    operator: 'single figure at a tidy office desk in branded blue uniform vest',
    arborist: 'climber figure in branded blue uniform with rope harness',
    roofer: 'figure on a snowy roof with safety harness, branded blue uniform',
    driver: 'figure leaning on the door of a clean dump truck, branded blue uniform',
  }

  const variantLine =
    variant === 'silhouette'
      ? 'pure silhouette against a soft solid background, no facial features, no skin detail, only outline and uniform colors'
      : variant === 'symbol'
        ? 'object-focused composition: clean tools, work gloves on a wooden bench, neat coiled rope, branded uniform jacket folded — no humans visible'
        : 'back-shot composition: figure facing away from camera, shoulders and uniform clearly readable, head intentionally cropped or in profile from behind'

  return [
    'editorial portrait for an author/team page on a Russian services website',
    subjectByRole[role],
    variantLine,
    'square 1:1 framing, soft directional light, real material textures, calm matter-of-fact mood',
    'Caregiver+Ruler brand voice: trustworthy, calm, in-control, not heroic',
    'no faces shown, no identifiable individuals, no celebrity look-alike',
    ANTI_STOCK,
    NEGATIVE_DEFAULT,
  ].join(', ')
}
