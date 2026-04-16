import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-orange-700">ОБИХОД</span>
          <span className="hidden text-sm text-stone-500 sm:inline">
            · порядок под ключ
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-stone-700 md:flex">
          <Link href="/arboristika/" className="hover:text-stone-900">
            Арбо
          </Link>
          <Link href="/ochistka-krysh/" className="hover:text-stone-900">
            Снег
          </Link>
          <Link href="/vyvoz-musora/" className="hover:text-stone-900">
            Мусор
          </Link>
          <Link href="/demontazh/" className="hover:text-stone-900">
            Демонтаж
          </Link>
          <Link href="/raiony/" className="hover:text-stone-900">
            Районы
          </Link>
          <Link href="/b2b/" className="hover:text-stone-900">
            УК и B2B
          </Link>
        </nav>
        <a
          href="tel:+74950000000"
          className="rounded-full bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800"
        >
          +7 495 000-00-00
        </a>
      </div>
    </header>
  )
}
