'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  beforeLabel?: string
  afterLabel?: string
  caption?: { before?: string; after?: string }
}

/**
 * Drag-slider «до/после». Пока placeholder-stripes вместо реальных фото —
 * подменим на <Image> из коллекции Cases, когда в Payload будут before/after.
 */
export function BeforeAfter({
  beforeLabel = 'ДО',
  afterLabel = 'ПОСЛЕ',
  caption,
}: Props) {
  const [pos, setPos] = useState(52)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef(false)

  useEffect(() => {
    const onMove = (clientX: number) => {
      const wrap = wrapRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
      setPos((x / rect.width) * 100)
    }
    const handleUp = () => {
      dragRef.current = false
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      onMove(e.clientX)
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current) return
      onMove(e.touches[0]?.clientX ?? 0)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = true
    const wrap = wrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    setPos((x / rect.width) * 100)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    dragRef.current = true
    const wrap = wrapRef.current
    if (!wrap) return
    const clientX = e.touches[0]?.clientX ?? 0
    const rect = wrap.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
    setPos((x / rect.width) * 100)
  }

  return (
    <div
      className="ba-slider"
      ref={wrapRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="slider"
      aria-label="Сравнение до и после"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5))
        if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5))
      }}
    >
      <div className="ba-slider-pane ba-after">
        <div className="ba-stripes" />
        <span className="ba-mono">{caption?.after || 'ПОСЛЕ · УЧАСТОК ЧИСТЫЙ'}</span>
        <span className="ba-tag ba-tag-right">{afterLabel}</span>
      </div>
      <div
        className="ba-slider-pane ba-before"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <div className="ba-stripes ba-stripes-before" />
        <span className="ba-mono">{caption?.before || 'ДО · АВАРИЙНЫЕ ДЕРЕВЬЯ'}</span>
        <span className="ba-tag ba-tag-left">{beforeLabel}</span>
      </div>
      <div className="ba-handle" style={{ left: pos + '%' }}>
        <span className="ba-handle-knob">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 6 3 12 9 18" />
            <polyline points="15 6 21 12 15 18" />
          </svg>
        </span>
      </div>
    </div>
  )
}
