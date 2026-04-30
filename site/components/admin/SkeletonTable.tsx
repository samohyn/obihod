import type { CSSProperties, FC } from 'react'

/**
 * SkeletonTable — loading skeleton для list-views (Wave 5 · PAN-4 part 2).
 *
 * Используется как `admin.components.views.list.Loading` в CollectionConfig
 * через тонкий wrapper. Pulse animation определена в `site/app/(payload)/custom.scss`
 * + reduced-motion guard.
 */

interface SkeletonTableProps {
  rows?: number
  columns?: number
}

const wrapStyle: CSSProperties = {
  padding: '24px',
  fontFamily: 'var(--font-body)',
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  margin: '24px auto',
  maxWidth: 1080,
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const headerRowStyle: CSSProperties = {
  borderBottom: '1px solid var(--brand-obihod-line, #e6e1d6)',
}

const headerCellStyle: CSSProperties = {
  padding: '8px 12px',
}

const headerBarStyle: CSSProperties = {
  height: 12,
  background: 'var(--brand-obihod-paper-warm, #efebe0)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
}

const rowStyle: CSSProperties = {
  borderBottom: '1px solid var(--brand-obihod-paper-warm, #efebe0)',
}

const cellStyle: CSSProperties = {
  padding: '14px 12px',
}

const barStyle: CSSProperties = {
  height: 14,
  background: 'var(--brand-obihod-paper-warm, #efebe0)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
}

const SkeletonTable: FC<SkeletonTableProps> = ({ rows = 6, columns = 4 }) => {
  const rowsArr = Array.from({ length: rows })
  const colsArr = Array.from({ length: columns })

  return (
    <section style={wrapStyle} aria-busy="true" aria-label="Загрузка списка">
      <table style={tableStyle} className="brand-skeleton">
        <thead>
          <tr style={headerRowStyle}>
            {colsArr.map((_, ci) => (
              <th key={ci} style={headerCellStyle}>
                <div
                  className="brand-skeleton__bar"
                  style={{ ...headerBarStyle, width: ci === 0 ? '40%' : '70%' }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowsArr.map((_, ri) => (
            <tr key={ri} style={rowStyle}>
              {colsArr.map((_, ci) => (
                <td key={ci} style={cellStyle}>
                  <div
                    className="brand-skeleton__bar"
                    style={{
                      ...barStyle,
                      width: ci === 0 ? '60%' : ci === colsArr.length - 1 ? '30%' : '85%',
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default SkeletonTable
