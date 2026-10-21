'use server'

import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'

/** Выйти из предпросмотра и остаться на той же странице — уже в опубликованной версии. */
export async function exitPreview() {
  ;(await draftMode()).disable()
  let path = '/'
  try {
    const ref = new URL((await headers()).get('referer') ?? '')
    // только путь своего сайта: «//чужой-адрес» не пропускаем
    if (!ref.pathname.startsWith('//')) path = ref.pathname + ref.search
  } catch {
    // нет referer — на главную
  }
  redirect(path)
}
