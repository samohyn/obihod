import Link from 'next/link'

import { BrandMark } from '@/components/blocks/v3/shared'

import s from './chrome.module.css'

/** Горизонтальный lockup «Круг сезонов» (design-system/logo/horizontal.svg): знак + ОБИХОД + подпись. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={[s.logo, light ? s.logoLight : ''].join(' ')}
      aria-label="Обиход — на главную"
    >
      <BrandMark className={s.logoMark} thick={46} />
      <span className={s.logoWm} aria-hidden>
        <b>ОБИХОД</b>
        <small>КРУГ СЕЗОНОВ</small>
      </span>
    </Link>
  )
}
