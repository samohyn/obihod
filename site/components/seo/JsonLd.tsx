/**
 * JsonLd Server Component — рендерит <script type="application/ld+json">.
 * Принимает один объект schema или массив (склеивает в @graph).
 */
type Props = {
  schema: object | object[]
}

export function JsonLd({ schema }: Props) {
  const json = JSON.stringify(
    Array.isArray(schema)
      ? { '@context': 'https://schema.org', '@graph': schema }
      : { '@context': 'https://schema.org', ...schema },
  )
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
