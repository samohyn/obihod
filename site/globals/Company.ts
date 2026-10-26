import type { Field, GlobalConfig, Validate } from 'payload'

import { isAdmin } from '@/lib/auth/access'
import { revalidateGlobalAfterChange } from '@/lib/admin/revalidateSite'
import { OFFER_TOKENS } from '@/lib/offer'

/**
 * «Компания и контакты» — единый источник контактов, реквизитов, часов и цифр оффера
 * (план 09, этап 4.3; оффер — contex/10_offer.md). Меняете здесь — шапка, подвал, формы,
 * страницы районов и разметка для поисковиков подхватывают сами (lib/company.ts).
 */

const E164_RE = /^\+7\d{10}$/
const INN_RE = /^\d{10,12}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

export const validateE164: Validate = (v) =>
  typeof v === 'string' && E164_RE.test(v) ? true : 'Формат E.164: +7XXXXXXXXXX (11 цифр)'

export const validateInn: Validate = (v) =>
  !v || (typeof v === 'string' && INN_RE.test(v)) ? true : 'ИНН — 10 или 12 цифр'

const validateTime: Validate = (v) =>
  typeof v === 'string' && TIME_RE.test(v) ? true : 'Время в формате ЧЧ:ММ, например 08:00'

const text = (
  name: string,
  label: string,
  defaultValue: string,
  description?: string,
  width?: string,
): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: { description, width },
})

const num = (
  name: string,
  label: string,
  defaultValue: number,
  description?: string,
  width = '50%',
): Field => ({
  name,
  type: 'number',
  label,
  required: true,
  min: 0,
  defaultValue,
  admin: { description, width },
})

const time = (name: string, label: string, defaultValue: string, description: string): Field => ({
  name,
  type: 'text',
  label,
  required: true,
  defaultValue,
  validate: validateTime,
  admin: { description, width: '50%' },
})

export const Company: GlobalConfig = {
  slug: 'company',
  label: 'Компания и контакты',
  admin: {
    description:
      'Телефон, почта, адрес, реквизиты, часы и цифры оффера — в одном месте. Меняете здесь — сайт, формы и разметка для поисковиков подхватывают сами.',
    group: 'Настройки сайта',
  },
  access: { read: () => true, update: isAdmin },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контакты',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'phoneDisplay',
                  type: 'text',
                  label: 'Телефон на сайте',
                  required: true,
                  maxLength: 20,
                  defaultValue: '+7 (985) 170-51-11',
                  admin: { description: 'Как видит человек: +7 (985) 170-51-11', width: '50%' },
                },
                {
                  name: 'phoneE164',
                  type: 'text',
                  label: 'Телефон для звонка',
                  required: true,
                  maxLength: 16,
                  defaultValue: '+79851705111',
                  validate: validateE164,
                  admin: {
                    description: 'Для кнопки «Позвонить» и разметки: +7XXXXXXXXXX',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'email',
              type: 'email',
              label: 'Почта',
              defaultValue: 'partner@obikhod.ru',
            },
            text('streetAddress', 'Улица, дом, корпус', 'ул. Амет-хан Султана, 15, к1'),
            {
              type: 'row',
              fields: [
                text('addressLocality', 'Город', 'Жуковский', undefined, '40%'),
                text('addressRegion', 'Регион', 'Московская область', undefined, '40%'),
                text('postalCode', 'Индекс', '140185', undefined, '20%'),
              ],
            },
          ],
        },
        {
          label: 'Реквизиты',
          description:
            'Для подвала, договоров и разметки. Пустые поля и заглушки из единиц на сайт не выводятся.',
          fields: [
            text('legalName', 'Юридическое лицо', '', 'Например «ООО «Обиход-МО»»'),
            {
              type: 'row',
              fields: [
                {
                  name: 'taxId',
                  type: 'text',
                  label: 'ИНН',
                  maxLength: 12,
                  validate: validateInn,
                  admin: { width: '34%' },
                },
                { name: 'kpp', type: 'text', label: 'КПП', maxLength: 9, admin: { width: '33%' } },
                {
                  name: 'ogrn',
                  type: 'text',
                  label: 'ОГРН',
                  maxLength: 15,
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Часы работы',
          description:
            'Из них собирается «Ежедневно 8:00–22:00 · заявки 24/7» под телефоном и часы в разметке.',
          fields: [
            {
              type: 'row',
              fields: [
                time('opens', 'Менеджер на связи с', '08:00', 'ЧЧ:ММ'),
                time('closes', 'до', '22:00', 'ЧЧ:ММ'),
              ],
            },
            {
              name: 'leadsAllDay',
              type: 'checkbox',
              label: 'Заявки принимаем круглосуточно',
              defaultValue: true,
            },
            time(
              'nightCallbackTime',
              'Ночные заявки — перезвоним в',
              '08:15',
              'Заявка ночью или в последние минуты перед закрытием: в форме «Перезвоним до …» покажем это время',
            ),
          ],
        },
        {
          label: 'Заявки',
          description: 'Как панель заявок считает срок ответа и сколько хранит фото клиентов.',
          fields: [
            {
              name: 'leadPhotoRetentionDays',
              type: 'number',
              label: 'Фото закрытых заявок хранить, дней',
              required: true,
              min: 1,
              max: 30,
              defaultValue: 30,
              admin: {
                description:
                  'Фото присылают ради сметы. Когда заявка закрыта, цель достигнута — по 152-ФЗ (ст. 21, ч. 4) данные уничтожаются не позже чем через 30 дней. Каждую ночь после бэкапа сайт удаляет фото заявок, закрытых раньше этого срока.',
              },
            },
            {
              name: 'replyByWorkingHours',
              type: 'checkbox',
              label: 'Срок ответа в панели заявок — по часам работы',
              defaultValue: true,
              admin: {
                description:
                  'Включено: заявка ночью или перед закрытием ждёт ответа до времени «Ночные заявки — перезвоним в» (вкладка «Часы работы»), как обещано в форме. Выключено: срок всегда «Перезвоним за» от момента заявки, круглосуточно.',
              },
            },
          ],
        },
        {
          label: 'Оффер',
          description: `Цифры обещаний клиентам. Сайт подставляет их в формы, страницы районов, карту выезда и разметку для поисковиков. В текстах страниц, статей и районов вместо цифр пишите метки — сайт подставит значения отсюда: ${OFFER_TOKENS.map((t) => `${t.token} — ${t.hint}`).join('; ')}.`,
          fields: [
            {
              type: 'row',
              fields: [
                num('callbackMinutes', 'Перезвоним за, минут', 10, 'После заявки в рабочие часы'),
                num(
                  'callbackLateDiscountRub',
                  'Не перезвонили вовремя — скидка, ₽',
                  500,
                  '0 — без скидки',
                ),
              ],
            },
            num('photoEstimateMinutes', 'Смета по фото за, минут', 30, undefined, '50%'),
            {
              type: 'row',
              fields: [
                num('emergencyHours', 'Аварийная бригада за, часов', 2),
                num('emergencyRadiusKm', 'Аварийная зона, км от МКАД', 30),
              ],
            },
            num('freeVisitRadiusKm', 'Бесплатный выезд оценщика, км от МКАД', 50, undefined, '50%'),
            {
              type: 'row',
              fields: [
                num('arrivalWindowHours', 'Окно приезда, часов', 2),
                num('lateArrivalDiscountPercent', 'Опоздали — скидка, %', 10, '0 — без скидки'),
              ],
            },
            num(
              'snowReactionHours',
              'Абонемент: реакция на снегопад, часов',
              6,
              'Для УК и ТСЖ',
              '50%',
            ),
          ],
        },
      ],
    },
  ],
}
