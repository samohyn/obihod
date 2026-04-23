import { fal } from '@fal-ai/client'

let configured = false

function ensureConfigured() {
  if (configured) return
  const key = process.env.FAL_KEY
  if (!key) {
    throw new Error('FAL_KEY is not set. Add it to site/.env.local or server shared/.env')
  }
  fal.config({ credentials: key })
  configured = true
}

export type FalImage = {
  url: string
  width?: number
  height?: number
  content_type?: string
}

export type FalImageResult = {
  images: FalImage[]
  seed?: number
  has_nsfw_concepts?: boolean[]
  prompt?: string
}

export async function falRun<T = FalImageResult>(
  model: string,
  input: Record<string, unknown>,
): Promise<T> {
  ensureConfigured()
  const { data } = await fal.subscribe(model, { input, logs: false })
  return data as T
}
