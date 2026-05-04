import Link from 'next/link'

export function Coverage() {
  return (
    <section className="hp-section hp-cov-section">
      <div className="hp-cov-bg">
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 1280 600"
          aria-hidden="true"
        >
          <defs>
            <pattern id="topo-c" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path
                d="M0 60c20-10 40-10 60 0s40 10 60 0"
                fill="none"
                stroke="#2d5a3d"
                strokeWidth="0.6"
              />
              <path
                d="M0 30c20-10 40-10 60 0s40 10 60 0"
                fill="none"
                stroke="#2d5a3d"
                strokeWidth="0.6"
              />
              <path
                d="M0 90c20-10 40-10 60 0s40 10 60 0"
                fill="none"
                stroke="#2d5a3d"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-c)" />
        </svg>
      </div>

      <div className="wrap">
        <div className="eyebrow">§ 09 · География · Москва и МО</div>
        <h2 style={{ maxWidth: '22ch' }}>12 районов в активной работе · до 120 км от МКАД</h2>
        <p className="lead">
          Литера{' '}
          <span
            style={{
              background: 'var(--c-accent)',
              color: 'var(--c-ink)',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            A
          </span>{' '}
          — приоритет, есть закреплённая бригада. Остальные — выезд по согласованию (SLA 6 ч).
        </p>

        <div className="hp-cov">
          <Link
            href="/raiony/odintsovo"
            className="hp-cov-chip pilot"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Одинцово</div>
            <div className="meta">
              <span className="dist">14 КМ ОТ МКАД</span>
              <span className="stat">8 кейсов</span>
            </div>
          </Link>
          <Link
            href="/raiony/krasnogorsk"
            className="hp-cov-chip pilot"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Красногорск</div>
            <div className="meta">
              <span className="dist">9 КМ ОТ МКАД</span>
              <span className="stat">6 кейсов</span>
            </div>
          </Link>
          <Link
            href="/raiony/mytishchi"
            className="hp-cov-chip pilot"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Мытищи</div>
            <div className="meta">
              <span className="dist">8 КМ ОТ МКАД</span>
              <span className="stat">7 кейсов</span>
            </div>
          </Link>
          <Link
            href="/raiony/khimki"
            className="hp-cov-chip pilot"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Химки</div>
            <div className="meta">
              <span className="dist">7 КМ ОТ МКАД</span>
              <span className="stat">SLA 4 ч</span>
            </div>
          </Link>
          <Link
            href="/raiony/istra"
            className="hp-cov-chip pilot"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Истра</div>
            <div className="meta">
              <span className="dist">28 КМ ОТ МКАД</span>
              <span className="stat">4 кейса</span>
            </div>
          </Link>
          <Link
            href="/raiony/pushkino"
            className="hp-cov-chip pilot"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Пушкино</div>
            <div className="meta">
              <span className="dist">15 КМ ОТ МКАД</span>
              <span className="stat">5 кейсов</span>
            </div>
          </Link>
          <Link
            href="/raiony/ramenskoe"
            className="hp-cov-chip pilot"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Раменское</div>
            <div className="meta">
              <span className="dist">25 КМ ОТ МКАД</span>
              <span className="stat">6 кейсов</span>
            </div>
          </Link>
          <Link
            href="/raiony/zhukovskij"
            className="hp-cov-chip"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Жуковский</div>
            <div className="meta">
              <span className="dist">25 КМ ОТ МКАД</span>
              <span className="stat">SLA 6 ч</span>
            </div>
          </Link>
          <Link
            href="/raiony/domodedovo"
            className="hp-cov-chip"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Домодедово</div>
            <div className="meta">
              <span className="dist">22 КМ ОТ МКАД</span>
              <span className="stat">SLA 6 ч</span>
            </div>
          </Link>
          <Link href="/raiony/podolsk" className="hp-cov-chip" style={{ textDecoration: 'none' }}>
            <div className="name">Подольск</div>
            <div className="meta">
              <span className="dist">15 КМ ОТ МКАД</span>
              <span className="stat">SLA 6 ч</span>
            </div>
          </Link>
          <Link href="/raiony/korolev" className="hp-cov-chip" style={{ textDecoration: 'none' }}>
            <div className="name">Королёв</div>
            <div className="meta">
              <span className="dist">12 КМ ОТ МКАД</span>
              <span className="stat">SLA 6 ч</span>
            </div>
          </Link>
          <Link
            href="/raiony/balashikha"
            className="hp-cov-chip"
            style={{ textDecoration: 'none' }}
          >
            <div className="name">Балашиха</div>
            <div className="meta">
              <span className="dist">5 КМ ОТ МКАД</span>
              <span className="stat">SLA 6 ч</span>
            </div>
          </Link>
        </div>

        <div className="hp-cov-more">
          <Link href="/raiony">+ ещё 62 района по запросу → /raiony/</Link>
        </div>
      </div>
    </section>
  )
}
