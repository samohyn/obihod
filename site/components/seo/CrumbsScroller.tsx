'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Длинная цепочка на узком экране: сразу показываем конец — текущую страницу и её раздел;
 * пока начало скрыто, левый край затухает (data-cut), чтобы было видно, что строка прокручивается.
 */
export function CrumbsScroller({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mark = () => {
      if (el.scrollLeft > 4) el.dataset.cut = ''
      else delete el.dataset.cut
    }
    if (el.scrollWidth > el.clientWidth) el.scrollLeft = el.scrollWidth
    mark()
    el.addEventListener('scroll', mark, { passive: true })
    return () => el.removeEventListener('scroll', mark)
  }, [])
  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  )
}
