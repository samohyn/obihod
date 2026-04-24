/**
 * Рендерит превью всех ServiceIcons на одном sheet'е + отдельные PNG-превью.
 * Запуск: pnpm tsx scripts/render-service-icons.ts
 */
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const OUT = resolve(__dirname, '../../design-system/icons/services')

// Иконки захардкожены — те же что в ServiceIcons.tsx.
// Переэкспорт TSX требует JSX-рендеринга в node, что тяжелее чем просто скопировать SVG.
const icons: Array<{ key: string; label: string; cluster: string; svg: string }> = [
  {
    key: 'spil',
    label: 'Спил',
    cluster: 'Арбористика',
    svg: `<path d="M12 3 L12 14"/><path d="M9 6 L12 3 L15 6"/><path d="M8 9 L12 6 L16 9"/><path d="M7 12 L12 9 L17 12"/><path d="M6 15 L18 15" stroke-dasharray="2 1.5"/><path d="M12 15 L12 21"/><path d="M9 21 L15 21"/>`,
  },
  {
    key: 'valka',
    label: 'Валка',
    cluster: 'Арбористика',
    svg: `<path d="M4 20 L20 20"/><g transform="rotate(35 10 18)"><path d="M10 9 L10 18"/><path d="M8 11 L10 9 L12 11"/><path d="M7.5 13 L10 11 L12.5 13"/><path d="M7 15 L10 13 L13 15"/></g><path d="M16 14 L20 14 L20 10"/><path d="M20 14 L17 17"/>`,
  },
  {
    key: 'stump',
    label: 'Корчевание',
    cluster: 'Арбористика',
    svg: `<ellipse cx="12" cy="10" rx="5" ry="1.5"/><path d="M7 10 L7 13"/><path d="M17 10 L17 13"/><path d="M7 13 C 9 14, 15 14, 17 13"/><circle cx="12" cy="10" r="1.6"/><path d="M6 16 C 5 17, 4 18, 3 19"/><path d="M9 16 L8 20"/><path d="M15 16 L16 20"/><path d="M18 16 C 19 17, 20 18, 21 19"/>`,
  },
  {
    key: 'prune',
    label: 'Обрезка',
    cluster: 'Арбористика',
    svg: `<path d="M12 13 L12 21"/><path d="M9 21 L15 21"/><path d="M5 13 C 5 8, 19 8, 19 13"/><path d="M5 5 L9 5" stroke-dasharray="1.5 1.2"/><path d="M9 5 L19 5" stroke-dasharray="1.5 1.2"/><path d="M8 8 L8 13"/><path d="M12 8 L12 13"/><path d="M16 8 L16 13"/><path d="M6 6 L8 8"/><path d="M18 6 L16 8"/>`,
  },
  {
    key: 'kabling',
    label: 'Каблинг',
    cluster: 'Арбористика',
    svg: `<path d="M6 3 L6 21"/><path d="M18 3 L18 21"/><path d="M6 10 C 9 9, 15 9, 18 10" stroke-dasharray="2 1.5"/><circle cx="6" cy="10" r="1.2" fill="currentColor"/><circle cx="18" cy="10" r="1.2" fill="currentColor"/><path d="M4 21 L8 21"/><path d="M16 21 L20 21"/>`,
  },
  {
    key: 'spray',
    label: 'Опрыскивание',
    cluster: 'Арбористика',
    svg: `<path d="M10 14 L14 14 L14 20 L10 20 Z"/><path d="M12 14 L12 10"/><path d="M10 10 L14 10 L14 8 L10 8 Z"/><path d="M6 6 L8 7"/><path d="M6 10 L8 10"/><path d="M6 14 L8 13"/><circle cx="4" cy="6" r="0.8"/><circle cx="4" cy="10" r="0.8"/><circle cx="4" cy="14" r="0.8"/>`,
  },
  {
    key: 'roof-snow',
    label: 'Снег с крыши',
    cluster: 'Крыши',
    svg: `<path d="M3 14 L12 6 L21 14"/><path d="M5 14 L5 20 L19 20 L19 14"/><circle cx="8" cy="4" r="0.8" fill="currentColor"/><path d="M8 3 L8 5"/><path d="M7 4 L9 4"/><circle cx="16" cy="4" r="0.8" fill="currentColor"/><path d="M16 3 L16 5"/><path d="M15 4 L17 4"/>`,
  },
  {
    key: 'gutter',
    label: 'Водостоки',
    cluster: 'Крыши',
    svg: `<path d="M6 3 L18 3 L18 6 L6 6 Z"/><path d="M10 6 L10 18"/><path d="M14 6 L14 18"/><path d="M10 18 C 10 20, 14 20, 14 18"/><path d="M10 9 L14 9" stroke-dasharray="1.5 1.5"/><path d="M10 13 L14 13" stroke-dasharray="1.5 1.5"/><path d="M12 20 L12 22"/><path d="M11 21 L13 21"/>`,
  },
  {
    key: 'climber',
    label: 'Альпинизм',
    cluster: 'Крыши',
    svg: `<path d="M4 3 L20 3"/><path d="M12 3 L12 18"/><circle cx="12" cy="10" r="2"/><path d="M10 13 L12 12 L14 13"/><path d="M10 16 L12 14 L14 16"/><path d="M9 19 L15 19"/><path d="M12 19 L12 21"/>`,
  },
  {
    key: 'boomlift',
    label: 'Автовышка',
    cluster: 'Крыши',
    svg: `<path d="M2 20 L22 20"/><path d="M3 20 L3 15 L11 15 L11 20"/><circle cx="5.5" cy="20.5" r="1.4"/><circle cx="8.5" cy="20.5" r="1.4"/><path d="M7 15 L7 13 L10 13" stroke-width="2"/><path d="M10 13 L16 7" stroke-width="2"/><path d="M15 4 L21 4 L21 9 L15 9 Z"/><path d="M18 9 L18 4"/>`,
  },
  {
    key: 'dumpster',
    label: 'Вывоз мусора',
    cluster: 'Мусор/Демонтаж',
    svg: `<path d="M3 8 L21 8"/><path d="M5 8 L5 19 L19 19 L19 8"/><circle cx="7.5" cy="20.5" r="1.4"/><circle cx="16.5" cy="20.5" r="1.4"/><path d="M9 14 L9 11"/><path d="M7.5 12.5 L9 11 L10.5 12.5"/><path d="M12 14 L12 11"/><path d="M10.5 12.5 L12 11 L13.5 12.5"/><path d="M15 14 L15 11"/><path d="M13.5 12.5 L15 11 L16.5 12.5"/>`,
  },
  {
    key: 'demolition',
    label: 'Демонтаж',
    cluster: 'Мусор/Демонтаж',
    svg: `<path d="M3 12 L12 4 L21 12"/><path d="M5 12 L5 20 L19 20 L19 12"/><path d="M8 20 L8 15 L11 15 L11 20"/><path d="M9 6 L11 8" stroke-dasharray="1.5 1.2"/><path d="M14 9 L16 12" stroke-dasharray="1.5 1.2"/><path d="M13 15 L15 18" stroke-dasharray="1.5 1.2"/><path d="M15 13 L16 14" stroke-dasharray="1.5 1.2"/>`,
  },
  {
    key: 'chipper',
    label: 'Измельчение',
    cluster: 'Арбористика',
    svg: `<path d="M7 6 L17 6 L14 13 L10 13 Z"/><path d="M10 13 L10 18 L14 18 L14 13"/><path d="M5 3 L7 6"/><path d="M3 5 L7 6"/><path d="M17 18 L20 18"/><path d="M19 17 L21 17"/><path d="M19 19 L21 20"/><circle cx="11" cy="20.5" r="1"/><circle cx="13" cy="20.5" r="1"/>`,
  },
  {
    key: 'fixed-price',
    label: 'Фикс-цена',
    cluster: 'Общие',
    svg: `<circle cx="12" cy="12" r="9"/><path d="M8 12 L11 15 L16 10"/><path d="M4 4 L6 6" stroke-width="0.8" opacity="0.6"/><path d="M18 18 L20 20" stroke-width="0.8" opacity="0.6"/>`,
  },
  {
    key: 'fast-response',
    label: 'Отклик 10 мин',
    cluster: 'Общие',
    svg: `<circle cx="12" cy="13" r="8"/><path d="M12 8 L12 13 L15 15"/><path d="M8 3 L12 5"/><path d="M16 3 L12 5"/>`,
  },
  {
    key: 'legal-shield',
    label: 'Штрафы на нас',
    cluster: 'Общие',
    svg: `<path d="M12 3 C 15 5, 18 5, 20 4 C 20 14, 17 19, 12 21 C 7 19, 4 14, 4 4 C 6 5, 9 5, 12 3 Z"/><path d="M9 12 L11 14 L15 10"/>`,
  },
  {
    key: 'snow-truck',
    label: 'Вывоз снега',
    cluster: 'Крыши',
    svg: `<path d="M2 18 L13 18 L13 12 L17 12 L20 15 L20 18"/><circle cx="6" cy="18.5" r="1.4"/><circle cx="17" cy="18.5" r="1.4"/><path d="M2 18 L2 14 L8 14 L8 18"/><circle cx="5" cy="5" r="0.7" fill="currentColor"/><path d="M5 4 L5 6"/><path d="M4 5 L6 5"/><circle cx="10" cy="6" r="0.7" fill="currentColor"/><path d="M10 5 L10 7"/><path d="M9 6 L11 6"/>`,
  },
  {
    key: 'lawn-mower',
    label: 'Стрижка газона',
    cluster: 'Территория',
    svg: `<path d="M4 17 L16 17 L18 14 L8 14 L6 10 L4 10 Z"/><circle cx="7" cy="19" r="1.4"/><circle cx="15" cy="19" r="1.4"/><path d="M6 10 L4 4"/><path d="M2 4 L6 4"/><path d="M11 13 L11 9" stroke-dasharray="1 1"/><path d="M13 13 L13 8" stroke-dasharray="1 1"/><path d="M15 13 L15 9" stroke-dasharray="1 1"/>`,
  },
  {
    key: 'excavator',
    label: 'Выравнивание участка',
    cluster: 'Мусор/Демонтаж',
    svg: `<path d="M3 19 L12 19 L12 14 L9 14 L9 11 L13 11 L15 13"/><path d="M15 13 L19 10"/><path d="M19 10 L21 6" stroke-dasharray="1.5 1"/><path d="M19 4 L22 7 L20 9 L17 6 Z"/><circle cx="5" cy="20" r="1.2"/><circle cx="8" cy="20" r="1.2"/><circle cx="11" cy="20" r="1.2"/>`,
  },
  {
    key: 'brush',
    label: 'Вырубка кустов',
    cluster: 'Арбористика',
    svg: `<path d="M5 20 C 5 14, 8 11, 8 8"/><path d="M8 8 L6 6"/><path d="M8 8 L10 6"/><path d="M10 20 C 10 15, 12 13, 12 10"/><path d="M12 10 L10 8"/><path d="M12 10 L14 8"/><path d="M15 20 C 15 13, 18 11, 18 8"/><path d="M18 8 L16 6"/><path d="M18 8 L20 6"/><path d="M3 20 L21 20"/>`,
  },
  {
    key: 'winter-decor',
    label: 'Украшение к НГ',
    cluster: 'Крыши',
    svg: `<path d="M12 4 L12 21"/><path d="M9 7 L12 4 L15 7"/><path d="M7 10 L12 7 L17 10"/><path d="M6 14 L12 10 L18 14"/><path d="M5 18 L12 14 L19 18"/><circle cx="9" cy="13" r="0.9" fill="currentColor"/><circle cx="15" cy="13" r="0.9" fill="currentColor"/><circle cx="8" cy="17" r="0.9" fill="currentColor"/><circle cx="12" cy="16" r="0.9" fill="currentColor"/><circle cx="16" cy="17" r="0.9" fill="currentColor"/><path d="M12 3 L11 2"/><path d="M12 3 L13 2"/>`,
  },
  {
    key: 'facade-clean',
    label: 'Мойка фасадов',
    cluster: 'Крыши',
    svg: `<path d="M5 3 L19 3 L19 21 L5 21 Z"/><path d="M5 8 L19 8"/><path d="M5 13 L19 13"/><path d="M5 18 L19 18"/><path d="M9 3 L9 21" stroke-dasharray="1.5 2"/><path d="M15 3 L15 21" stroke-dasharray="1.5 2"/><path d="M2 10 L4 11"/><path d="M2 14 L4 14"/><path d="M2 18 L4 17"/><circle cx="1" cy="10" r="0.7"/><circle cx="1" cy="14" r="0.7"/><circle cx="1" cy="18" r="0.7"/>`,
  },
]

function wrapIcon(body: string, size = 24): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
}

async function exportSingleIcons() {
  for (const icon of icons) {
    const svg = wrapIcon(icon.svg)
    await writeFile(resolve(OUT, `${icon.key}.svg`), svg)
  }
  console.log(`✓ Exported ${icons.length} individual SVG files`)
}

async function renderSheet() {
  // 4 колонки × n строк, каждая ячейка 220×160 px (иконка + label + cluster)
  const cols = 4
  const rows = Math.ceil(icons.length / cols)
  const cell = { w: 260, h: 160 }
  const pad = 40
  const W = cols * cell.w + pad * 2
  const H = rows * cell.h + pad * 2 + 80 // +header

  const cellsSvg = icons
    .map((icon, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = pad + col * cell.w
      const y = pad + 80 + row * cell.h
      return `
    <g transform="translate(${x} ${y})">
      <rect x="0" y="0" width="${cell.w - 20}" height="${cell.h - 20}" rx="12" fill="#ffffff" stroke="#e6e1d6" stroke-width="1"/>
      <g transform="translate(${(cell.w - 20) / 2 - 36} 24) scale(3)">
        <g fill="none" stroke="#2d5a3d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon.svg}</g>
      </g>
      <text x="${(cell.w - 20) / 2}" y="112" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#1c1c1c">${icon.label}</text>
      <text x="${(cell.w - 20) / 2}" y="130" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="500" fill="#8c8377" letter-spacing="2">${icon.cluster.toUpperCase()}</text>
    </g>`
    })
    .join('')

  const sheet = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f0ead8"/>
  <text x="${pad}" y="${pad + 40}" font-family="Inter, sans-serif" font-size="32" font-weight="800" letter-spacing="-1" fill="#1c1c1c">ServiceIcons · Обиход</text>
  <text x="${pad}" y="${pad + 62}" font-family="Inter, sans-serif" font-size="14" font-weight="500" fill="#8c8377">stroke 1.5 · currentColor · viewBox 24 · DNA Круга сезонов · v0.9 draft</text>
  ${cellsSvg}
</svg>`

  await writeFile(resolve(OUT, '_sheet.svg'), sheet)
  const png = await sharp(Buffer.from(sheet), { density: 150 }).png().toBuffer()
  await writeFile(resolve(OUT, '_sheet.png'), png)
  console.log(`✓ Sheet: ${W}×${H}`)
}

async function main() {
  await exportSingleIcons()
  await renderSheet()
  console.log(`\n✓ Done. Output: ${OUT}`)
}

main().catch((err) => {
  console.error('✗ failed:', err)
  process.exit(1)
})
