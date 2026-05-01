# TOTP 2FA — operator notes

Spec: [`specs/PANEL-AUTH-2FA/sa-panel.md`](../../../../specs/PANEL-AUTH-2FA/sa-panel.md).

## Что внутри

- `encrypt.ts` — AES-256-GCM шифрование `totpSecret` (env `TOTP_ENCRYPTION_KEY`, 32 bytes base64).
- `recoveryCodes.ts` — генерация 10 codes `XXXX-XXXX-XXXX`, bcrypt-hash (cost 10), constant-time verify.
- `totpVerify.ts` — `otplib.authenticator` (sha1 / 30s / 6 digits, window ±1 step).
- `setupSession.ts` — in-memory Map<token, {secret, userId, expiresAt}> с TTL 10 минут (для setup до verify).

## Env

```bash
# Generate fresh key once per environment:
openssl rand -base64 32

# Add to .env.local / GitHub Actions secrets / Beget shared/.env:
TOTP_ENCRYPTION_KEY="<base64-32-bytes>"
```

КРИТИЧНО: **double quotes обязательны** для значения с возможным `+` / `=` —
incident 2026-04-28 deploy.yml exit 127 (см. memory `feedback_env_example_quoting`).

## Как разблокировать пользователя при потере телефона + recovery codes

Сценарий: оператор потерял телефон с Google Authenticator и не может найти
скачанный `obikhod-recovery-codes-*.txt`.

Восстановление вручную через Payload Local API на VPS:

```bash
# 1. SSH на Beget VPS
ssh deploy@45.153.190.107

# 2. cd в site/
cd ~/obikhod/site

# 3. Запустить inline tsx скрипт (Payload Local API игнорирует field-level access)
NODE_ENV=production tsx --require=./scripts/_payload-cjs-shim.cjs --env-file=shared/.env -e "
  import('payload').then(async ({ getPayload }) => {
    const config = (await import('./payload.config.js')).default
    const payload = await getPayload({ config })
    const result = await payload.update({
      collection: 'users',
      where: { email: { equals: 'admin@obikhod.ru' } },
      data: { totpEnabled: false, totpSecretEnc: null, recoveryCodes: [] },
    })
    console.log('disabled 2FA for', result.docs.length, 'user(s)')
    process.exit(0)
  })
"
```

Audit-trail: Payload `versions` collection фиксирует who/when (актор —
SSH-сессия оператора, не attribution к user-объекту). Это compensating control —
после disable user может перевключить 2FA через профиль.

## Rotation `TOTP_ENCRYPTION_KEY`

**Не реализовано на MVP.** При утечке ключа процедура:

1. Сгенерировать новый ключ.
2. Запустить миграционный скрипт (TBD) который декриптит каждый
   `totpSecretEnc` старым ключом и шифрует новым.
3. Подменить env-переменную, restart процесс.

Проще на старте: попросить всех пользователей с `totpEnabled=true` отключить
и перевключить 2FA. Из-за low-volume (один-два оператора) — приемлемо.

## Что НЕ делать

- НЕ логировать `totpSecret`, `otp`, `recoveryCodes` (plain или hash) в console
  / Sentry / Payload audit. `cr-panel` обязан грепать перед каждым merge.
- НЕ возвращать эти поля в API response — `access.read: () => false` на полях +
  endpoints вручную whitelist-ят что отдают.
- НЕ передавать `TOTP_ENCRYPTION_KEY` через CLI args (visible в `ps`) — только
  через env file.
