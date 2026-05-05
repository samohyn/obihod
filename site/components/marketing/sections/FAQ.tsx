/**
 * FAQ — секция §10
 * Note: 8 native <details>
 * Source: newui/homepage-classic.html (Phase 1: hardcoded; Phase 2: read from Payload Homepage global)
 */
export function FAQ() {
  return (
    <section className="hp-section alt">
      <div className="wrap">
        <div className="eyebrow" style={{ textAlign: 'center' }}>
          § 10 · Частые вопросы
        </div>
        <h2
          style={{ textAlign: 'center', maxWidth: '22ch', marginLeft: 'auto', marginRight: 'auto' }}
        >
          Вопросы, которые задают чаще всего
        </h2>

        <div className="accordion" style={{ maxWidth: '880px', margin: '32px auto 0' }}>
          <details className="item">
            <summary>Какая гарантия на работы?</summary>
            <div className="body">
              <div className="body-inner">
                12 месяцев по сертификату. Если в течение года всплывёт что-то связанное с нашей
                работой — приедем и переделаем. Дополнительно — страхование ответственности на 5 млн
                ₽ в Ингосстрахе по каждому объекту.
              </div>
            </div>
          </details>
          <details className="item">
            <summary>Что входит в фикс-цену, что считается дополнительно?</summary>
            <div className="body">
              <div className="body-inner">
                В смете указаны все работы, материалы, расходники, погрузка и вывоз отходов.
                Дополнительно — только услуги, которых не было в смете и которые согласованы новым
                договором. «Доплата за непредвиденное» — не наша история.
              </div>
            </div>
          </details>
          <details className="item">
            <summary>Какие документы передаём заказчику?</summary>
            <div className="body">
              <div className="body-inner">
                Договор, смета, акт выполненных работ, сертификат с номером, копия страхового
                полиса. Для B2B — ЭДО, счёт-фактура, форма КС-2/КС-3 по запросу.
              </div>
            </div>
          </details>
          <details className="item">
            <summary>Как работает «фото → смета за 10 минут»?</summary>
            <div className="body">
              <div className="body-inner">
                Загрузите фото объекта в форму или пришлите в WhatsApp / Telegram / MAX. AI
                распознаёт тип, размеры, состояние; диспетчер уточняет вручную. В течение 10 минут
                возвращается диапазон цены, зафиксированный на 14 дней. Точная смета — после
                бесплатного замера на объекте.
              </div>
            </div>
          </details>
          <details className="item">
            <summary>Работаете в выходные и праздники?</summary>
            <div className="body">
              <div className="body-inner">
                Да. Плановые работы — по согласованию (выходной с надбавкой 20%). Аварийный выезд —
                24/7 без надбавок: дерево упало на крышу, прорвало кровлю снегом, аварийный
                демонтаж. SLA в МО — 2 часа.
              </div>
            </div>
          </details>
          <details className="item">
            <summary>Кто выезжает — штатные или подрядчики?</summary>
            <div className="body">
              <div className="body-inner">
                Штатная бригада в фирменной одежде хвойного цвета. У бригадира — сертификаты СРО, у
                альпинистов — корочки 3-й категории. Договор подписывается с ООО «Обиход», не с
                физлицом.
              </div>
            </div>
          </details>
          <details className="item">
            <summary>Принимаете ли оплату по безналу?</summary>
            <div className="body">
              <div className="body-inner">
                Да. Физлица — наличными, картой через терминал, СБП по QR. Юрлица — безнал по счёту
                с НДС. Аванс — обычно 30%, окончательный — после подписания акта. Без аванса — для
                постоянных B2B-клиентов.
              </div>
            </div>
          </details>
          <details className="item">
            <summary>Что если смета не подойдёт?</summary>
            <div className="body">
              Замер бесплатный. Если посчитаем смету и она вам не подойдёт — за выезд ничего не
              платите. Никаких «штрафов за вызов» или «компенсаций топлива». Замерщик уехал —
              отношения завершены без обязательств.
            </div>
          </details>
        </div>
      </div>
    </section>
  )
}
