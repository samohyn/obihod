# PAN-10 · Beget SMTP / SPF / DKIM / DMARC setup — инструкция (для оператора + do)

**Issue:** [PAN-10](https://linear.app/samohyn/issue/PAN-10)
**Owner:** `do` + оператор (Beget panel access)
**Объём:** ~0.5-1 чд

## Что нужно от оператора (manual steps в Beget panel)

### 1. Создание mailbox `noreply@obikhod.ru` (5 минут)

В Beget panel → «Почта»:
1. Создай mailbox `noreply@obikhod.ru`
2. Сгенерируй password (32+ символа, через `openssl rand -base64 32`)
3. Сохрани password — понадобится в ENV

### 2. DNS-записи в Beget DNS panel (15 минут)

В Beget panel → «DNS» → выбери `obikhod.ru`:

#### SPF record

```
Type: TXT
Host: @ (или пустое)
Value: v=spf1 include:beget.com -all
TTL: 3600
```

**Проверка:**
```bash
dig TXT obikhod.ru +short
```
Должно показать `"v=spf1 include:beget.com -all"`.

#### DKIM record (генерируется через Beget)

В Beget panel → «Почта» → «DKIM подписи» → включи DKIM для `obikhod.ru`. Beget сгенерирует public key и автоматически добавит TXT-запись:

```
Type: TXT
Host: mail._domainkey.obikhod.ru
Value: v=DKIM1; k=rsa; p=<длинный_publickey_хэш>
TTL: 3600
```

**Проверка:**
```bash
dig TXT mail._domainkey.obikhod.ru +short
```

#### DMARC record (вручную)

```
Type: TXT
Host: _dmarc.obikhod.ru
Value: v=DMARC1; p=quarantine; rua=mailto:samohingeorgy@gmail.com; pct=100
TTL: 3600
```

**Проверка:**
```bash
dig TXT _dmarc.obikhod.ru +short
```

### 3. ENV setup на Beget VPS

В `.env` на VPS (через `do` или сам):

```bash
SMTP_HOST=smtp.beget.com
SMTP_PORT=587
SMTP_USER=noreply@obikhod.ru
SMTP_PASS=<твой password из step 1>
SMTP_FROM_NAME=Обиход admin
SMTP_FROM_EMAIL=noreply@obikhod.ru
```

Также добавь в **GitHub Actions secrets**:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`

### 4. Test отправки (после deploy кода + установки nodemailer)

После закрытия Wave 2.B (PAN-11) и `pnpm add nodemailer`:

```bash
# В корне site/, через node REPL или dev script:
node -e "
const { sendEmail } = require('./dist/lib/messengers/email');
sendEmail({
  to: 'samohingeorgy@gmail.com',
  subject: 'Test SMTP via Beget',
  text: 'Если ты видишь это письмо в Inbox (не Spam) — SMTP работает.',
}).then(console.log).catch(console.error);
"
```

**Verify:**
1. Письмо пришло в Gmail
2. Нет в Spam
3. В Gmail → «Show original» (3 точки → «Show original»):
   - `SPF: PASS`
   - `DKIM: PASS` (с domain=obikhod.ru)
   - `DMARC: PASS`

### 5. DMARC мониторинг (через 1 неделю)

`samohingeorgy@gmail.com` начнёт получать XML reports от Gmail (DMARC aggregate). Это диагностика — failures значит SPF/DKIM не настроены правильно для каких-то отправлений.

**Если есть critical failures:**
- Проверить SPF includes (Beget может сменить hostname)
- Проверить DKIM rotation (если ключ перезаписался)

### 6. Альтернатива (если Beget setup занимает >1 чд)

Использовать **transactional ESP**:

| ESP | Pricing | Setup time | Pros |
|---|---|---|---|
| Resend | $20/мес (50K) | 1 час | Лучший DX, magic link шаблоны |
| Postmark | $15/мес (10K) | 1 час | Высокая deliverability |
| Mailgun | $35/мес (50K) | 2 часа | EU regions |

ENV меняется на:
```bash
SMTP_HOST=smtp.resend.com   # пример Resend
SMTP_PORT=465                # Resend использует SMTPS
SMTP_USER=resend
SMTP_PASS=re_xxxx            # API key
```

**Решение:** sa-panel рекомендует Beget (РФ-юрисдикция, без vendor lock-in). Если `do` оценит >1 чд — пингуем popanel/tamd для решения по ESP.

## Что нужно от do (code/config work)

### Pre-flight check

- [ ] Прочитать [PAN-10](https://linear.app/samohyn/issue/PAN-10) полностью
- [ ] Прочитать ADR-0005 §Versioning (Payload bumps без email impact)
- [ ] Активировать skill `deployment-patterns` (по фронтматтеру do)

### Code work (после оператор-steps 1-3)

- [ ] **Установить nodemailer:**
  ```bash
  cd site && pnpm add nodemailer && pnpm add -D @types/nodemailer
  ```

- [ ] **`site/lib/messengers/email.ts`** — уже scaffolded, заменить TODO на реальный nodemailer transport (см. комменты в файле)

- [ ] **Integration test** (Vitest или Playwright):
  - Mock SMTP через `nodemailer-mock` или `mailpit`
  - Test sendEmail({...}) → verify call

- [ ] **Production smoke** (с оператором):
  - Запросить magic link через Wave 2.B login UI
  - Mock Telegram unavailable (или `Users.telegramChatId = null`)
  - Email должен прийти в Gmail оператора

- [ ] **Documentation:**
  - [ ] `team/specs/US-12-admin-redesign/pre-tasks/do-smtp-setup.md` — этот файл
  - [ ] Update Wave 2.B AC: SMTP smoke passed

## Acceptance

- [ ] SPF / DKIM / DMARC records в DNS `obikhod.ru` (verify через `dig`)
- [ ] Test email на gmail.com проходит SPF + DKIM + DMARC verification
- [ ] Test email не попадает в Spam
- [ ] `SMTP_*` env установлены в Beget VPS + GitHub Actions
- [ ] `pnpm add nodemailer` сделан
- [ ] `site/lib/messengers/email.ts` имеет реальный nodemailer call
- [ ] Wave 2.B (PAN-11) email fallback тест проходит

## Risks

| Risk | Mitigation |
|---|---|
| Beget SMTP rate limit (e.g. 100/час) | На single-operator scenario достаточно. Если scaling — переходим на ESP. |
| DKIM rotation ломает auth | Beget обновляет DKIM сам (если `do` не трогает manually). DMARC report покажет failures. |
| SMTP password leaked | Storage только в ENV. Rotation план — каждые 6 мес. |
| Письма попадают в Spam | DMARC `p=quarantine` сначала, потом `p=reject` после 30 дней stable. Warm-up отправлений: 5/день первую неделю → 50/день вторую. |

## Файлы

```
site/lib/messengers/email.ts                                # scaffolded by sa-panel (TODO nodemailer)
site/.env.example                                           # patched: SMTP_* vars added
team/specs/US-12-admin-redesign/pre-tasks/do-smtp-setup.md  # этот файл
```

## Pinging

- `popanel` — после оператор-steps 1-3 + nodemailer install → start Wave 2.B email channel testing
- `do` — verify Beget DNS panel access, kickoff DNS records creation
- Если переход на ESP — `tamd` review (новый ADR может быть нужен)
