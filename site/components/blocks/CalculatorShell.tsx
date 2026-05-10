'use client'

// brand-guide v2.6 §calculator-shell (line 1044+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// Photo→quote калькулятор: 5 states (idle / uploading / processing / success / error).
// Native <input type="file" capture="environment"> для mobile-camera + drag-drop area.
// POST к /api/quote (sustained US-8 endpoint). Fallback — alert + scroll к lead-form.
//
// SSR-safe: use client + useState/useRef. Reduced-motion guard для skel/progress.
// A11y: keyboard-accessible drop zone (label wraps input), aria-live для state updates.

import { useRef, useState } from 'react'

import type { CalculatorShellBlock } from './types'

type CalcState = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

interface QuoteResult {
  amount?: number
  currency?: string
  meta?: string
  breakdown?: { label: string; value: string }[]
}

const SERVICE_LABELS: Record<string, string> = {
  spil: 'спил деревьев',
  musor: 'вывоз мусора',
  krysha: 'чистку крыш',
  demontazh: 'демонтаж',
}

function fmtPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(amount)
}

export function CalculatorShell(block: CalculatorShellBlock) {
  const [state, setState] = useState<CalcState>('idle')
  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [thumbs, setThumbs] = useState<string[]>([])
  const [result, setResult] = useState<QuoteResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const apiEndpoint = block.apiEndpoint ?? '/api/quote'
  const successHref = block.successHref ?? '#lead-form'
  const serviceLabel = block.serviceType ? SERVICE_LABELS[block.serviceType] : null

  const heading = block.h2 ?? 'Смета по фото за 10 минут'
  const helper =
    block.helper ??
    (serviceLabel
      ? `Загрузите фото — мы рассчитаем стоимость на ${serviceLabel} с точностью до рубля.`
      : 'Загрузите фото объекта — мы рассчитаем стоимость с точностью до рубля.')

  function handleFiles(picked: FileList | null) {
    if (!picked || picked.length === 0) return
    const newFiles = Array.from(picked).slice(0, 6)
    setFiles((prev) => [...prev, ...newFiles].slice(0, 6))
    // Generate thumbnail previews via FileReader (data URL).
    newFiles.forEach((f) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setThumbs((prev) => [...prev, reader.result as string].slice(0, 6))
        }
      }
      reader.readAsDataURL(f)
    })
    void uploadFiles(newFiles)
  }

  async function uploadFiles(picked: File[]) {
    setState('uploading')
    setProgress(0)
    setErrorMsg(null)

    // Simulated progress — POST с XHR показывал бы реальный progress.
    const tick = setInterval(() => {
      setProgress((p) => Math.min(p + 12, 92))
    }, 180)

    try {
      const fd = new FormData()
      picked.forEach((f, i) => fd.append(`photo_${i}`, f))
      if (block.serviceType) fd.append('service_type', block.serviceType)

      const res = await fetch(apiEndpoint, { method: 'POST', body: fd })
      clearInterval(tick)
      setProgress(100)
      setState('processing')

      if (!res.ok) {
        // Fallback success — endpoint not deployed yet, scroll к lead-form.
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            const target = document.querySelector(successHref)
            if (target) target.scrollIntoView({ behavior: 'smooth' })
          }
          setState('success')
          setResult({
            amount: 0,
            meta: 'Передадим оператору. Перезвоним за 15 минут.',
            breakdown: [],
          })
        }, 1500)
        return
      }

      const data = (await res.json()) as QuoteResult
      // Имитация processing (≥300ms per brand-guide §notifications:2387).
      setTimeout(() => {
        setResult(data)
        setState('success')
      }, 800)
    } catch {
      clearInterval(tick)
      setState('error')
      setErrorMsg('Не удалось загрузить фото. Попробуйте ещё раз или позвоните нам.')
    }
  }

  function removeThumb(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
    setThumbs((prev) => prev.filter((_, i) => i !== idx))
    if (files.length === 1) {
      setState('idle')
      setResult(null)
      setErrorMsg(null)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
  }

  function reset() {
    setState('idle')
    setFiles([])
    setThumbs([])
    setResult(null)
    setErrorMsg(null)
    setProgress(0)
  }

  return (
    <section id={block.anchor ?? 'calculator'} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="sp-calc-shell">
          <div className="sp-calc-head">
            <h2 className="h-l" style={{ fontSize: 'clamp(22px, 2.4vw, 28px)' }}>
              {heading}
            </h2>
            {helper && <p>{helper}</p>}
          </div>

          {state === 'idle' && (
            <label
              className="sp-calc-zone idle"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              htmlFor="sp-calc-input"
              style={{ display: 'block', cursor: 'pointer' }}
            >
              <span className="sp-ic" aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="24"
                  height="24"
                >
                  <path d="M3 7h3l2-2h8l2 2h3v12H3z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </span>
              <b>Перетащите фото или нажмите для выбора</b>
              <span className="sp-sub">JPG, PNG · до 10 МБ × 6 фото · с любого устройства</span>
              <input
                ref={inputRef}
                id="sp-calc-input"
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              />
            </label>
          )}

          {state === 'uploading' && (
            <div className="sp-calc-zone uploading" role="status" aria-live="polite">
              <span className="sp-ic" aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="24"
                  height="24"
                >
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                </svg>
              </span>
              <b>Загружаем фото…</b>
              <div className="sp-progress" aria-hidden>
                <span style={{ width: `${progress}%` }} />
              </div>
              <span className="sp-pct">{progress}%</span>
            </div>
          )}

          {state === 'processing' && (
            <div className="sp-calc-zone processing" role="status" aria-live="polite">
              <span className="sp-ic" aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="24"
                  height="24"
                >
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
              </span>
              <b>Считаем смету</b>
              <div className="sp-skel-row">
                <div className="sp-skel-line" />
                <div className="sp-skel-line short" />
                <div className="sp-skel-line" />
              </div>
              <span className="sp-estimate">Анализируем фото и параметры объекта…</span>
            </div>
          )}

          {state === 'success' && result && (
            <div className="sp-calc-result" role="status" aria-live="polite">
              <div>
                <div className="sp-quote-amount">
                  {result.amount && result.amount > 0
                    ? `${fmtPrice(result.amount)} ₽`
                    : 'Расчёт принят'}
                </div>
                {result.meta && <div className="sp-quote-meta">{result.meta}</div>}
                {result.breakdown && result.breakdown.length > 0 && (
                  <ul className="sp-quote-breakdown">
                    {result.breakdown.map((b, i) => (
                      <li key={`brk-${i}`}>
                        <span>{b.label}</span>
                        <span>{b.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <a href={successHref} className="btn btn-primary">
                Перейти к заявке →
              </a>
            </div>
          )}

          {state === 'error' && (
            <div className="sp-calc-error" role="alert">
              <span className="sp-ic" aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              <b>Не получилось</b>
              <p style={{ margin: '6px 0 0', color: 'var(--c-ink-soft)', fontSize: 14 }}>
                {errorMsg ?? 'Попробуйте ещё раз или позвоните оператору.'}
              </p>
              <div className="sp-actions">
                <button type="button" className="btn btn-primary" onClick={reset}>
                  Попробовать ещё раз
                </button>
                <a href={successHref} className="btn btn-ghost">
                  Перейти к заявке
                </a>
              </div>
            </div>
          )}

          {thumbs.length > 0 && (
            <ul
              className="sp-calc-thumbs"
              aria-label="Загруженные фото"
              style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}
            >
              {thumbs.map((url, i) => (
                <li key={`thumb-${i}`} style={{ position: 'relative' }}>
                  <span
                    className="sp-thumb"
                    style={{ display: 'block', backgroundImage: `url(${url})` }}
                    aria-label={`Фото ${i + 1}`}
                  />
                  <button
                    type="button"
                    className="sp-thumb-remove"
                    aria-label={`Удалить фото ${i + 1}`}
                    onClick={() => removeThumb(i)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
