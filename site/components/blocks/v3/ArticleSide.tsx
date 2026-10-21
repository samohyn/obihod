// Колонка справа от текста статьи и кейса: смета по фото, звонок и услуга по теме.
import Link from 'next/link'

import a from './ArticleBody.module.css'
import { ButtonLink } from './shared'
import { getCompany, minutes } from '@/lib/company'

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
  const company = await getCompany()
  return (
    <aside className={a.side} aria-label="Заказать работу">
      <div className={a.sideCard}>
        <span className={a.sideEyebrow}>Смета по фото</span>
        <b className={a.sideTitle}>Посчитаем вашу задачу</b>
        <p className={a.sideText}>
          Пришлите фото — ответим за {minutes(company.photoEstimateMinutes)}. Оценщик выезжает
          бесплатно до {company.freeVisitRadiusKm} км от МКАД.
        </p>
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
