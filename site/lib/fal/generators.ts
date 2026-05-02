import { falRun, type FalImageResult } from './client'
import {
  blogCoverPrompt,
  caseVizPrompt,
  companyAuthorAvatarPrompt,
  districtHeroPrompt,
  heroPrompt,
  homeHeroPrompt,
  ogPrompt,
  pillarHeroPrompt,
  sdHeroPrompt,
  staticHeroPrompt,
  uspFotoSmetaPrompt,
  type BlogCoverPromptOpts,
  type CaseVizPromptOpts,
  type CompanyAuthorAvatarOpts,
  type DistrictHeroOpts,
  type HeroPromptOpts,
  type OgPromptOpts,
  type PillarHeroOpts,
  type SdHeroOpts,
  type StaticHeroOpts,
} from './prompts'

// Flux Schnell — быстрый и дешёвый (≈$0.003/img, 4 шагов).
// Flux Dev — выше качество (≈$0.025/img). Переключаем через override.
const MODEL_DEFAULT_T2I = 'fal-ai/flux/schnell'
const MODEL_DEFAULT_I2I = 'fal-ai/flux/dev/image-to-image'

type ImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9'

type BaseOpts = {
  model?: string
  imageSize?: ImageSize
  seed?: number
  numImages?: number
}

async function runT2I(prompt: string, o: BaseOpts = {}): Promise<FalImageResult> {
  return falRun<FalImageResult>(o.model ?? MODEL_DEFAULT_T2I, {
    prompt,
    image_size: o.imageSize ?? 'landscape_16_9',
    num_inference_steps: 4,
    num_images: o.numImages ?? 1,
    seed: o.seed,
    enable_safety_checker: true,
  })
}

export async function generateHero(o: HeroPromptOpts & BaseOpts): Promise<FalImageResult> {
  return runT2I(heroPrompt(o), o)
}

export async function generateOg(o: OgPromptOpts & BaseOpts): Promise<FalImageResult> {
  return runT2I(ogPrompt(o), { imageSize: 'landscape_16_9', ...o })
}

export async function generateBlogCover(
  o: BlogCoverPromptOpts & BaseOpts,
): Promise<FalImageResult> {
  return runT2I(blogCoverPrompt(o), { imageSize: 'landscape_16_9', ...o })
}

// Case visualization: text-to-image для честного мока before/after.
// Если передан sourceImageUrl — image-to-image от того же before → after.
export async function generateCaseViz(
  o: CaseVizPromptOpts & BaseOpts & { sourceImageUrl?: string; strength?: number },
): Promise<FalImageResult> {
  const prompt = caseVizPrompt(o)
  if (o.sourceImageUrl) {
    return falRun<FalImageResult>(o.model ?? MODEL_DEFAULT_I2I, {
      prompt,
      image_url: o.sourceImageUrl,
      strength: o.strength ?? 0.75,
      num_inference_steps: 28,
      num_images: o.numImages ?? 1,
      seed: o.seed,
      image_size: o.imageSize ?? 'landscape_16_9',
      enable_safety_checker: true,
    })
  }
  return runT2I(prompt, o)
}

export async function generatePillarHero(o: PillarHeroOpts & BaseOpts): Promise<FalImageResult> {
  return runT2I(pillarHeroPrompt(o), { imageSize: 'landscape_16_9', ...o })
}

export async function generateUspFotoSmeta(o: BaseOpts = {}): Promise<FalImageResult> {
  return runT2I(uspFotoSmetaPrompt(), { imageSize: 'landscape_16_9', ...o })
}

export async function generateDistrictHero(
  o: DistrictHeroOpts & BaseOpts,
): Promise<FalImageResult> {
  return runT2I(districtHeroPrompt(o), { imageSize: 'landscape_16_9', ...o })
}

export async function generateHomeHero(o: BaseOpts = {}): Promise<FalImageResult> {
  return runT2I(homeHeroPrompt(), { imageSize: 'landscape_16_9', ...o })
}

export async function generateSdHero(o: SdHeroOpts & BaseOpts): Promise<FalImageResult> {
  return runT2I(sdHeroPrompt(o), { imageSize: 'landscape_16_9', ...o })
}

export async function generateStaticHero(
  o: StaticHeroOpts & BaseOpts,
): Promise<FalImageResult> {
  return runT2I(staticHeroPrompt(o), { imageSize: 'landscape_16_9', ...o })
}

export async function generateAuthorAvatar(
  o: CompanyAuthorAvatarOpts & BaseOpts,
): Promise<FalImageResult> {
  return runT2I(companyAuthorAvatarPrompt(o), { imageSize: 'square', ...o })
}

export type UseCase =
  | 'hero'
  | 'og'
  | 'case-viz'
  | 'blog-cover'
  | 'pillar-hero'
  | 'usp-foto-smeta'
  | 'district-hero'
  | 'home-hero'
  | 'sd-hero'
  | 'static-hero'
  | 'author-avatar'

export async function generateByUseCase(
  useCase: UseCase,
  params: Record<string, unknown>,
): Promise<FalImageResult> {
  switch (useCase) {
    case 'hero':
      return generateHero(params as HeroPromptOpts & BaseOpts)
    case 'og':
      return generateOg(params as OgPromptOpts & BaseOpts)
    case 'case-viz':
      return generateCaseViz(
        params as CaseVizPromptOpts & BaseOpts & { sourceImageUrl?: string; strength?: number },
      )
    case 'blog-cover':
      return generateBlogCover(params as BlogCoverPromptOpts & BaseOpts)
    case 'pillar-hero':
      return generatePillarHero(params as PillarHeroOpts & BaseOpts)
    case 'usp-foto-smeta':
      return generateUspFotoSmeta(params as BaseOpts)
    case 'district-hero':
      return generateDistrictHero(params as DistrictHeroOpts & BaseOpts)
    case 'home-hero':
      return generateHomeHero(params as BaseOpts)
    case 'sd-hero':
      return generateSdHero(params as SdHeroOpts & BaseOpts)
    case 'static-hero':
      return generateStaticHero(params as StaticHeroOpts & BaseOpts)
    case 'author-avatar':
      return generateAuthorAvatar(params as CompanyAuthorAvatarOpts & BaseOpts)
  }
}
