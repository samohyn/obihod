import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-stone-600">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-2 font-semibold text-stone-900">ОБИХОД</div>
            <p>Порядок под ключ. Арбо, снег, мусор, демонтаж по Москве и МО.</p>
          </div>
          <div>
            <div className="mb-2 font-semibold text-stone-900">Услуги</div>
            <ul className="space-y-1">
              <li><Link href="/arboristika/" className="hover:underline">Спил деревьев</Link></li>
              <li><Link href="/ochistka-krysh/" className="hover:underline">Очистка крыш</Link></li>
              <li><Link href="/vyvoz-musora/" className="hover:underline">Вывоз мусора</Link></li>
              <li><Link href="/demontazh/" className="hover:underline">Демонтаж</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-stone-900">О компании</div>
            <ul className="space-y-1">
              <li><Link href="/o-kompanii/" className="hover:underline">О нас</Link></li>
              <li><Link href="/litsenzii/" className="hover:underline">Лицензии</Link></li>
              <li><Link href="/kontakty/" className="hover:underline">Контакты</Link></li>
              <li><Link href="/karta-sayta/" className="hover:underline">Карта сайта</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-stone-900">Реквизиты</div>
            <p className="text-xs">
              ООО «Обиход»<br />
              ИНН 7847729123<br />
              Лицензия Росприроднадзора<br />
              СРО · Страховка ГО 10 млн ₽
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-stone-300 pt-4 text-xs text-stone-500">
          © 2026 ООО «Обиход». Все права защищены. ·{' '}
          <Link href="/politika-konfidentsialnosti/" className="hover:underline">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  )
}
