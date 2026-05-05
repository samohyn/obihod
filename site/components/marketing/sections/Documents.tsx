/**
 * Documents — секция §08
 * Note: 8 trust cards (renamed from Guarantees)
 * Source: newui/homepage-classic.html (Phase 1: hardcoded; Phase 2: read from Payload Homepage global)
 */
export function Documents() {
  return (
    <section className="hp-section alt">
      <div className="wrap">
        <div className="eyebrow">§ 08 · Доверие · лицензии · СРО · парк техники</div>
        <h2 style={{ maxWidth: '22ch' }}>Документы, которые мы прикрепляем к каждому договору</h2>
        <p className="lead">
          У клиента всегда есть основание спросить «а кто вы?». Ниже — формальные ответы. Все
          документы — в актуальной редакции, по запросу присылаем PDF до подписания договора.
        </p>

        <div className="hpc-trust">
          <div className="hpc-trust-card">
            <div
              className="doc"
              style={{
                backgroundImage: "url('/img-generated/doc-sro.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                minHeight: '120px',
                position: 'relative',
              }}
            >
              <span className="badge-ok">✓</span>
              <span>
                СВИДЕТЕЛЬСТВО
                <br />
                СРО · ИНГ-РЕГИОН
                <br />№ 0042-2026
                <br />
                действует до 2027
              </span>
            </div>
            <h3 className="t">СРО · Свидетельство о допуске</h3>
            <p className="meta">Актуально · ИНГ-РЕГИОН · 1 млрд ₽</p>
          </div>
          <div className="hpc-trust-card">
            <div
              className="doc"
              style={{
                backgroundImage: "url('/img-generated/doc-insurance.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                minHeight: '120px',
                position: 'relative',
              }}
            >
              <span className="badge-ok">✓</span>
              <span>
                ПОЛИС СТРАХОВАНИЯ
                <br />
                ОТВЕТСТВЕННОСТИ
                <br />
                ИНГОССТРАХ · 5 МЛН ₽<br />
                действует до 2027
              </span>
            </div>
            <h3 className="t">Страховка ответственности</h3>
            <p className="meta">Актуально · Ингосстрах · 5 млн ₽</p>
          </div>
          <div className="hpc-trust-card">
            <div
              className="doc"
              style={{
                backgroundImage: "url('/img-generated/doc-cert-arborist.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                minHeight: '120px',
                position: 'relative',
              }}
            >
              <span className="badge-ok">✓</span>
              <span>
                СЕРТИФИКАТ
                <br />
                АРБОРИСТ-АЛЬПИНИСТ
                <br />3 РАЗРЯД
                <br />
                выдан 2024 · действует
              </span>
            </div>
            <h3 className="t">Сертификаты бригадиров</h3>
            <p className="meta">8 человек · альп. 2-3 разряд</p>
          </div>
          <div className="hpc-trust-card">
            <div
              className="doc"
              style={{
                backgroundImage: "url('/img-generated/doc-egryl.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                minHeight: '120px',
                position: 'relative',
              }}
            >
              <span className="badge-ok">✓</span>
              <span>
                ВЫПИСКА ЕГРЮЛ
                <br />
                ООО ОБИХОД
                <br />
                ИНН 1111111111
                <br />с 2020 года
              </span>
            </div>
            <h3 className="t">ЕГРЮЛ · ООО «Обиход»</h3>
            <p className="meta">с 2020 · 12 лет на рынке</p>
          </div>
          <div className="hpc-trust-card">
            <div
              className="doc"
              style={{
                backgroundImage: "url('/img-generated/doc-equipment.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                minHeight: '120px',
                position: 'relative',
              }}
            >
              <span className="badge-ok">✓</span>
              <span>
                ПАСПОРТ ТЕХНИКИ
                <br />
                АВТОВЫШКА АГП-22
                <br />
                ОТВ. ПОДЪЁМА 22 М<br />
                осмотр 2026
              </span>
            </div>
            <h3 className="t">Парк техники</h3>
            <p className="meta">2× автовышки · 4× газели · дробилка</p>
          </div>
          <div className="hpc-trust-card">
            <div
              className="doc"
              style={{
                backgroundImage: "url('/img-generated/doc-152fz.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                minHeight: '120px',
                position: 'relative',
              }}
            >
              <span className="badge-ok">✓</span>
              <span>
                СВИДЕТЕЛЬСТВО
                <br />
                ОВ-152 ФЗ
                <br />
                оператор перс. данных
                <br />с 2024
              </span>
            </div>
            <h3 className="t">152-ФЗ · Оператор ПД</h3>
            <p className="meta">Реестр Роскомнадзора · с 2024</p>
          </div>
          <div className="hpc-trust-card">
            <div
              className="doc"
              style={{
                backgroundImage: "url('/img-generated/doc-waste.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                minHeight: '120px',
                position: 'relative',
              }}
            >
              <span className="badge-ok">✓</span>
              <span>
                ДОГОВОР НА УТИЛИЗАЦИЮ
                <br />
                ПОЛИГОН ТКО
                <br />
                «ВТОРРЕСУРС»
                <br />с актами на каждый вывоз
              </span>
            </div>
            <h3 className="t">Утилизация по 89-ФЗ</h3>
            <p className="meta">Лицензированный полигон · акты</p>
          </div>
          <div className="hpc-trust-card">
            <div
              className="doc"
              style={{
                backgroundImage: "url('/img-generated/doc-eis.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                minHeight: '120px',
                position: 'relative',
              }}
            >
              <span className="badge-ok">✓</span>
              <span>
                АККРЕДИТАЦИЯ
                <br />
                ЕИС ЗАКУПКИ
                <br />
                44/223-ФЗ
                <br />с 2025
              </span>
            </div>
            <h3 className="t">44/223-ФЗ · Госзакупки</h3>
            <p className="meta">Аккредитация ЕИС · с 2025</p>
          </div>
        </div>
      </div>
    </section>
  )
}
