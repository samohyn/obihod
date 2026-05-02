/**
 * CLI для локальной генерации через fal.ai.
 * Запуск: pnpm fal:gen <useCase> [--json '<jsonParams>']
 *
 * Примеры:
 *   pnpm fal:gen hero --json '{"cluster":"arboristika","districtName":"Раменское","season":"winter"}'
 *   pnpm fal:gen og --json '{"cluster":"krishi","mood":"urgent"}'
 *   pnpm fal:gen case-viz --json '{"cluster":"musor","stage":"after"}'
 *   pnpm fal:gen blog-cover --json '{"topic":"когда спиливать берёзу","mood":"seasonal"}'
 *
 * Требует FAL_KEY в .env.local (tsx подхватывает через --env-file).
 */
import { generateByUseCase, type UseCase } from '../lib/fal/generators'

const USE_CASES: UseCase[] = [
  'hero',
  'og',
  'case-viz',
  'blog-cover',
  'pillar-hero',
  'usp-foto-smeta',
]

function parseArgs(argv: string[]): { useCase: UseCase; params: Record<string, unknown> } {
  const [, , useCase, ...rest] = argv
  if (!useCase || !USE_CASES.includes(useCase as UseCase)) {
    console.error(`Usage: pnpm fal:gen <${USE_CASES.join('|')}> --json '<params>'`)
    process.exit(1)
  }
  const jsonIdx = rest.indexOf('--json')
  const jsonStr = jsonIdx >= 0 ? rest[jsonIdx + 1] : '{}'
  let params: Record<string, unknown>
  try {
    params = JSON.parse(jsonStr ?? '{}')
  } catch (e) {
    console.error('Invalid --json argument:', (e as Error).message)
    process.exit(1)
  }
  return { useCase: useCase as UseCase, params }
}

async function main() {
  const { useCase, params } = parseArgs(process.argv)
  console.log(`→ fal.ai: ${useCase}`, params)
  const t0 = Date.now()
  const result = await generateByUseCase(useCase, params)
  const ms = Date.now() - t0
  console.log(`✓ done in ${ms}ms`)
  for (const img of result.images ?? []) {
    console.log(`  ${img.url}`)
  }
}

main().catch((err) => {
  console.error('✗ fal.ai generation failed:', err)
  process.exit(1)
})
