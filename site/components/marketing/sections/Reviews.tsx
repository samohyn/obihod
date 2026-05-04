export function Reviews() {
  return (
    <section className="hp-section">
      <div className="wrap">
        <div className="eyebrow">§ 07 · Отзывы · независимые источники</div>
        <h2 style={{ maxWidth: '22ch' }}>Что пишут заказчики на Я.Картах, 2ГИС, Авито</h2>

        <div className="hp-rev-sources">
          <div className="stat-tile">
            <div className="lbl">Я.Карты</div>
            <div className="val">
              <span style={{ color: 'var(--c-accent)' }}>★</span> 4.9
            </div>
            <div className="delta">128 отзывов</div>
          </div>
          <div className="stat-tile">
            <div className="lbl">2ГИС</div>
            <div className="val">
              <span style={{ color: 'var(--c-accent)' }}>★</span> 4.8
            </div>
            <div className="delta">42 отзыва</div>
          </div>
          <div className="stat-tile">
            <div className="lbl">Авито</div>
            <div className="val">
              <span style={{ color: 'var(--c-accent)' }}>★</span> 4.9
            </div>
            <div className="delta">31 отзыв · 5 рекомендаций</div>
          </div>
          <div className="stat-tile">
            <div className="lbl">NPS</div>
            <div className="val">
              98{' '}
              <span className="muted" style={{ fontSize: '14px' }}>
                /100
              </span>
            </div>
            <div className="delta">внутренний опрос Q1 2026</div>
          </div>
        </div>

        <div className="hp-revs">
          <article className="hp-rev-card">
            <div className="head">
              <div className="av">М</div>
              <div>
                <div className="n">Мария К.</div>
                <div className="meta">Истра · Я.Карты · 14 апр 2026</div>
              </div>
            </div>
            <div className="stars">★★★★★</div>
            <p className="text">
              «Сфоткала упавшую берёзу — через 8 минут пришёл ответ в WhatsApp. Приехали через день,
              всё убрали за 3 часа, увезли пенёк. Цена точно как в смете.»
            </p>
          </article>

          <article className="hp-rev-card">
            <div className="head">
              <div className="av">В</div>
              <div>
                <div className="n">Виктор С.</div>
                <div className="meta">Раменское · Я.Карты · 6 апр 2026</div>
              </div>
            </div>
            <div className="stars">★★★★★</div>
            <p className="text">
              «Демонтаж старой бани с вывозом. Бригада в форме, договор на месте, страховка.
              Сертификат с печатью отдали вместе с актом.»
            </p>
          </article>

          <article className="hp-rev-card">
            <div className="head">
              <div className="av">А</div>
              <div>
                <div className="n">Анна Л.</div>
                <div className="meta">FM · посёлок Красногорск · 2ГИС · 3 апр 2026</div>
              </div>
            </div>
            <div className="stars">★★★★★</div>
            <p className="text">
              «Заключили годовой договор на крыши и арбо. Один менеджер на всё, штрафы ГЖИ они
              забрали в свой риск, а это — главное для нас.»
            </p>
          </article>

          <article className="hp-rev-card">
            <div className="head">
              <div className="av">Н</div>
              <div>
                <div className="n">Николай Ф.</div>
                <div className="meta">Одинцово · Авито · 22 мар 2026</div>
              </div>
            </div>
            <div className="stars">★★★★★</div>
            <p className="text">
              «Пять лет искал нормального арбориста. Тут — фото отправил в чат, через 10 минут
              ответили. Сделали ровно как обещали.»
            </p>
          </article>

          <article className="hp-rev-card">
            <div className="head">
              <div className="av">Е</div>
              <div>
                <div className="n">Елена Г.</div>
                <div className="meta">Мытищи · Я.Карты · 18 мар 2026</div>
              </div>
            </div>
            <div className="stars">★★★★★</div>
            <p className="text">
              «Чистка крыши. Приехали ровно в обещанное время, сделали акт, прислали фото до и
              после. Никто не пытался впарить дополнительные услуги.»
            </p>
          </article>

          <article className="hp-rev-card">
            <div className="head">
              <div className="av">Д</div>
              <div>
                <div className="n">Дмитрий К.</div>
                <div className="meta">Химки · УК · 2ГИС · 15 мар 2026</div>
              </div>
            </div>
            <div className="stars">★★★★★</div>
            <p className="text">
              «Восемь домов под управлением. Четвёртый сезон с Обиходом. По вывозу мусора закрыли
              вопрос с ОАТИ полностью.»
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
