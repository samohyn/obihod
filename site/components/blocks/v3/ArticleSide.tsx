// Колонка справа от текста статьи и кейса: смета по фото, звонок и услуга по теме.
import Link from 'next/link'

import a from './ArticleBody.module.css'
import { ButtonLink } from './shared'

/** От 1024 px; на телефоне и планшете её роль у нижней панели «Позвонить / Смета по фото». */
export function ArticleSide({
  phoneDisplay,
  phoneHref,
  service,
}: {
  phoneDisplay: string
  phoneHref: string
  service?: { title: string; href: string } | null
}) {
  return (
    <aside className={a.side} aria-label="Заказать работу">
      <div className={a.sideCard}>
        <span className={a.sideEyebrow}>Смета по фото</span>
        <b className={a.sideTitle}>Посчитаем вашу задачу</b>
        <p className={a.sideText}>
          Пришлите фото — ответим за 30 минут. Оценщик выезжает бесплатно до 50 км от МКАД.
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
