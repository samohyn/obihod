import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'

import { payloadClient } from '@/lib/payload'
import { PageCatalog } from '@/components/admin/PageCatalog'

/**
 * /admin/catalog — отдельная страница «Каталог опубликованных страниц».
 *
 * Wave 3 · PAN-6 part 2. Spec: specs/US-12-admin-redesign/sa-panel-wave3.md §3.2.
 *
 * Anatomy: header («Каталог опубликованных страниц» + CSV download) +
 * `<PageCatalog />` server component (full table 7 коллекций).
 *
 * Permission gate: только authenticated admin/manager. 401 → redirect /admin/login.
 *
 * MVP без client-side фильтров/поиска (Karpathy простота — оператор-один,
 * 53 записи, фильтрация позже как W3.1 polish если запросит).
 *
 * a11y W7 (PAN-8): document-title metadata обязательна (axe-core
 * `document-title (serious)` — WCAG 2.4.2 Page Titled).
 */

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Каталог опубликованных страниц — Обиход admin',
}

const layoutStyle: CSSProperties = {
  padding: '32px 48px',
  fontFamily: 'var(--font-body)',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  maxWidth: 1200,
  margin: '0 auto',
}

const breadcrumbStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--brand-obihod-muted, #6b6256)',
}

const headerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
}

const h1Style: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 28,
  fontWeight: 600,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  margin: 0,
}

const csvButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '9px 16px',
  fontSize: 14,
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  background: 'transparent',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  textDecoration: 'none',
  cursor: 'pointer',
}

export default async function AdminCatalogPage() {
  const payload = await payloadClient()
  const headersList = await nextHeaders()
  const auth = await payload.auth({ headers: headersList })

  if (!auth.user) {
    redirect('/admin/login?redirect=/admin/catalog')
  }
  const role = (auth.user as { role?: string }).role
  if (!role || !['admin', 'manager'].includes(role)) {
    redirect('/admin/login?redirect=/admin/catalog')
  }

  return (
    <main style={layoutStyle}>
      <nav style={breadcrumbStyle} aria-label="Хлебные крошки">
        02 · Контент / Каталог
      </nav>

      <header style={headerRowStyle}>
        <h1 style={h1Style}>Каталог опубликованных страниц</h1>
        <a
          href="/api/admin/page-catalog/csv"
          style={csvButtonStyle}
          aria-label="Скачать каталог в CSV"
          download
        >
          ⇩ Скачать CSV
        </a>
      </header>

      <PageCatalog />
    </main>
  )
}
