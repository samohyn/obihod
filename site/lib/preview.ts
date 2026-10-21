import { draftMode } from 'next/headers'

/**
 * Включён ли предпросмотр черновиков: кнопка «Открыть черновик» в админке ведёт на
 * /api/preview, тот включает draftMode. Загрузчики страниц тогда читают последнюю версию
 * документа (`draft: true`), иначе — только опубликованное. Вне запроса (сборка) — нет.
 */
export async function isDraftPreview(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}
