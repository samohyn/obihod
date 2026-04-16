import { RichText } from '@payloadcms/richtext-lexical/react'

/**
 * Обёртка над Payload Lexical RichText для маркетинговых страниц.
 * Стилизация через `prose` (Tailwind Typography — нужно подключить позже)
 * или вручную через className.
 */
export function RichTextRenderer({ data, className }: { data: any; className?: string }) {
  if (!data) return null
  return (
    <div className={className ?? 'leading-relaxed text-stone-700'}>
      <RichText data={data} />
    </div>
  )
}
