import type { CSSProperties, ReactNode } from 'react'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { Gutter } from '@payloadcms/ui'

import { AdminViewTemplate } from './AdminViewTemplate'

/**
 * HelpView — /admin/help «Как сделать…»: короткие инструкции по частым задачам владельца
 * (план 09, этап 4.5). Зарегистрирован в payload.config.ts admin.views.help, ссылка в меню —
 * NavHelpLink. Меняется админка — меняется и этот текст.
 */

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} style={linkStyle}>
    {children}
  </a>
)

type HowTo = { id: string; title: string; steps: ReactNode[] }

const HOWTOS: HowTo[] = [
  {
    id: 'kontakty',
    title: 'Поменять телефон, почту, адрес или часы работы',
    steps: [
      <>
        Откройте <A href="/admin/globals/company">«Компания и контакты»</A> → вкладка «Контакты» или
        «Часы работы».
      </>,
      'Сохраните. Сайт обновится сразу: шапка, подвал, контакты, формы, разметка для поисковиков.',
    ],
  },
  {
    id: 'offer',
    title: 'Поменять цифры оффера: перезвон, смета по фото, аварийный выезд, радиусы, скидки',
    steps: [
      <>
        <A href="/admin/globals/company">«Компания и контакты»</A> → вкладка «Оффер».
      </>,
      'В текстах страниц эти цифры стоят метками — {перезвон}, {смета по фото}, {аварийный выезд}… После сохранения они поменяются на всём сайте сами. Полный список меток — на той же вкладке.',
      'Пишете новый текст с такой цифрой — ставьте метку, а не число.',
    ],
  },
  {
    id: 'stranica',
    title: 'Поправить текст или фото на странице',
    steps: [
      <>
        <A href="/admin/collections/pages">«Страницы»</A> — главная, услуги, цены, о компании, B2B,
        документы. Найдите страницу по названию или адресу.
      </>,
      'Вкладка «Блоки страницы» → раскройте нужный блок → поправьте.',
      '«Открыть черновик» справа — посмотреть, как будет на сайте. Черновик видите только вы.',
      '«Опубликовать изменения» — правка появится на сайте.',
      <>
        Подуслуги (например «Валка деревьев») — в разделе{' '}
        <A href="/admin/collections/sub-services">«Подуслуги»</A>, так же блоками.
      </>,
    ],
  },
  {
    id: 'ceny',
    title: 'Обновить цены',
    steps: [
      <>
        Прайс —{' '}
        <A href="/admin/collections/pages?where[slug][like]=tseny">
          «Страницы» с адресом uslugi/tseny…
        </A>{' '}
        → блок «Цены».
      </>,
      'Цены на страницах направлений и подуслуг — блок «Цены» в самих этих страницах.',
    ],
  },
  {
    id: 'foto',
    title: 'Заменить фото',
    steps: [
      'В блоке нажмите на фото → выберите другое из «Медиа» или загрузите новое.',
      <>
        Сгенерированные фото подписаны на сайте «Иллюстрация». Поставили реальное — снимите у него в{' '}
        <A href="/admin/collections/media">«Медиа»</A> галочку «Иллюстрация».
      </>,
    ],
  },
  {
    id: 'kejs',
    title: 'Добавить кейс или статью',
    steps: [
      <>
        <A href="/admin/collections/cases/create">«Кейсы»</A> или{' '}
        <A href="/admin/collections/blog/create">«Блог»</A> → «Создать».
      </>,
      'Заполните, «Сохранить черновик», проверьте через предпросмотр → «Опубликовать».',
    ],
  },
  {
    id: 'rajony',
    title: 'Районы и «услуга в районе»',
    steps: [
      <>
        <A href="/admin/collections/districts">«Районы»</A> — название в падежах, удалённость от
        МКАД, ориентиры.
      </>,
      <>
        <A href="/admin/collections/service-districts">«Услуги × районы»</A> — местный текст,
        вопросы и ориентиры для услуги в конкретном районе. Заполнено поле «подуслуга» — это
        страница подуслуги в районе: /arboristika/spil-derevev/istra/. Пока запись не опубликована,
        страница закрыта от поисковиков.
      </>,
      <>
        Заголовки и типовые тексты всех районных страниц —{' '}
        <A href="/admin/globals/page-templates">«Шаблоны страниц»</A>, вкладки «Район» и «Услуга в
        районе». Подстановки {'{в районе}'}, {'{район}'}, {'{км}'} сайт заполнит сам.
      </>,
    ],
  },
  {
    id: 'shapka',
    title: 'Меню, полоса над шапкой и подвал',
    steps: [
      <>
        <A href="/admin/globals/site-chrome">«Шапка и подвал»</A> → вкладки «Шапка и меню» и
        «Подвал». Телефон и адрес там не правятся — они в «Компания и контакты».
      </>,
    ],
  },
  {
    id: 'shablony',
    title: 'Тексты страницы 404, страниц авторов, колонки статьи и кейса',
    steps: [
      <>
        <A href="/admin/globals/page-templates">«Шаблоны страниц»</A> → нужная вкладка.
      </>,
    ],
  },
  {
    id: 'dokumenty',
    title: 'Политика и согласие на обработку персональных данных',
    steps: [
      <>
        <A href="/admin/collections/pages">«Страницы»</A> → «Политика обработки персональных данных»
        или «Согласие на обработку персональных данных» → блок «Текст документа».
      </>,
      'Меняете текст — поменяйте и дату в «Редакция от». Прежние редакции хранятся во вкладке «Версии» документа.',
      'Реквизиты в тексте — метками {оператор}, {адрес}, {почта}: берутся из «Компания и контакты».',
    ],
  },
  {
    id: 'versii',
    title: 'Вернуть прежний вариант',
    steps: [
      'Откройте документ → «Версии» вверху справа → выберите нужную → «Восстановить эту версию».',
    ],
  },
  {
    id: 'snyat',
    title: 'Убрать страницу с сайта',
    steps: [
      'В документе — меню «⋮» рядом с «Опубликовать изменения» → «Отменить публикацию». Страница станет черновиком и пропадёт с сайта; вернуть — «Опубликовать».',
    ],
  },
  {
    id: 'korzina',
    title: 'Удалили по ошибке',
    steps: [
      'Удалённые страницы, статьи, кейсы, районы и другие документы попадают в корзину: откройте список раздела → вверху «Корзина» → документ → «Восстановить».',
      'Навсегда удаляется только из корзины. Фото из «Медиа» в корзину не попадают — удаляются сразу.',
    ],
  },
  {
    id: 'zayavki',
    title: 'Заявки: позвонить, отметить итог, не просрочить',
    steps: [
      <>
        <A href="/admin/collections/leads">«Заявки»</A> — очередь слева, выбранная заявка справа (на
        телефоне — поверх очереди). Вкладка «Срочно» — просроченные и те, где до срока меньше 3
        минут; сверху самые срочные.
      </>,
      'Таймер «Ответить до» = время заявки + «Перезвоним за» из «Компания и контакты». Ночью и перед закрытием срок переносится на утро (переключатель — «Компания и контакты» → «Заявки»).',
      '«Позвонить» — звонок с телефона одной кнопкой. После звонка нажмите «Связались» или «Не ответил»: только это останавливает таймер.',
      'Статус меняется кнопками, смысл каждого — в подсказке под ними. «Напомнить» — когда перезвонить; срок ответа он не меняет.',
      'О каждой новой заявке приходит письмо на partner@obikhod.ru со сроком и ссылкой прямо на карточку; если срок вышел, а итога звонка нет — письмо «Просрочена заявка».',
      'Фото закрытых заявок удаляются сами через 30 дней после закрытия (152-ФЗ); срок — «Компания и контакты» → «Заявки».',
      '«Выгрузить CSV» — над очередью; по умолчанию без имён и телефонов, с ними — отдельной ссылкой. На главной панели — доля заявок, отвеченных в срок, за 7 и 30 дней.',
    ],
  },
  {
    id: 'istoriya',
    title: 'Кто и когда что менял',
    steps: [
      <>
        <A href="/admin/audit">«История»</A> в меню слева.
      </>,
    ],
  },
  {
    id: 'vhod',
    title: 'Защитить вход кодом из приложения',
    steps: [
      <>
        <A href="/admin/security">«Безопасность»</A> — двухфакторная защита: пароль + код из Яндекс
        Ключа, Google Authenticator или другого приложения.
      </>,
    ],
  },
]

export default function HelpView(props: AdminViewServerProps) {
  const { initPageResult } = props
  if (!initPageResult.req.user) redirect('/admin/login')

  return (
    <AdminViewTemplate
      initPageResult={initPageResult}
      params={props.params}
      searchParams={props.searchParams}
    >
      <Gutter>
        <h1 style={titleStyle}>Как сделать…</h1>
        <p style={leadStyle}>
          Частые задачи и где они делаются. Всё, что опубликовано, видно на сайте сразу — сбрасывать
          ничего не нужно.
        </p>
        <nav aria-label="Задачи" style={indexStyle}>
          {HOWTOS.map((h) => (
            <a key={h.id} href={`#${h.id}`} style={indexLinkStyle}>
              {h.title}
            </a>
          ))}
        </nav>
        {HOWTOS.map((h) => (
          <section key={h.id} id={h.id} style={cardStyle}>
            <h2 style={h2Style}>{h.title}</h2>
            <ol style={olStyle}>
              {h.steps.map((s, i) => (
                <li key={i} style={liStyle}>
                  {s}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </Gutter>
    </AdminViewTemplate>
  )
}

const titleStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 8,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const leadStyle: CSSProperties = {
  fontSize: 14,
  color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
  marginTop: 0,
  marginBottom: 24,
  lineHeight: 1.5,
  maxWidth: 720,
}

const indexStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 32,
  maxWidth: 960,
}

const indexLinkStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.3,
  padding: '10px 12px',
  minHeight: 44,
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  background: 'var(--brand-obihod-card, #ffffff)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  textDecoration: 'none',
}

const cardStyle: CSSProperties = {
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  padding: '20px 24px',
  marginBottom: 16,
  maxWidth: 760,
  scrollMarginTop: 80,
}

const h2Style: CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  margin: '0 0 10px',
  lineHeight: 1.3,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const olStyle: CSSProperties = { margin: 0, paddingLeft: 20 }

const liStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.55,
  marginBottom: 6,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const linkStyle: CSSProperties = {
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  textDecoration: 'underline',
  textUnderlineOffset: 2,
}
