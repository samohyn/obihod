# sa-panel — Wave 2.A · AdminLogin UI override (без auth changes)

**Issue:** [PAN-5](https://linear.app/samohyn/issue/PAN-5)
**Wave:** 2.A (split from Wave 2 решением popanel 2026-04-28)
**Source of truth:** [brand-guide.html §12.1](../../../design-system/brand-guide.html) · [art-concept-v2.md §1](art-concept-v2.md) · [ADR-0005](../../adr/ADR-0005-admin-customization-strategy.md)
**Status:** `approved` (popanel 2026-04-28)
**Skills активированы:** `api-design` (для Wave 2.B), `hexagonal-architecture` (для Wave 2.B). Wave 2.A — UI-only, skill-check satisfied через подключение к существующей `views.Login` API.
**Author:** sa-panel
**Date:** 2026-04-28

---

## Контекст

Wave 2 раздроблён 2026-04-28 popanel'ом из-за infra blockers (Telegram bot ❌ + Beget SMTP ❌). Этот документ — **тонкий scope Wave 2.A: только UI override без изменения auth flow**.

**Что Wave 2.A даёт оператору:** красивый login по §12.1 mockup через 1-2 дня, без ожидания pre-tasks. Native email+password остаётся.

**Wave 2.B** (magic link auth) — отдельный документ [sa-panel-wave2b.md](sa-panel-wave2b.md), отдельный issue [PAN-11](https://linear.app/samohyn/issue/PAN-11), blocked by PAN-9 (Telegram setup) + PAN-10 (SMTP setup).

## ADR-0005 уровень кастомизации

| Подсистема | Уровень | Обоснование |
|---|---|---|
| Login screen UI | **Уровень 2** (React `admin.components.views.Login`) | Custom view через Payload API. Тонкий слой: только верстка + HTML form. Auth логика остаётся native (Payload `useAuth().login(email, password)`) |
| Login layout (lockup + footer + carд 320px) | **Уровень 1** (CSS) — уже сделано Wave 1 | `site/app/(payload)/custom.scss:308-364` покрыл carд + autofill |
| Lockup (brand mark + admin-tagline) | **Уже работает** через `beforeLogin` slot | `BeforeLoginLockup.tsx` подключен в `payload.config.ts` |
| Footer | **Уже работает** через `afterLogin` slot | `AfterLoginFooter.tsx` подключен в `payload.config.ts` |

---

## Scope IN

### A.1 · `AdminLogin.tsx` custom view

**Anatomy** (по [brand-guide.html §12.1](../../../design-system/brand-guide.html#L2534)):

```
┌────────────────────────────────────────┐
│   [BeforeLoginLockup — уже на проде]   │
├────────────────────────────────────────┤
│      ┌──────────────────────────┐      │
│      │ Login carд 320px         │      │
│      │  Email                   │      │
│      │  [grigorij@obikhod.ru ]  │      │
│      │                          │      │
│      │  Пароль                  │      │
│      │  [••••••••              ]│      │
│      │                          │      │
│      │  ┌──────────────────┐    │      │
│      │  │      Войти       │ ←  │ янтарная primary
│      │  └──────────────────┘    │      │
│      │                          │      │
│      │  Забыли пароль? →        │      │
│      └──────────────────────────┘      │
├────────────────────────────────────────┤
│   [AfterLoginFooter — уже на проде]    │
└────────────────────────────────────────┘
```

**Имплементация через Payload `admin.components.views.Login`:**

```typescript
// site/components/admin/AdminLogin.tsx
'use client';
import { useAuth } from '@payloadcms/ui';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<'default' | 'loading' | 'error'>('default');
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState('loading');
    setErrorCode(null);
    try {
      await login({ email, password });
      router.push('/admin');
    } catch (err) {
      setState('error');
      setErrorCode(err instanceof Error ? err.message : 'unknown');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login__form" aria-label="Вход в админку">
      <div className="ad-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={state === 'loading'}
          aria-invalid={errorCode === 'invalid_email' ? 'true' : 'false'}
        />
      </div>

      <div className="ad-field">
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={state === 'loading'}
        />
      </div>

      {errorCode && (
        <div role="alert" aria-live="polite" className="ad-error">
          {errorCode === 'invalid_credentials' && 'Неверный email или пароль.'}
          {errorCode === 'locked' && 'Аккаунт временно заблокирован. Попробуй через 15 минут.'}
          {!['invalid_credentials', 'locked'].includes(errorCode) && 'Не удалось войти. Попробуй ещё раз.'}
        </div>
      )}

      <button type="submit" className="btn--style-primary form-submit" disabled={state === 'loading'}>
        {state === 'loading' ? 'Вход…' : 'Войти'}
      </button>

      <a href="/admin/forgot" className="ad-link">Забыли пароль? →</a>
    </form>
  );
}
```

### A.2 · Подключение в `payload.config.ts`

```typescript
admin: {
  components: {
    // ...existing
    views: {
      login: '@/components/admin/AdminLogin',  // ← новый путь
    },
  },
},
```

**Что Payload native handle:**
- Sessions / JWT / refresh
- `forgot-password` flow → существующий `/admin/forgot` route
- Reset password
- Account lockout после 5 неуспешных attempt

### A.3 · Состояния (FSM)

| State | Trigger | UI |
|---|---|---|
| `default` | onMount | email + password fields enabled, button «Войти» enabled при валидном email |
| `loading` | submit click | Button text → «Вход…», все поля disabled |
| `error.invalid_credentials` | login throws | inline error «Неверный email или пароль.» под form, fields enabled |
| `error.locked` | 5+ fail attempts | inline error «Аккаунт временно заблокирован. Попробуй через 15 минут.» |
| `error.network` | fetch failed | inline error «Не удалось войти. Проверь интернет.» |
| `error.unknown` | другое | generic «Что-то пошло не так. Попробуй ещё раз.» |

### A.4 · A11y (WCAG 2.2 AA)

- `aria-label="Вход в админку"` на form
- `aria-invalid` на email при error
- `aria-live="polite"` на error region
- `role="alert"` на error
- Focus-visible на всех interactive (Wave 1 SCSS уже покрыл через `:focus-visible`)
- Keyboard-only flow: Tab → email → Tab → password → Tab → button → Enter submit
- `autocomplete="email"` + `autocomplete="current-password"` для password managers
- reduced-motion отключает loading spinner animation (Wave 1 SCSS reduce-motion уже покрыл)

---

## Scope OUT (вынесено в Wave 2.B / другие waves)

- Magic link backend (REST endpoints, MagicLinkTokens collection) — Wave 2.B
- Telegram channel adapter — Wave 2.B
- Email channel adapter — Wave 2.B
- Замена email+password на email-only flow — Wave 2.B
- Mobile login UX — Wave 6 (mobile responsive)
- Recovery codes — Phase 3 security, отдельная US

---

## Acceptance Criteria

- [x] `sa-panel-wave2a.md` написан и одобрен popanel
- [ ] `site/components/admin/AdminLogin.tsx` создан
- [ ] Подключен в `payload.config.ts` `admin.components.views.login`
- [ ] Email + Password поля + «Войти» button работают через native Payload `useAuth().login`
- [ ] «Забыли пароль?» link ведёт на `/admin/forgot` (native Payload)
- [ ] Error states (invalid_credentials / locked / network / unknown) корректно отображаются
- [ ] Login screen матчится §12.1 mockup (визуал ревью `ux-panel`)
- [ ] **A11y WCAG 2.2 AA:**
  - [ ] aria-label на form
  - [ ] aria-invalid + aria-live на error
  - [ ] keyboard-only flow работает
  - [ ] focus-visible на всех interactive
  - [ ] autocomplete для password managers
  - [ ] reduced-motion guard
- [ ] **ADR-0005 follow-ups:**
  - [ ] Уровень 2 React (custom view) — тонкий слой над Payload `useAuth`
  - [ ] No `!important` без `// reason: ...` комментария
  - [ ] TypeScript types только из `payload` / `@payloadcms/ui` (не deeper)
- [ ] **`cr-panel` approve** (a11y + Payload best practices)
- [ ] **Playwright smoke** (Wave 7 spec покроет, в Wave 2.A минимум):
  - [ ] login flow: enter valid creds → /admin
  - [ ] login flow: enter invalid creds → error visible
  - [ ] forgot password link clickable → /admin/forgot

---

## Dev breakdown

| Task | Owner | Объём |
|---|---|---|
| `AdminLogin.tsx` custom view (FSM + a11y) | `fe-panel` | 0.4 чд |
| Подключение в `payload.config.ts` | `fe-panel` | 0.05 чд |
| Playwright smoke login flow | `qa-panel` | 0.05 чд |

**Итого:** ~0.5 чд (как в estimate)

---

## Pinging

- `popanel` — final approve после написания `AdminLogin.tsx` + screenshot vs §12.1
- `fe-panel` — kickoff dev (этот wave dev-ready, не ждёт PAN-9 / PAN-10)
- `qa-panel` — заранее подготовить test fixtures для login flow
