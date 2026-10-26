import { getPage } from '@/lib/pages'
import { fillOffer, hours, hoursLine, minutes, type Company } from '@/lib/offer'

/** Общие куски /llms.txt и /llms-full.txt (план 09, этап 7). */

/** Описание компании — только подтверждённый оффер (contex/10_offer.md), цифры из «Компания и контакты». */
export function summary(c: Company): string {
  return (
    'Комплексный подрядчик «порядок под ключ» в Москве и Московской области: вывоз мусора, спил и уход за деревьями, ' +
    'чистка крыш и уборка снега, уборка территории, демонтаж построек. Частные дома и дачи, УК и ТСЖ, застройщики, ' +
    `коммерческие объекты. ${hoursLine(c)}. Перезвоним за ${minutes(c.callbackMinutes)}, смету по фото посчитаем за ` +
    `${minutes(c.photoEstimateMinutes)}, аварийная бригада — за ${hours(c.emergencyHours)}.`
  )
}

/**
 * Описание направления — то же, что видит посетитель: мета страницы из «Страниц».
 * Поля metaDescription и intro в «Услугах» — прежние тексты, сайт их не показывает.
 */
export async function pageDescription(slug: string, c: Company): Promise<string> {
  const page = await getPage(slug).catch(() => null)
  return fillOffer(page?.metaDescription?.trim() ?? '', c)
}
