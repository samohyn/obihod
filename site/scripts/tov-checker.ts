/**
 * TOV-checker для контента Обихода (US-0 Track C, AC-5).
 *
 * Двухэтапная проверка:
 *   1) Regex pre-filter — anti-TOV паттерны из brand-guide §13/§14/§18.
 *      Источник правды: scripts/tov-anti-patterns.json (cw правит без правки кода).
 *   2) Опциональный LLM-pass (Sonnet 4.6 + prompt caching, skill `claude-api`)
 *      на конкретику цифр (правило §13 #2: цифра + единица обязательны). obihod:ok
 *      Включается флагом --llm и переменной ANTHROPIC_API_KEY.
 *
 * Использование:
 *   pnpm tov:check --file path/to/file.md
 *   pnpm tov:check --stdin                 # из stdin
 *   echo "текст" | pnpm tov:check --stdin
 *
 * Exit codes:
 *   0 — clean
 *   1 — есть error-нарушения (блокер)
 *   2 — только warn-нарушения (предупреждение, не блокер; для CI — ок)
 *
 * Whitelist: маркер `obihod:ok` на той же строке отключает регекс.
 *
 * Подключение:
 *   - .github/workflows/ci.yml — добавлен job `tov-check`
 *   - локально: запускается вручную перед PR
 *
 * Skill `claude-api` активируется при использовании --llm. Prompt caching
 * обязателен на ≥1024 токенов system prompt (правила §13/§14 + примеры).
 */

import { readFileSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

type Severity = 'error' | 'warn'

type Pattern = {
  id: string
  regex: string
  category: string
  severity: Severity
  hint?: string
}

type AntiPatterns = {
  _meta: Record<string, unknown>
  patterns: Pattern[]
}

type Violation = {
  file: string
  line: number
  column: number
  patternId: string
  severity: Severity
  category: string
  match: string
  context: string
  hint?: string
}

const WHITELIST_MARKER = 'obihod:ok'
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PATTERNS_PATH = resolve(SCRIPT_DIR, 'tov-anti-patterns.json')

function loadPatterns(): AntiPatterns {
  const raw = readFileSync(PATTERNS_PATH, 'utf-8')
  const parsed = JSON.parse(raw) as AntiPatterns
  if (!Array.isArray(parsed.patterns) || parsed.patterns.length === 0) {
    throw new Error('tov-anti-patterns.json: patterns[] пустой или отсутствует')
  }
  return parsed
}

function compilePatterns(p: AntiPatterns): { pattern: Pattern; re: RegExp }[] {
  return p.patterns.map((pat) => {
    // caps-rus и подобные case-sensitive паттерны помечаются по id —
    // флаг `i` делает регекс нечувствительным к регистру и ломает их.
    const caseSensitive = pat.id === 'caps-rus'
    const flags = caseSensitive ? 'gu' : 'giu'
    return {
      pattern: pat,
      re: new RegExp(pat.regex, flags),
    }
  })
}

function scanText(
  text: string,
  filename: string,
  compiled: { pattern: Pattern; re: RegExp }[],
): Violation[] {
  const lines = text.split(/\r?\n/)
  const out: Violation[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    if (line.includes(WHITELIST_MARKER)) continue
    for (const { pattern, re } of compiled) {
      // reset due to /g state
      re.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = re.exec(line)) !== null) {
        const start = m.index
        const matched = m[0]
        const ctxStart = Math.max(0, start - 20)
        const ctxEnd = Math.min(line.length, start + matched.length + 20)
        out.push({
          file: filename,
          line: i + 1,
          column: start + 1,
          patternId: pattern.id,
          severity: pattern.severity,
          category: pattern.category,
          match: matched,
          context: line.slice(ctxStart, ctxEnd).trim(),
          hint: pattern.hint,
        })
        // защита от zero-length бесконечного цикла
        if (m[0].length === 0) re.lastIndex++
      }
    }
  }
  return out
}

function readStdin(): Promise<string> {
  return new Promise((res, rej) => {
    let buf = ''
    process.stdin.setEncoding('utf-8')
    process.stdin.on('data', (chunk) => (buf += chunk))
    process.stdin.on('end', () => res(buf))
    process.stdin.on('error', rej)
  })
}

function parseArgs(argv: string[]): {
  files: string[]
  stdin: boolean
  llm: boolean
  glob?: string
} {
  const args = argv.slice(2)
  const files: string[] = []
  let stdin = false
  let llm = false
  let glob: string | undefined
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--stdin') stdin = true
    else if (a === '--llm') llm = true
    else if (a === '--file') files.push(args[++i] ?? '')
    else if (a === '--glob') glob = args[++i]
    else if (a && !a.startsWith('--')) files.push(a)
  }
  return { files: files.filter(Boolean), stdin, llm, glob }
}

function formatViolation(v: Violation): string {
  const tag = v.severity === 'error' ? 'ERROR' : 'WARN '
  const where = `${v.file}:${v.line}:${v.column}`
  const hint = v.hint ? `\n   hint: ${v.hint}` : ''
  return `[${tag}] ${where}  [${v.patternId}/${v.category}]\n   match: «${v.match}»\n   ctx:   …${v.context}…${hint}`
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- параметры используются в US-1 реализации
async function llmPass(_text: string, _filename: string): Promise<Violation[]> {
  // Заглушка LLM-пасса. Реальный вызов появится в US-1 после первой prod-волны
  // эталонов W3 (когда определимся с promptом / cache-стратегией). Сейчас:
  //   - skill `claude-api` зафиксирован в jsdoc сверху;
  //   - prompt caching будет включён в реализации (cache_control: ephemeral
  //     на system prompt с правилами §13/§14, ≥1024 токенов);
  //   - выход — массив Violation с severity=warn (LLM-pass не блокирует
  //     CI единолично, только дополняет regex слой).
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      '[tov-checker] --llm требует ANTHROPIC_API_KEY; LLM-pass пропущен (regex слой остаётся активным).',
    )
    return []
  }
  console.error(
    '[tov-checker] --llm: реализация в US-1 (skill `claude-api` + prompt caching). Сейчас no-op.',
  )
  return []
}

async function main() {
  const opts = parseArgs(process.argv)
  const patterns = loadPatterns()
  const compiled = compilePatterns(patterns)

  const inputs: { name: string; text: string }[] = []

  if (opts.stdin) {
    const text = await readStdin()
    inputs.push({ name: '<stdin>', text })
  }

  for (const f of opts.files) {
    const abs = resolve(f)
    try {
      const text = readFileSync(abs, 'utf-8')
      inputs.push({ name: relative(process.cwd(), abs), text })
    } catch (e) {
      console.error(`[tov-checker] не прочитал ${abs}: ${(e as Error).message}`)
      process.exit(1)
    }
  }

  if (opts.glob) {
    // node 22 имеет fs.glob, но для совместимости используем простой поиск:
    // если кто-то передаст --glob — подсказываем пользоваться shell-expansion.
    console.error(
      '[tov-checker] --glob не реализован в US-0; используйте shell expansion: pnpm tov:check site/content/**/*.md',
    )
    process.exit(1)
  }

  if (inputs.length === 0) {
    console.error(
      'Использование: pnpm tov:check --file <path> [--file <path2> …] | --stdin | <files…>',
    )
    process.exit(1)
  }

  const allViolations: Violation[] = []
  for (const { name, text } of inputs) {
    const v = scanText(text, name, compiled)
    allViolations.push(...v)
    if (opts.llm) {
      const llmV = await llmPass(text, name)
      allViolations.push(...llmV)
    }
  }

  const errors = allViolations.filter((v) => v.severity === 'error')
  const warns = allViolations.filter((v) => v.severity === 'warn')

  if (allViolations.length === 0) {
    console.log(
      `[tov-checker] чисто: ${inputs.length} файл(ов), 0 нарушений из ${patterns.patterns.length} паттернов.`,
    )
    process.exit(0)
  }

  for (const v of allViolations) {
    console.log(formatViolation(v))
    console.log('')
  }

  console.log('---')
  console.log(
    `[tov-checker] итого: ${errors.length} error, ${warns.length} warn (паттернов: ${patterns.patterns.length}, файлов: ${inputs.length}).`,
  )
  console.log(
    'Whitelist: добавьте `obihod:ok` на той же строке, чтобы отключить регекс (для цитат конкурентов / учебных материалов).',
  )

  if (errors.length > 0) process.exit(1)
  process.exit(2)
}

main().catch((e) => {
  console.error('[tov-checker] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
