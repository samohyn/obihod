// Компактная шапка страницы-списка или статьи: надзаголовок, H1, вводный абзац, строка мета-данных.

import type { ReactNode } from 'react'

import { Eyebrow, Section, Wrap } from './shared'
import s from './PageHeader.module.css'

export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow?: string | null
  title: string
  lead?: string | null
  meta?: ReactNode
}) {
  return (
    <Section tone="alt" className={s.section}>
      <Wrap>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className={s.title}>{title}</h1>
        {lead && <p className={s.lead}>{lead}</p>}
        {meta && <div className={s.meta}>{meta}</div>}
      </Wrap>
    </Section>
  )
}
