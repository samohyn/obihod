import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/lib/auth/access'

/**
 * «Фото заявок» — снимки объекта, которые клиент прикрепил к форме заявки (план 09, этапы 2 и 5).
 *
 * Закрыто: файл отдаётся только администратору (/api/lead-photos/file/… проверяет доступ на чтение),
 * на сайте не публикуется. Сервер принимает фото только из /api/leads: проверяет формат по
 * сигнатуре, перекодирует в JPEG до 2000 px и снимает метаданные (EXIF, GPS) — lib/leads/photos.ts.
 * Файлы — в своей папке lead-photos, не в media: всё, что лежит в media, отдаёт публичный маршрут
 * медиатеки (/api/media/file/…). На сервере папка общая для релизов (симлинк из shared, как media)
 * и входит в ежедневный бэкап вместе с media — deploy/server/obikhod-deploy.sh, deploy/backup/.
 */
export const LeadPhotos: CollectionConfig = {
  slug: 'lead-photos',
  labels: { singular: 'Фото заявки', plural: 'Фото заявок' },
  admin: {
    group: '01 · Заявки',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'lead', 'createdAt'],
    description:
      'Фото объекта, которые клиенты прикрепили к заявке. Видны только в админке, на сайте не публикуются.',
  },
  access: {
    read: isAdmin,
    // создаёт только /api/leads (Local API), из админки фото добавляют в самой заявке
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'lead-photos',
    adminThumbnail: 'thumb',
    imageSizes: [{ name: 'thumb', width: 400, height: 400, fit: 'inside' }],
    mimeTypes: ['image/jpeg'],
  },
  fields: [
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      label: 'Заявка',
      admin: { readOnly: true, description: 'Заявка, к которой клиент прикрепил фото.' },
    },
  ],
  timestamps: true,
}
