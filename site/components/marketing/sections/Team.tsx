import { Placeholder } from '../_shared/Placeholder'

type Member = {
  n: string
  r: string
  bio: string
  facts: string[]
  ph: string
}

const TEAM: Member[] = [
  {
    n: 'Иван Петров',
    r: 'Бригадир · арборист',
    bio: '12 лет в промышленном альпинизме. Работал в «Мосзеленхозе». Личный рекорд — спил сухостоя 32 м в стеснённых условиях СНТ.',
    facts: ['СТАЖ 12 ЛЕТ', 'ISA · CERT'],
    ph: 'ФОТО · Портрет 3:4, фирменная куртка хвойного цвета, рабочий фон',
  },
  {
    n: 'Алексей Смирнов',
    r: 'Замерщик · менеджер',
    bio: 'Приезжает к клиентам, считает сметы, ведёт ваш объект до акта. Знает строительные нормы и документы СНТ наизусть.',
    facts: ['СТАЖ 7 ЛЕТ', '180+ ОБЪЕКТОВ'],
    ph: 'ФОТО · Портрет 3:4, офисная рубашка поло с логотипом',
  },
  {
    n: 'Дмитрий Васильев',
    r: 'Мастер демонтажа',
    bio: '15 лет на стройке, бригада из 5 человек. Разбирает любое строение — от деревянной бани до двухэтажного кирпичного дома.',
    facts: ['СТАЖ 15 ЛЕТ', 'БРИГАДА 5 ЧЕЛ'],
    ph: 'ФОТО · Портрет 3:4, каска цвета янтарь, спецовка',
  },
  {
    n: 'Анна Соколова',
    r: 'Диспетчер · координатор',
    bio: 'Первая, с кем вы говорите. Средняя скорость ответа на звонок — 12 секунд, на заявку с сайта — 4 минуты. Работает по будням и в выходные.',
    facts: ['СМЕНА 8—21', 'SLA 15 МИН'],
    ph: 'ФОТО · Портрет 3:4, гарнитура, тёплый свет',
  },
]

export function Team() {
  return (
    <section id="team" className="band-alt">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;07 · Команда</span>
            <h2 className="h-xl">
              Люди, которые<br />приедут к&nbsp;вам.
            </h2>
          </div>
          <p className="section-sub">
            У&nbsp;нас нет «безымянных исполнителей». Имя, лицо, стаж, сертификация — публично.
            Вы&nbsp;знаете, кто зайдёт на&nbsp;ваш участок, ещё до&nbsp;того, как он&nbsp;позвонит в&nbsp;калитку.
          </p>
        </div>
        <div className="team-grid">
          {TEAM.map((t, i) => (
            <div key={i} className="team-card">
              <div className="team-photo">
                <Placeholder label={t.ph} aspect="3/4" />
              </div>
              <div className="team-name">{t.n}</div>
              <div className="team-role">{t.r}</div>
              <div className="team-bio">{t.bio}</div>
              <div className="team-facts">
                {t.facts.map((f, j) => (
                  <span key={j}>· {f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
