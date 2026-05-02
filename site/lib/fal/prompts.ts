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
  /**
   * Run 2 (Stage 1 W6): explicit visual concept overrides default «conceptual
   * illustration» framing. Используется для blog covers с object-focused
   * композицией (smartphone, документ КоАП, разрешение и т.п.) — без людей.
   */
  visualConcept?: string
}

export function blogCoverPrompt(o: BlogCoverPromptOpts): string {
  const moodLine =
    o.mood === 'practical'
      ? 'clean how-to editorial feel, practical, informative'
      : o.mood === 'seasonal'
        ? 'seasonal atmospheric mood, evocative light'
        : 'editorial magazine cover style, calm'
  // Если задан visualConcept — используем DOCUMENTARY_STYLE + anti-people + ANTI_STOCK
  // (Run 2 контракт). Иначе legacy ветка (Run 0) — STYLE_BASE + topic-based prompt.
  if (o.visualConcept) {
    return [
      DOCUMENTARY_STYLE,
      o.visualConcept,
      `editorial cover for an article about: ${o.topic}`,
      'Russian suburban context, Moscow Region setting',
      moodLine,
      '16:9 composition with clear focal subject and breathing space',
      'no humans, no figures, no silhouettes, no people in frame, no faces, no hands close-up',
      'no axe, no chainsaw, no power saws, no aggressive tools in frame',
      ANTI_STOCK,
      NEGATIVE_DEFAULT,
    ].join(', ')
  }
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
// Stage 1 W5: home hero (Главная).
//
// art consistency rule: home hero — landmark/object only direction,
// БЕЗ людей в кадре. Согласовано с pillar/district/USP visuals (Run 1).
// Cohesion: МО suburban panorama showing variety (trees, roof, dacha) —
// визуальный аналог 4-в-1 USP (4 pillar в одном кадре через объекты).
// Палитра: brand greens + amber muted (NOT eco-leaf cliché).
// ─────────────────────────────────────────────────────────────────

/**
 * Hero для главной страницы `/`. Object-focused МО suburban panorama at
 * golden hour — через визуальное разнообразие объектов поддерживает narrative
 * 4-в-1 (видны trees, roof, dacha area, fences). Caregiver+Ruler — спокойная
 * компетентная атмосфера, не «эко-обещание».
 */
export function homeHeroPrompt(): string {
  return [
    DOCUMENTARY_STYLE,
    'wide cinematic panorama of a Moscow Region suburban property at golden hour: in foreground a private wooden house with a pitched metal roof, mature deciduous trees casting long warm shadows on green grass, in mid-ground a small wooden garden shed and plain wooden fence, in background more low-rise dacha-style houses and tree line, soft amber-warm sunlight from low sun on the right',
    'no people, no figures, no silhouettes, no creatures, no animals',
    'muted brand palette — warm amber sunlight, deep greens of foliage, weathered grey-brown wood tones, soft blue-grey sky',
    'no eco-leaf cliché, no exaggerated green saturation, no fake glow, no lens flare overload',
    'no power tools, no chainsaw, no axe, no equipment in frame, no debris',
    'Moscow Region, Russia, late summer or early autumn, calm peaceful atmosphere, real depth, atmospheric haze in background',
    'cinematic 16:9 framing with breathing space, clear focal hierarchy, real material textures',
    ANTI_STOCK,
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
  /**
   * Дополнительная подсказка по визуальному контексту района (без узнаваемых
   * landmarks — flux/schnell их фабрикует). Например: «mature trees + low-rise
   * houses», «residential building в фоне», «dachi-style fences».
   */
  landmarkHint?: string
}

/**
 * Hero для District Hub `/raiony/<district>/`.
 * Landmark-only direction (R1 решение: вариант B, district-hub.md §Art changes).
 * Без бригады в кадре — гибрид «landmark + бригада» деградирует в catalog-shot и
 * ломает brand-guide §14 (документальный стиль, не туристическая открытка).
 * Гео-сигнал держится через eyebrow + H1 + alt-text, не через постановку.
 */
export function districtHeroPrompt(o: DistrictHeroOpts): string {
  const sceneByCluster: Record<ServiceCluster, string> = {
    arboristika:
      'mature trees on a private suburban property — old apple trees, pine trees, no people, late afternoon light',
    krishi:
      'pitched roof of a suburban cottage covered in fresh snow, no people visible, soft winter daylight',
    musor:
      'clean dump truck parked at a private house gate, no people in frame, neutral mid-day light',
    demontazh:
      'old wooden shed on a private lot, ready for demolition, no people, overcast soft light',
  }
  const scene = o.cluster
    ? sceneByCluster[o.cluster]
    : 'Moscow Region suburb street, low-rise houses, fences, mature trees, daylight, no people in frame'
  return [
    DOCUMENTARY_STYLE,
    scene,
    `${o.districtName} district, Moscow Region, Russia, recognizable suburban context (low-rise houses, mixed dachas)`,
    o.landmarkHint,
    o.season ? SEASON[o.season] : SEASON.summer,
    'real МО suburban details (mixed roofs, fences, trees), no fake recognizable landmarks',
    'no humans, no figures, no silhouettes, no people in frame',
    ANTI_STOCK,
    NEGATIVE_DEFAULT,
  ]
    .filter(Boolean)
    .join(', ')
}

export type B2bSegment = 'uk-tszh' | 'fm' | 'zastrojschiki' | 'goszakaz'

export type B2bHeroOpts = {
  segment: B2bSegment
}

/**
 * Hero для B2B-сегмент-страниц `/b2b/<segment>/`.
 * Inspection / site-walk / clipboard situations без рукопожатий и key-handoff'ов
 * (brand-guide §14 anti: «постановочные лица», «рукопожатия = corporate cliché»,
 * «Рыцарь / щит / герб»). Caregiver+Ruler — спокойная ответственность, не «вызов на ринг».
 */
export function b2bHeroPrompt(o: B2bHeroOpts): string {
  const sceneBySegment: Record<B2bSegment, string> = {
    'uk-tszh':
      'site inspection at a multi-storey residential courtyard: brigade leader in branded blue uniform reviewing a service checklist on clipboard, property manager (woman in business-casual) standing nearby looking at the same checklist, no handshake, no posed gestures, focused-warm but matter-of-fact',
    fm: 'commercial property walkthrough: brigade leader in branded blue uniform pointing at service entrance maintenance details, facility manager taking notes on tablet, low-rise office building visible, no handshake, no key-handoff',
    zastrojschiki:
      'construction site coordination: brigade leader in branded blue uniform with hi-vis vest reviewing printed site plans on a portable table with a project engineer, half-built suburban housing in soft background, no handshake, no posed gestures',
    goszakaz:
      'municipal site inspection: brigade leader in branded blue uniform examining a public service yard with a municipal contracts officer holding documents, both looking at the same area, no handshake, formal but unstaged',
  }
  return [
    DOCUMENTARY_STYLE,
    sceneBySegment[o.segment],
    'business-formal but not stiff, real working setting, no boardroom backdrop',
    'Moscow Region, Russia, late morning daylight',
    'no handshakes, no key handoffs, no posed corporate gestures, no over-the-top corporate smile, no green-leaf eco-cliche',
    ANTI_STOCK,
    NEGATIVE_DEFAULT,
  ].join(', ')
}

// ─────────────────────────────────────────────────────────────────
// Stage 1 W4: pillar hero (4 услуги) + USP /foto-smeta/.
//
// art consistency rule (Stage 0 R1): pillar hero — landmark/object only,
// БЕЗ людей в кадре. Это согласует pillar visual с districts visual
// (`districtHeroPrompt` тоже landmark-only). Геo-сигнал и социальный
// proof — через eyebrow + H1 + alt-text, не через постановку бригады.
//
// Anti-§14 brand-guide: no stock-photo, no eco-leaf cliché, no axe/saw
// macho, no knight/shield. Caregiver+Ruler — спокойная компетентность.
// ─────────────────────────────────────────────────────────────────

export type PillarHeroOpts = {
  service: 'vyvoz-musora' | 'arboristika' | 'chistka-krysh' | 'demontazh'
  season?: keyof typeof SEASON
}

/**
 * Hero для pillar-страниц `/vyvoz-musora/`, `/arboristika/`, `/chistka-krysh/`,
 * `/demontazh/`. Landmark/object-only direction (no humans).
 * Согласовано с art Stage 0 R1: pillar visual = districts visual.
 */
export function pillarHeroPrompt(o: PillarHeroOpts): string {
  const sceneByService: Record<PillarHeroOpts['service'], string> = {
    'vyvoz-musora':
      'a clean professional dump truck loaded with construction debris (broken drywall, wooden boards, plastic bags) parked at the gate of a private suburban house, no people in frame, mid-day daylight, suburban context — fence, mature trees, low-rise neighbourhood',
    arboristika:
      'mature trees on a private suburban property — old oak, pine and birch standing tall over a wooden house, no people, late afternoon golden light, real wear on bark, leaves on the ground',
    'chistka-krysh':
      'pitched metal roof of a suburban cottage covered with fresh heavy snow and long icicles hanging over the eaves, no people in frame, soft winter daylight, real cold-day atmosphere',
    demontazh:
      'a small simple wooden garden house in a tidy quiet backyard, weathered grey-brown vertical planks, plain pitched slate roof, single closed door, surrounded by short green grass, plain wooden fence across the back, mature deciduous trees behind the fence, overcast soft daylight, peaceful empty composition, completely clean surroundings, nothing on the roof, nothing on the walls, nothing on the ground next to it',
  }
  return [
    DOCUMENTARY_STYLE,
    sceneByService[o.service],
    'Moscow Region, Russia',
    o.season ? SEASON[o.season] : SEASON.summer,
    'no humans, no figures, no silhouettes, no people in frame, no creatures, no characters, no toys, no mascots, no figurines',
    'no chainsaw, no axe, no power tools, no sledgehammer, no construction tools, no equipment in frame',
    ANTI_STOCK,
    NEGATIVE_DEFAULT,
  ].join(', ')
}

/**
 * Hero для USP-pillar `/foto-smeta/`.
 * Object-focused: smartphone + printed estimate на столе, без лиц.
 * Поддерживает narrative «3 фото → смета за 10 минут» через визуальные объекты.
 */
export function uspFotoSmetaPrompt(): string {
  return [
    DOCUMENTARY_STYLE,
    'overhead still-life composition: a smartphone lying flat on a wooden table, its screen out of focus and intentionally unreadable, next to it a sheet of paper with abstract horizontal lines and number-like glyphs (not actual words), a pen, a small ceramic mug, soft directional window light from the right',
    'shallow depth of field, neutral muted palette (warm wood, white paper, cool grey phone)',
    'absolutely no humans, no faces, no hands, no fingers, no figures, no silhouettes, no creatures',
    'no readable text in any language, no visible letters, no words on the paper, no app names on the phone screen — only abstract document-like shapes and blurred glyphs that suggest a price list without spelling anything',
    'no logos, no brand names, no UI mockups',
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
