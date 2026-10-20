'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Длинная цепочка на узком экране: сразу показываем конец — текущую страницу и её раздел. */
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
    if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = el.scrollWidth
  }, [])
  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  )
}
