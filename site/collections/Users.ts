import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/lib/auth/access'
import {
  buildAfterChangeAuditHook,
  buildAfterDeleteAuditHook,
  captureLogin,
  captureLogout,
  captureRbacChange,
} from '@/lib/admin/audit/captureHooks'

export const Users: CollectionConfig = {
  slug: 'users',
  // План 09, этап 1: один администратор, API-ключи выключены (никто ими не пользуется;
  // колонки enable_a_p_i_key / api_key / api_key_index остаются пустыми в БД — уберём
  // в задаче дрейфа схемы, чтобы откат релиза не требовал миграции).
  // 5 неудачных входов → блокировка на 15 минут (почты для сброса пароля пока нет —
  // снять раньше можно только на сервере: UPDATE users SET login_attempts=0, lock_until=NULL).
  // Cookie сессии на проде — только по HTTPS.
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  access: {
    admin: isAdmin,
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    unlock: isAdmin,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    group: '09 · Система',
  },
  // PANEL-AUDIT-LOG (ADR-0014): security-event capture.
  // - afterChange: detect role transition → captureRbacChange + general
  //   user-update entry (email/role/2FA changes — masked PII).
  // - afterLogin / afterLogout: __auth pseudo-collection events.
  // - afterDelete: rare-but-tracked admin removal.
  hooks: {
    afterChange: [
      buildAfterChangeAuditHook('users', (doc) =>
        typeof doc?.email === 'string' ? doc.email : null,
      ),
      ({ doc, previousDoc, req }) => {
        // RBAC change detection — separate semantic event.
        // Fire-and-forget: capture не блокирует save (см. captureHooks.ts
        // INCIDENT 2026-05-01).
        const prevRole = (previousDoc as { role?: string } | undefined)?.role ?? null
        const nextRole = (doc as { role?: string } | undefined)?.role ?? ''
        if (prevRole && nextRole && prevRole !== nextRole) {
          const targetId = typeof doc?.id === 'number' ? doc.id : Number(doc?.id)
          const actor = (req as { user?: { id?: number | string } } | null)?.user
          const actorId =
            typeof actor?.id === 'number'
              ? actor.id
              : typeof actor?.id === 'string'
                ? Number(actor.id)
                : null
          if (Number.isFinite(targetId)) {
            captureRbacChange(
              targetId,
              prevRole,
              nextRole,
              Number.isFinite(actorId) ? actorId : null,
              req,
            )
          }
        }
        return doc
      },
    ],
    afterDelete: [
      buildAfterDeleteAuditHook('users', (doc) =>
        typeof doc?.email === 'string' ? doc.email : null,
      ),
    ],
    afterLogin: [
      ({ user, req }) => {
        // Fire-and-forget: login response не должен ждать audit INSERT.
        const id = typeof user?.id === 'number' ? user.id : Number(user?.id)
        const email = typeof user?.email === 'string' ? user.email : ''
        if (Number.isFinite(id)) {
          captureLogin(id, email, req)
        }
        return user
      },
    ],
    afterLogout: [
      ({ req }) => {
        const u = (req as { user?: { id?: number | string } } | null)?.user
        const id = typeof u?.id === 'number' ? u.id : Number(u?.id)
        if (Number.isFinite(id)) {
          captureLogout(id, req)
        }
      },
    ],
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
    // Не используется: webhook `/start` и magic-link удалены (план 09, этап 1 — чистка).
    // Поле оставлено, чтобы не менять схему БД; судьба — на этапе 5 (заявки и админка).
    // Schema-migration: 20260428_140000_users_telegram_chat_id.ts.
    {
      name: 'telegramChatId',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    // PANEL-AUTH-2FA — TOTP 2FA для admin (sa-panel.md AC-1).
    //
    // 3 поля + миграция 20260501_120000_users_totp_fields:
    //   - totpEnabled (boolean, default false) — UI badge статус, admin-readonly
    //   - totpSecretEnc (text, encrypted at rest, hidden) — AES-256-GCM blob
    //   - recoveryCodes (array, hidden) — bcrypt hashes + consumed_at
    //
    // Backwards compat: дефолт false → existing seed admin продолжает работать
    // без 2FA. Управляются ТОЛЬКО через /api/admin/auth/2fa-* endpoints
    // (Payload Local API игнорирует field-level access — server-side OK).
    //
    // SECURITY: read=false / update=false закрывают field от admin UI и REST API.
    // Endpoints вручную whitelist что отдают (никогда не возвращают
    // totpSecretEnc / recoveryCodes naked).
    {
      name: 'totpEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description:
          'Двухфакторная аутентификация (TOTP). Управляется через профиль «Безопасность».',
      },
    },
    {
      name: 'totpSecretEnc',
      type: 'text',
      admin: { hidden: true },
      access: {
        read: () => false,
        update: () => false,
        create: () => false,
      },
    },
    {
      name: 'recoveryCodes',
      type: 'array',
      admin: { hidden: true },
      access: {
        read: () => false,
        update: () => false,
        create: () => false,
      },
      fields: [
        { name: 'hash', type: 'text', required: true },
        { name: 'consumedAt', type: 'date' },
      ],
    },
  ],
}
