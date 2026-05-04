export function PhotoSmeta() {
  return (
    <section className="hp-section" id="foto-smeta">
      <div className="wrap">
        <div className="eyebrow">§ 05 · Фото → смета · 10 минут</div>
        <h2 style={{ maxWidth: '18ch' }}>Не знаете объём? Пришлите фото</h2>
        <p className="lead">
          Главная фишка, которой нет ни у одного конкурента из 17 проверенных. AI распознаёт
          объект на фото, диспетчер уточняет — диапазон цены приходит в WhatsApp за 10 минут.
          Зафиксирован на 14 дней.
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
              <span>Ориентир № 0044</span>
              <span>10:08 МСК</span>
            </div>
            <div className="photo" style={{ aspectRatio: '1/1' }}>
              <span>
                ФОТО · Аварийная берёза 18 м
                <br />
                СНТ Берёзовая роща, Истра
              </span>
            </div>
            <div className="recognized">
              <span className="dot"></span>
              Распознали: берёза, ~18 м, аварийный наклон 25°
            </div>
            <div className="price">
              <div>
                <div className="eyebrow" style={{ marginBottom: '6px' }}>
                  Ориентир
                </div>
                <div className="num">
                  12 800 — 16 400<span className="currency">₽</span>
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
