import type { HomepageGlobal } from '@/lib/homepage'

/**
 * PhotoSmeta — секция §05 (фото → смета USP).
 * Source: newui/homepage-classic.html.
 * Phase 3: example-card данные (id, caption, recognized, range) из Homepage.photoSmeta
 * с graceful fallback. Drop-zone и 3 шага хардкоднуты (статичный mockup).
 */

const FALLBACK_SMETA = {
  exampleId: '№ 0044',
  exampleCaption: 'ФОТО · Аварийная берёза 18 м\nСНТ Берёзовая роща, Истра',
  exampleRecognized: 'берёза, ~18 м, аварийный наклон 25°',
  exampleRangeMin: 12800,
  exampleRangeMax: 16400,
}

export function PhotoSmeta({ data }: { data?: HomepageGlobal }) {
  const smeta = data?.photoSmeta
  const exampleId = smeta?.exampleId ?? FALLBACK_SMETA.exampleId
  const caption = smeta?.exampleCaption ?? FALLBACK_SMETA.exampleCaption
  const recognized = smeta?.exampleRecognized ?? FALLBACK_SMETA.exampleRecognized
  const rangeMin = smeta?.exampleRangeMin ?? FALLBACK_SMETA.exampleRangeMin
  const rangeMax = smeta?.exampleRangeMax ?? FALLBACK_SMETA.exampleRangeMax

  return (
    <section className="hp-section" id="foto-smeta">
      <div className="wrap">
        <div className="eyebrow">§ 05 · Фото → смета · 10 минут</div>
        <h2 style={{ maxWidth: '18ch' }}>Не знаете объём? Пришлите фото</h2>
        <p className="lead">
          Главная фишка, которой нет ни у одного конкурента из 17 проверенных. AI распознаёт объект
          на фото, диспетчер уточняет — диапазон цены приходит в WhatsApp за 10 минут. Зафиксирован
          на 14 дней.
        </p>

        <div className="grid-2" style={{ marginTop: '28px' }}>
          <div>
            <div className="hp-dropzone">
              <svg
                className="ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7h3l2-3h8l2 3h3v12H3z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <div className="t">Перетащите фото или нажмите</div>
              <div className="h">JPG · PNG · HEIC · до 8 фото · до 10 МБ</div>
            </div>

            <div className="hp-steps">
              <div className="hp-step">
                <div className="n">1</div>
                <div>
                  <h4 className="t">Сфотографируйте объект</h4>
                  <p className="d">
                    Дерево, крышу, баню, мусор. С телефона — обычная фотография, без специального
                    ракурса.
                  </p>
                </div>
              </div>
              <div className="hp-step">
                <div className="n">2</div>
                <div>
                  <h4 className="t">AI распознаёт параметры</h4>
                  <p className="d">
                    Тип объекта, размеры, состояние. Диспетчер уточняет вручную при необходимости.
                  </p>
                </div>
              </div>
              <div className="hp-step">
                <div className="n">3</div>
                <div>
                  <h4 className="t">Ответ за 10 минут</h4>
                  <p className="d">
                    Диапазон цены приходит в WhatsApp, Telegram или MAX. Зафиксирован на 14 дней.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hp-output">
            <div className="head">
              <span>Ориентир {exampleId}</span>
              <span>10:08 МСК</span>
            </div>
            <div
              className="photo"
              style={{
                aspectRatio: '1/1',
                backgroundImage: "url('/img-generated/smeta-birch-emergency.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            >
              <span>
                {caption.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 ? <br /> : null}
                  </span>
                ))}
              </span>
            </div>
            <div className="recognized">
              <span className="dot"></span>
              Распознали: {recognized}
            </div>
            <div className="price">
              <div>
                <div className="eyebrow" style={{ marginBottom: '6px' }}>
                  Ориентир
                </div>
                <div className="num">
                  {rangeMin.toLocaleString('ru-RU')} — {rangeMax.toLocaleString('ru-RU')}
                  <span className="currency">₽</span>
                </div>
              </div>
              <div className="meta">ФИКС НА 14 ДНЕЙ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
