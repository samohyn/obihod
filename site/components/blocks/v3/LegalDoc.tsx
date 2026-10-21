import { RichText } from '@payloadcms/richtext-lexical/react'

import a from './ArticleBody.module.css'
import { PageHeader } from './PageHeader'
import { Section, Wrap } from './shared'
import type { LegalDocBlock, SectionTone } from './types'

/** Документ (политика ПДн, согласие): шапка с датой редакции и текст из админки. */
export function LegalDoc({
  eyebrow,
  title,
  revision,
  body,
  tone,
}: LegalDocBlock & { tone?: SectionTone }) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow ?? 'Документ'}
        title={title}
        meta={revision ? <span>Редакция от {revision}</span> : undefined}
      />
      <Section tone={tone ?? 'default'}>
        <Wrap>
          <article className={a.body}>
            {body ? <RichText data={body as never} disableContainer /> : null}
          </article>
        </Wrap>
      </Section>
    </>
  )
}
