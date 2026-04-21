import { LogoMark } from './_shared/LogoMark'

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="nav-logo" style={{ color: 'var(--c-accent)' }}>
              <LogoMark size={40} />
              <span className="nav-logo-word">Обиход</span>
            </div>
            <div className="foot-slogan">
              Один подрядчик на&nbsp;весь год: спил, снег, демонтаж, вывоз.<br />
              Работаем в&nbsp;Московской области, радиус 120&nbsp;км от&nbsp;МКАД.
            </div>
          </div>
          <div className="foot-col">
            <h4>Услуги</h4>
            <ul>
              <li><a href="#services">Спил деревьев</a></li>
              <li><a href="#services">Уборка снега</a></li>
              <li><a href="#services">Демонтаж и снос</a></li>
              <li><a href="#services">Вывоз мусора</a></li>
              <li><a href="#subscription">Абонементы</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Компания</h4>
            <ul>
              <li><a href="#team">О нас</a></li>
              <li><a href="#team">Команда</a></li>
              <li><a href="#cases">Кейсы</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Контакты</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Контакты</h4>
            <ul>
              <li><a href="tel:+74951234567">+7 (495) 123-45-67</a></li>
              <li><a href="mailto:hello@obihod.ru">hello@obihod.ru</a></li>
              <li><a href="#">Telegram @obihod</a></li>
              <li><a href="#">ВКонтакте</a></li>
              <li><a href="#">Яндекс.Карты</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div>© 2026 ООО «ОБИХОД-МО» · ИНН 7847729123 · ОГРН 1027700000000</div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <a href="/politika-konfidentsialnosti/">Политика конфиденциальности</a>
            <a href="/oferta/">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
