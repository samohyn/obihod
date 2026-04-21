import { Icon } from '../_shared/Icon'
import { Avatar } from '../_shared/Placeholder'

type Review = {
  body: string
  name: string
  meta: string
  stars: number
  i: string
}

const REVIEWS: Review[] = [
  {
    body: 'Звонил в пятницу вечером — в субботу в 9 утра замерщик уже на участке. Цену назвали в калькуляторе, ровно столько и вышло, ни рубля сверху. Бригада за собой убрала — щепы не осталось. Редкость по нынешним временам.',
    name: 'Сергей М.',
    meta: 'Истра · Спил 3 деревьев',
    stars: 5,
    i: 'СМ',
  },
  {
    body: 'Купили участок с советской баней и кучей мусора. Обиход снёс баню, вывез всё, спланировал площадку — через 3 дня можно было заливать фундамент. Документы оформили сами, мне не пришлось ничего подписывать в администрации.',
    name: 'Ольга Р.',
    meta: 'Одинцово · Демонтаж под ключ',
    stars: 5,
    i: 'ОР',
  },
  {
    body: 'Заключили годовой контракт на уборку снега. Зима была снежной, но без сюрпризов: за 30 минут до приезда — SMS, после работы — фото в Telegram. Ни разу не пришлось звонить и уточнять «а вы приедете?».',
    name: 'Александр К.',
    meta: 'Мытищи · Абонемент «Участок»',
    stars: 5,
    i: 'АК',
  },
  {
    body: 'Упавшее после шторма дерево лежало на заборе. Позвонила в воскресенье — приехали через три часа. Спилили, распилили на дрова (попросила оставить), вывезли ветки. Страховка сразу в договоре, спокойно на душе.',
    name: 'Ирина Д.',
    meta: 'Химки · Аварийный выезд',
    stars: 5,
    i: 'ИД',
  },
  {
    body: 'Нужен был вывоз КГМ после ремонта дома. 20-кубовый контейнер привезли в назначенный час, забрали ровно через сутки. Паспорт отходов — в электронном виде на почте. Без шума, без грязи на дороге, без вопросов от соседей.',
    name: 'Михаил Т.',
    meta: 'Балашиха · Вывоз 20 м³',
    stars: 5,
    i: 'МТ',
  },
  {
    body: 'Три года спил пней откладывали — «потом». Обиход фрезеровал восемь пней за полдня, выровнял землю, засеял газоном. Гарантия на отсутствие прорастания — три года, что для нас немаловажно.',
    name: 'Елена С.',
    meta: 'СНТ Лесное · Фрезеровка',
    stars: 5,
    i: 'ЕС',
  },
]

export function Reviews() {
  return (
    <section id="reviews">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;06 · Отзывы</span>
            <h2 className="h-xl">
              Что говорят
              <br />
              клиенты.
            </h2>
          </div>
          <p className="section-sub">
            Мы собираем отзывы сразу после работы — через QR-код на&nbsp;гарантийном сертификате.
            Все отзывы — с&nbsp;реальных участков, без редактирования.
          </p>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-stars" aria-label={`${r.stars} из 5`}>
                {Array.from({ length: r.stars }, (_, k) => (
                  <Icon.Star key={k} size={16} />
                ))}
              </div>
              <div className="review-body">{r.body}</div>
              <div className="review-foot">
                <Avatar initials={r.i} />
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-meta">{r.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reviews-sources">
          <div className="review-source">
            <div className="rating">4.9</div>
            <div>
              <div className="src-name">Яндекс.Карты</div>
              <div className="src-count">184 ОТЗЫВА · ПОДТВЕРЖДЕНО</div>
            </div>
          </div>
          <div className="review-source">
            <div className="rating">4.8</div>
            <div>
              <div className="src-name">2ГИС</div>
              <div className="src-count">96 ОТЗЫВОВ</div>
            </div>
          </div>
          <div className="review-source">
            <div className="rating">4.9</div>
            <div>
              <div className="src-name">Авито Услуги</div>
              <div className="src-count">241 ОЦЕНКА</div>
            </div>
          </div>
          <div className="review-source">
            <div className="rating">98%</div>
            <div>
              <div className="src-name">NPS · рекомендуют</div>
              <div className="src-count">ОПРОС ПОСЛЕ РАБОТЫ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
