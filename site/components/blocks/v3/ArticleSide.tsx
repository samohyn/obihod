// Колонка справа от текста статьи и кейса: смета по фото, звонок и услуга по теме.
import Link from 'next/link'

import a from './ArticleBody.module.css'
import { ButtonLink } from './shared'
import { getPageTemplates } from '@/lib/page-templates-server'

/** От 1024 px; на телефоне и планшете её роль у нижней панели «Позвонить / Смета по фото». */
export async function ArticleSide({
  phoneDisplay,
  phoneHref,
  service,
}: {
  phoneDisplay: string
  phoneHref: string
  service?: { title: string; href: string } | null
}) {
  const t = await getPageTemplates()
  return (
    <aside className={a.side} aria-label="Заказать работу">
      <div className={a.sideCard}>
        <span className={a.sideEyebrow}>Смета по фото</span>
        <b className={a.sideTitle}>{t.sideTitle}</b>
        <p className={a.sideText}>{t.sideText}</p>
        <ButtonLink href="#zayavka" icon="camera">
          Отправить фото
        </ButtonLink>
        {phoneHref && (
          <ButtonLink href={phoneHref} variant="ghost" icon="phone">
            {phoneDisplay}
          </ButtonLink>
        )}
      </div>
      {service && (
        <Link href={service.href} className={a.sideService}>
          <span>Услуга по теме</span>
          <b>{service.title}</b>
        </Link>
      )}
    </aside>
  )
}
