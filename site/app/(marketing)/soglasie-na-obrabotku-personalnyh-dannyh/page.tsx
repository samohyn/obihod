import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { getContacts } from '@/lib/chrome'
import { CONSENT_URL, LEGAL_REVISION_DATE, PRIVACY_URL } from '@/lib/legal'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Согласие на обработку персональных данных — Обиход',
  description:
    'Текст согласия на обработку персональных данных, которое вы даёте, отправляя заявку на сайте obikhod.ru: какие данные, зачем, на какой срок и как отозвать.',
  alternates: { canonical: canonicalFor(CONSENT_URL) },
}

const p = 'mt-4 text-stone-700'
const ul = 'mt-4 list-disc space-y-2 pl-6 text-stone-700'

/**
 * Отдельный документ согласия — ч. 1 ст. 9 152-ФЗ в редакции 156-ФЗ (с 01.09.2025): согласие
 * оформляется отдельно от политики и других документов. Отдельный неотмеченный чекбокс в формах —
 * план 09, этап 2 (единая система форм).
 */
export default async function ConsentPage() {
  const c = await getContacts()
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Согласие на обработку персональных данных', href: CONSENT_URL },
  ]

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        Согласие на обработку персональных данных
      </h1>
      <p className="mt-4 text-sm text-stone-500">Редакция от {LEGAL_REVISION_DATE}</p>

      <p className="mt-8 text-stone-700">
        Отправляя заявку на сайте obikhod.ru, я свободно, своей волей и в своём интересе даю
        согласие оператору — {c.legalName}
        {c.taxId && <>, ИНН {c.taxId}</>}, адрес: {c.addressLine} — на обработку моих персональных
        данных на следующих условиях.
      </p>

      <p className={p}>
        <strong>Какие данные:</strong>
      </p>
      <ul className={ul}>
        <li>имя;</li>
        <li>номер телефона;</li>
        <li>адрес электронной почты — если я его указал;</li>
        <li>адрес или район объекта и описание задачи;</li>
        <li>фотографии объекта, которые я прислал;</li>
        <li>страница сайта, с которой отправлена заявка, и рекламная метка перехода (UTM).</li>
      </ul>

      <p className={p}>
        <strong>Зачем:</strong> чтобы принять и обработать мою заявку, связаться со мной по телефону
        или в мессенджере, рассчитать стоимость работ и подготовить предложение.
      </p>

      <p className={p}>
        <strong>Что оператор может делать с данными:</strong> сбор, запись, систематизация,
        накопление, хранение, уточнение, извлечение, использование, блокирование, удаление и
        уничтожение. Обработка смешанная — в информационной системе сайта и менеджером.
      </p>

      <p className={p}>
        <strong>Срок:</strong> согласие действует до достижения цели обработки, но не дольше 1 года
        с момента отправки заявки. Если мы заключим договор, дальнейшая обработка пойдёт уже на
        основании договора.
      </p>

      <p className={p}>
        <strong>Как отозвать:</strong> написать на <a href={`mailto:${c.email}`}>{c.email}</a> или
        письмом по адресу: {c.addressLine}. После отзыва оператор прекращает обработку и удаляет
        данные в течение 30 дней, если у него нет другого законного основания их хранить.
      </p>

      <p className={p}>
        Подробнее о том, как оператор обращается с персональными данными, — в{' '}
        <Link href={PRIVACY_URL}>Политике обработки персональных данных</Link>.
      </p>

      <JsonLd
        schema={[
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
        ]}
      />
    </article>
  )
}
