import Link from 'next/link'
import { LogoMark } from './_shared/LogoMark'

export function Header() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" style={{ color: 'var(--c-primary)' }}>
          <LogoMark size={36} animated />
          <span className="nav-logo-word" style={{ color: 'var(--c-ink)' }}>
            Обиход<sup className="nav-reg">®</sup>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#services">Услуги</a>
          <a href="#calc">Калькулятор</a>
          <a href="#how">Как это работает</a>
          <a href="#cases">Кейсы</a>
          <a href="#subscription">Абонемент</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-right">
          <a href="tel:+74951234567" className="nav-phone">
            +7 (495) 123-45-67
          </a>
          <a
            href="#calc"
            className="btn btn-primary"
            style={{ padding: '12px 18px', fontSize: '14px' }}
          >
            Замер бесплатно
          </a>
        </div>
      </div>
    </nav>
  )
}
