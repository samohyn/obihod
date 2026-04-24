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
