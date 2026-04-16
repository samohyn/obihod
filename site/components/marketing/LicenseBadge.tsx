/**
 * E-E-A-T плашка: лицензия + СРО + страховка + допуски.
 * Структура из contex/05_site_structure.md §6.2.
 */
export function LicenseBadge() {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
      <div className="font-semibold text-stone-900">Почему нам можно доверить:</div>
      <ul className="mt-2 grid gap-1 sm:grid-cols-2">
        <li>✓ Лицензия Росприроднадзора (отходы IV класса)</li>
        <li>✓ СРО строителей</li>
        <li>✓ Страховка ГО 10 млн ₽</li>
        <li>✓ Допуски Минтруда №782н</li>
        <li>✓ Порубочный билет за наш счёт</li>
        <li>✓ Договор-оферта + акт + фото-отчёт</li>
      </ul>
    </div>
  )
}
