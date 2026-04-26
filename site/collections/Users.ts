import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  // useAPIKey: true — позволяет генерировать API ключи на странице юзера
  // в /admin/collections/users/<id>. Authorization: users API-Key <key>.
  // Используется командой (cms ops без участия оператора) до полноценного
  // bot-user в OBI-17. Audit-trail в Payload versions фиксирует actor по
  // email юзера-владельца ключа.
  //
  // КРИТИЧНО: схема (3 поля + индекс) добавляется через explicit миграцию
  // 20260426_153500_users_api_key. Любое изменение этого блока требует
  // соответствующей миграции — НЕ рассчитывать на push:true (на prod
  // отключён, и был P0 incident 2026-04-26 когда первая попытка без
  // миграции положила /api/users/login на 10 минут).
  auth: {
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'enableAPIKey'],
    group: '09 · Система',
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'SEO Editor', value: 'seo' },
        { label: 'Content Editor', value: 'content' },
      ],
    },
  ],
}
