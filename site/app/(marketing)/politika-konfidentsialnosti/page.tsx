import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { PageHeader } from '@/components/blocks/v3/PageHeader'
import { Section, Wrap } from '@/components/blocks/v3/shared'
import a from '@/components/blocks/v3/ArticleBody.module.css'
import { trail } from '@/lib/breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { getContacts } from '@/lib/chrome'
import { CONSENT_URL, LEGAL_REVISION_DATE, PRIVACY_URL } from '@/lib/legal'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'
import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

const LEGACY_METADATA: Metadata = {
  title: 'Политика обработки персональных данных — Обиход',
  description:
    'Какие персональные данные собирает сайт obikhod.ru, зачем, на каком основании, сколько хранит и как отозвать согласие. 152-ФЗ.',
  alternates: { canonical: canonicalFor(PRIVACY_URL) },
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('politika-konfidentsialnosti')
  return page ? buildBlocksPageMetadata(page, PRIVACY_URL) : LEGACY_METADATA
}

const h2 = ''
const p = ''
const ul = ''

/**
 * Политика обработки ПДн по ст. 18.1 152-ФЗ (план 09, этап 1). Текст описывает фактическую
 * обработку: заявки с сайта хранятся на сервере в РФ, уведомление менеджеру в Telegram идёт
 * без персональных данных (lib/telegram/sendMessage.ts) — трансграничной передачи нет.
 * Меняешь обработку — меняй текст и LEGAL_REVISION_DATE.
 */
export default async function PrivacyPolicyPage() {
  // Документ «Страницы» (план 09, этап 4.4b); вёрстка ниже — запасная, пока не убрана в 4.4c
  const page = await getPage('politika-konfidentsialnosti')
  if (page) return <PageBlocksView page={page} crumbs={trail('politika')} />

  const c = await getContacts()
  const breadcrumbs = trail('politika')

  return (
    <>
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <PageHeader
        eyebrow="Документ"
        title="Политика обработки персональных данных"
        meta={<span>Редакция от {LEGAL_REVISION_DATE}</span>}
      />
      <Section tone="default">
        <Wrap>
          <article className={a.body}>
            <h2 className={h2}>1. Кто обрабатывает данные</h2>
            <p className={p}>
              Оператор персональных данных — {c.legalName}
              {c.taxId && <>, ИНН {c.taxId}</>}
              {c.ogrn && <>, ОГРН {c.ogrn}</>}. Адрес: {c.addressLine}. Телефон:{' '}
              <a href={`tel:${c.phoneE164}`}>{c.phoneDisplay}</a>, электронная почта:{' '}
              <a href={`mailto:${c.email}`}>{c.email}</a>.
            </p>
            <p className={p}>
              Политика действует для всех персональных данных, которые оператор получает через сайт
              obikhod.ru, по телефону и в мессенджерах, и опубликована по требованию части 2 статьи
              18.1 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».
            </p>

            <h2 className={h2}>2. Чьи и какие данные мы обрабатываем</h2>
            <p className={p}>
              Данные людей, которые оставили заявку на сайте или связались с нами, а также клиентов
              и представителей организаций, с которыми мы заключаем договор:
            </p>
            <ul className={ul}>
              <li>имя;</li>
              <li>номер телефона;</li>
              <li>адрес электронной почты — если вы его указали;</li>
              <li>адрес или район объекта, описание задачи;</li>
              <li>фотографии объекта, которые вы прислали;</li>
              <li>
                страница сайта, с которой отправлена заявка, и рекламная метка перехода (UTM), если
                она была;
              </li>
              <li>для договора — реквизиты, нужные для его заключения, исполнения и оплаты.</li>
            </ul>
            <p className={p}>
              Специальные категории данных (о здоровье, убеждениях и т. п.) и биометрические данные
              мы не собираем.
            </p>

            <h2 className={h2}>3. Зачем мы обрабатываем данные</h2>
            <ul className={ul}>
              <li>принять заявку, перезвонить или ответить в мессенджере;</li>
              <li>рассчитать стоимость работ и подготовить смету;</li>
              <li>
                заключить и исполнить договор, принять оплату, передать закрывающие документы;
              </li>
              <li>вести учёт и выполнять обязанности, которые возлагает на нас закон;</li>
              <li>понимать, как пользуются сайтом, и улучшать его — по обезличенной статистике.</li>
            </ul>

            <h2 className={h2}>4. На каком основании</h2>
            <ul className={ul}>
              <li>
                заявка с сайта — ваше{' '}
                <Link href={CONSENT_URL}>согласие на обработку персональных данных</Link> (пункт 1
                части 1 статьи 6 152-ФЗ);
              </li>
              <li>
                подготовка и исполнение договора, стороной которого вы являетесь, — пункт 5 части 1
                статьи 6 152-ФЗ;
              </li>
              <li>
                бухгалтерский и налоговый учёт — требования закона (пункт 2 части 1 статьи 6).
              </li>
            </ul>

            <h2 className={h2}>5. Что мы делаем с данными</h2>
            <p className={p}>
              Сбор, запись, систематизация, накопление, хранение, уточнение, извлечение,
              использование, блокирование, удаление и уничтожение. Обработка смешанная: данные
              хранятся в информационной системе сайта, с ними работает менеджер. Решений, которые
              порождают для вас юридические последствия, только автоматически мы не принимаем.
            </p>

            <h2 className={h2}>6. Сколько храним</h2>
            <ul className={ul}>
              <li>
                заявка, по которой договор не заключён, — не дольше 1 года с последнего обращения,
                затем данные удаляются;
              </li>
              <li>
                данные по договору — в течение его действия и затем столько, сколько требует закон о
                бухгалтерском учёте (5 лет);
              </li>
              <li>
                после отзыва согласия — удаляем в течение 30 дней, если у нас нет другого законного
                основания хранить данные.
              </li>
            </ul>

            <h2 className={h2}>7. Кому передаём</h2>
            <p className={p}>
              Мы не продаём и не публикуем ваши данные. Они хранятся на сервере, расположенном в
              Российской Федерации. Доступ к ним есть только у сотрудников, которым он нужен для
              работы с заявкой или договором. Государственным органам данные передаются только в
              случаях, предусмотренных законом. Трансграничную передачу персональных данных мы не
              осуществляем.
            </p>

            <h2 className={h2}>8. Cookie и статистика посещений</h2>
            <p className={p}>
              Сайт использует cookie — небольшие файлы в браузере, без которых часть функций не
              работает. Для статистики посещений сайт может использовать сервис Яндекс Метрика (ООО
              «ЯНДЕКС»): он получает обезличенные сведения о посещении — страницы, время, тип
              устройства и браузера. Отключить cookie можно в настройках браузера; сайт при этом
              останется доступен.
            </p>

            <h2 className={h2}>9. Ваши права</h2>
            <p className={p}>Вы можете:</p>
            <ul className={ul}>
              <li>узнать, какие ваши данные мы обрабатываем, зачем и как;</li>
              <li>потребовать уточнить, заблокировать или удалить данные;</li>
              <li>отозвать согласие на обработку;</li>
              <li>обжаловать наши действия в Роскомнадзоре или в суде.</li>
            </ul>
            <p className={p}>
              Напишите на <a href={`mailto:${c.email}`}>{c.email}</a> или письмом по адресу:{' '}
              {c.addressLine}. Ответим в течение 10 рабочих дней с момента получения запроса; если
              срок понадобится продлить, сообщим причину — продлить можно не больше чем на 5 рабочих
              дней.
            </p>

            <h2 className={h2}>10. Как мы защищаем данные</h2>
            <ul className={ul}>
              <li>доступ к данным — только у сотрудников, которым он нужен для работы;</li>
              <li>вход в систему управления — по паролю, с ограничением числа попыток;</li>
              <li>
                передача данных между вашим браузером и сайтом — по защищённому протоколу HTTPS;
              </li>
              <li>резервные копии хранятся на территории Российской Федерации.</li>
            </ul>

            <h2 className={h2}>11. Изменения политики</h2>
            <p className={p}>
              Актуальная редакция всегда опубликована на этой странице. Дата редакции указана в
              начале документа.
            </p>

            <JsonLd
              schema={[
                breadcrumbListSchema(
                  breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
                ),
              ]}
            />
          </article>
        </Wrap>
      </Section>
    </>
  )
}
