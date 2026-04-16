import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'role'] },
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
